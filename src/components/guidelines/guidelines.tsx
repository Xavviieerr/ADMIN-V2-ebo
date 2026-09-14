'use client'
import React, { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {Pencil, Check, X, Plus, Trash2 } from 'lucide-react'
import { usePermissions } from '@/hooks/usePermissions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

const STORAGE_KEY = 'guidelines_data'

// Note: Guidelines data is loaded from API endpoint /api/guidelines
// No static JSON import is used to avoid build issues

// Type definitions for guidelines data structure
interface ContentItem {
  type: 'paragraph' | 'list' | 'examples'
  text?: string
  items?: string[]
  incorrect?: string
  correct?: string
  correctList?: string[]
  correctLabel?: string
  examples?: Array<{ type: string; text: string }>
  label?: string
}

interface Subsection {
  type: 'subsection'
  heading: string
  content: ContentItem[]
}

interface Section {
  type: 'section' | 'paragraph'
  heading?: string
  text?: string
  content?: ContentItem[]
  subsections?: Subsection[]
}

interface TabData {
  title: string
  sections: Section[]
}

interface GuidelinesData {
  word: TabData
  province: TabData
  games: TabData
  users: TabData
  encyclopedia: TabData
  other: TabData
}

// Default fallback structure - will be replaced by API data on mount
const defaultGuidelinesData: GuidelinesData = {
  word: {
    title: "GUỌNỌ DICTIONARY GUIDELINES",
    sections: []
  },
  province: {
    title: "Province Guidelines",
    sections: []
  },
  games: {
    title: "Games Guidelines",
    sections: []
  },
  users: {
    title: "Users Guidelines",
    sections: []
  },
  encyclopedia: {
    title: "Encyclopedia Guidelines",
    sections: []
  },
  other: {
    title: "Other Guidelines",
    sections: []
  }
}

// Helper function to get nested value by path
function getNestedValue(obj: any, path: string[]): any {
  return path.reduce((current, key) => current?.[key], obj)
}

// Helper function to set nested value by path
function setNestedValue(obj: any, path: string[], value: any): any {
  const newObj = { ...obj }
  const lastKey = path[path.length - 1]
  const parentPath = path.slice(0, -1)
  const parent = parentPath.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key]
  }, newObj)
  parent[lastKey] = value
  return newObj
}

interface EditableTextProps {
  value: string
  path: string[]
  onSave: (path: string[], value: string) => void
  isEditable: boolean
  className?: string
  as?: 'h2' | 'h3' | 'h4' | 'p' | 'span'
}

function EditableText({ value, path, onSave, isEditable, className = '', as = 'span' }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleSave = () => {
    onSave(path, editValue)
    setIsEditing(false)
    toast.success('Updated successfully')
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  if (!isEditable) {
    const Component = as
    return <Component className={`${className} whitespace-pre-wrap`}>{value}</Component>
  }

  if (isEditing) {
    const InputComponent = as === 'p' || as === 'span' ? Textarea : Input
    return (
      <div className="flex items-start gap-2 w-full">
        <InputComponent
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className={`flex-1 ${className}`}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && as !== 'p' && as !== 'span') {
              e.preventDefault()
              handleSave()
            } else if (e.key === 'Escape') {
              handleCancel()
            }
          }}
        />
        <div className="flex gap-1 shrink-0">
          <Button
            size="sm"
            variant="default"
            onClick={handleSave}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const Component = as
  return (
    <div className="flex items-center gap-2 group">
      <Component className={`${className} whitespace-pre-wrap`}>{value}</Component>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1 hover:bg-[#2a2a2a] rounded"
        title="Edit"
      >
        <Pencil className="h-4 w-4 text-[#F5DEB3]" />
      </button>
    </div>
  )
}

interface EditableListItemProps {
  item: string
  path: string[]
  onSave: (path: string[], value: string) => void
  isEditable: boolean
}

function EditableListItem({ item, path, onSave, isEditable }: EditableListItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(item)

  useEffect(() => {
    setEditValue(item)
  }, [item])

  const handleSave = () => {
    onSave(path, editValue)
    setIsEditing(false)
    toast.success('Updated successfully')
  }

  const handleCancel = () => {
    setEditValue(item)
    setIsEditing(false)
  }

  if (!isEditable) {
    return <li className="text-gray-300 whitespace-pre-wrap">{item}</li>
  }

  if (isEditing) {
    return (
      <li className="flex items-start gap-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="flex-1"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSave()
            } else if (e.key === 'Escape') {
              handleCancel()
            }
          }}
        />
        <div className="flex gap-1 shrink-0">
          <Button
            size="sm"
            variant="default"
            onClick={handleSave}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-2 group">
      <span className="text-gray-300 flex-1 whitespace-pre-wrap">{item}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1 hover:bg-[#2a2a2a] rounded"
        title="Edit"
      >
        <Pencil className="h-4 w-4 text-[#F5DEB3]" />
      </button>
    </li>
  )
}

interface EditableExampleProps {
  example: any
  path: string[]
  onSave: (path: string[], value: any) => void
  isEditable: boolean
}

function EditableExample({ example, path, onSave, isEditable }: EditableExampleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(example)

  useEffect(() => {
    setEditValue(example)
  }, [example])

  const handleSave = () => {
    onSave(path, editValue)
    setIsEditing(false)
    toast.success('Updated successfully')
  }

  const handleCancel = () => {
    setEditValue(example)
    setIsEditing(false)
  }

  const renderDisplay = () => {
    if (example.incorrect && example.correct && !example.correctList) {
      return (
        <>
            <p className="text-red-400 whitespace-pre-wrap">
              <span className="font-semibold">Incorrect:</span> {example.incorrect}
            </p>
            <p className="text-green-400 whitespace-pre-wrap">
              <span className="font-semibold">Correct:</span> {example.correct}
            </p>
        </>
      )
    }
    if (example.examples && Array.isArray(example.examples)) {
      return (
        <div className="space-y-2">
          {example.label && (
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">{example.label}</span>
            </p>
          )}
          {example.examples.map((ex: any, idx: number) => (
            <p key={idx} className={`${ex.type === 'incorrect' ? 'text-red-400' : ex.type === 'correct' ? 'text-green-400' : 'text-gray-300'} whitespace-pre-wrap`}>
              {ex.text}
            </p>
          ))}
        </div>
      )
    }
    if (example.incorrect && example.correctList) {
      return (
        <>
          <p className="text-red-400 whitespace-pre-wrap">
            <span className="font-semibold">Incorrect:</span> {example.incorrect}
          </p>
          <p className="text-green-400 whitespace-pre-wrap">
            <span className="font-semibold">{example.correctLabel || 'Correct:'}</span>
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
            {example.correctList.map((item: string, idx: number) => (
              <li key={idx} className="whitespace-pre-wrap">{item}</li>
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  const renderEdit = () => {
    if (example.incorrect && example.correct && !example.correctList) {
      return (
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-red-400 shrink-0 pt-2">Incorrect:</span>
            <Input
              value={editValue.incorrect || ''}
              onChange={(e) => setEditValue({ ...editValue, incorrect: e.target.value })}
              className="flex-1 text-red-400 border-red-500/50 focus:border-red-500"
              style={{ color: '#f87171' }}
            />
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-green-400 shrink-0 pt-2">Correct:</span>
            <Input
              value={editValue.correct || ''}
              onChange={(e) => setEditValue({ ...editValue, correct: e.target.value })}
              className="flex-1 text-green-400 border-green-500/50 focus:border-green-500"
              style={{ color: '#4ade80' }}
            />
          </div>
          <div className="flex gap-1 justify-end mt-2">
            <Button size="sm" variant="default" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )
    }
    if (example.examples && Array.isArray(example.examples)) {
      return (
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-gray-300 shrink-0 pt-2">Label:</span>
            <Input
              value={editValue.label || ''}
              onChange={(e) => setEditValue({ ...editValue, label: e.target.value })}
              className="flex-1"
              placeholder="Optional label"
            />
          </div>
          {editValue.examples.map((ex: any, idx: number) => {
            const labelLower = (editValue.label || '').toLowerCase()
            const textLower = (ex.text || '').toLowerCase()
            const isIncorrect = ex.type === 'incorrect' || labelLower.includes('incorrect') || textLower.includes('incorrect:')
            const isCorrect = ex.type === 'correct' || labelLower.includes('correct') || textLower.includes('correct:')
            const textColor = isIncorrect ? 'text-red-400' : isCorrect ? 'text-green-400' : 'text-gray-300'
            const inputBorderColor = isIncorrect ? 'border-red-500/50 focus:border-red-500' : isCorrect ? 'border-green-500/50 focus:border-green-500' : ''
            
            return (
              <div key={idx} className="flex items-start gap-2">
                <select
                  value={ex.type || ''}
                  onChange={(e) => {
                    const newExamples = [...editValue.examples]
                    newExamples[idx] = { ...ex, type: e.target.value }
                    setEditValue({ ...editValue, examples: newExamples })
                  }}
                  className="bg-[#1e1e1e] border border-white/10 p-2 rounded-md text-white shrink-0"
                >
                  <option value="" className="text-white">Type</option>
                  <option value="incorrect" className="text-white">Incorrect</option>
                  <option value="correct" className="text-white">Correct</option>
                </select>
                <Input
                  value={ex.text || ''}
                  onChange={(e) => {
                    const newExamples = [...editValue.examples]
                    newExamples[idx] = { ...ex, text: e.target.value }
                    setEditValue({ ...editValue, examples: newExamples })
                  }}
                  className={`flex-1 ${textColor} ${inputBorderColor}`}
                  placeholder="Example text (e.g., 'incorrect: yes' or 'correct: no')"
                  style={{
                    color: isIncorrect ? '#f87171' : isCorrect ? '#4ade80' : undefined
                  }}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newExamples = editValue.examples.filter((_: any, i: number) => i !== idx)
                    setEditValue({ ...editValue, examples: newExamples })
                  }}
                  className="text-red-400 hover:text-red-500 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditValue({
                ...editValue,
                examples: [...(editValue.examples || []), { type: '', text: '' }]
              })
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Example
          </Button>
          <div className="flex gap-1 justify-end">
            <Button size="sm" variant="default" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )
    }
    if (example.incorrect && example.correctList) {
      return (
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-red-400 shrink-0 pt-2">Incorrect:</span>
            <Input
              value={editValue.incorrect || ''}
              onChange={(e) => setEditValue({ ...editValue, incorrect: e.target.value })}
              className="flex-1 text-red-400 border-red-500/50 focus:border-red-500"
              style={{ color: '#f87171' }}
            />
          </div>
          {editValue.correctLabel && (
            <div className="flex items-start gap-2">
              <span className="font-semibold text-green-400 shrink-0 pt-2">Correct Label:</span>
              <Input
                value={editValue.correctLabel || ''}
                onChange={(e) => setEditValue({ ...editValue, correctLabel: e.target.value })}
                className="flex-1"
              />
            </div>
          )}
          <div className="space-y-2">
            <span className="font-semibold text-green-400">Correct List:</span>
            {editValue.correctList.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newList = [...editValue.correctList]
                    newList[idx] = e.target.value
                    setEditValue({ ...editValue, correctList: newList })
                  }}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-1 justify-end">
            <Button size="sm" variant="default" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )
    }
    return null
  }

  if (!isEditable) {
    return renderDisplay()
  }

  if (isEditing) {
    return renderEdit()
  }

  return (
    <div className="group relative">
      {renderDisplay()}
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity absolute top-0 right-0 p-1 hover:bg-[#2a2a2a] rounded"
        title="Edit"
      >
        <Pencil className="h-4 w-4 text-[#F5DEB3]" />
      </button>
    </div>
  )
}

export default function Guidelines() {
  const [activeTab, setActiveTab] = useState('word')
  const [data, setData] = useState(defaultGuidelinesData)
  const [isLoading, setIsLoading] = useState(true)
  const { isSuperAdmin } = usePermissions()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [sectionToDelete, setSectionToDelete] = useState<{ idx: number; tab?: string } | null>(null)

  // Load from API on mount (source of truth) – no cache so we get latest gist
  useEffect(() => {
    const fetchGuidelines = async () => {
      try {
        const response = await fetch('/api/guidelines', { cache: 'no-store' })
        const result = await response.json()
        if (result.success && result.data) {
          setData(result.data)
          // Also update localStorage as cache
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data))
          }
        } else {
          // Fallback to localStorage if API fails
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
              try {
                const parsed = JSON.parse(stored)
                setData(parsed)
              } catch (e) {
                console.error('Failed to parse stored guidelines:', e)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching guidelines:', error)
        // Fallback to localStorage if API fails
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              setData(parsed)
            } catch (e) {
              console.error('Failed to parse stored guidelines:', e)
            }
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuidelines()
  }, [])

  // Save to localStorage as cache whenever data changes (after API save)
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [data, isLoading])

  const saveToAPI = async (newData: any) => {
    try {
      const response = await fetch('/api/guidelines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: newData }),
      })

      const result = await response.json()
      if (result.success) {
        // Refetch from API so we see the same content as the server (avoids cache)
        try {
          const getRes = await fetch('/api/guidelines', { cache: 'no-store' })
          const getResult = await getRes.json()
          if (getResult.success && getResult.data) {
            setData(getResult.data)
            if (typeof window !== 'undefined') {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(getResult.data))
            }
          } else {
            setData(newData)
            if (typeof window !== 'undefined') {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
            }
          }
        } catch {
          setData(newData)
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
          }
        }
        toast.success('Guidelines saved successfully')
        return true
      } else {
        toast.error('Failed to save guidelines')
        return false
      }
    } catch (error) {
      console.error('Error saving guidelines:', error)
      toast.error('Failed to save guidelines')
      return false
    }
  }

  // Refresh guidelines from API on window focus only (no polling to avoid repeated fetches; always fetch fresh)
  useEffect(() => {
    const refreshGuidelines = async () => {
      try {
        const response = await fetch('/api/guidelines', { cache: 'no-store' })
        const result = await response.json()
        if (result.success && result.data) {
          setData(result.data)
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data))
          }
        }
      } catch (error) {
        console.error('Error refreshing guidelines:', error)
      }
    }

    // Refresh only when user switches back to tab (gets latest gist without constant polling)
    const handleFocus = () => {
      refreshGuidelines()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const handleSave = async (path: string[], value: any) => {
    const newData = setNestedValue(data, path, value)
    setData(newData)
    // Save to API
    await saveToAPI(newData)
  }

  const handleAddSection = async (tab?: string) => {
    const tabKey = tab || activeTab
    const currentTabData = data[tabKey as keyof typeof data]
    const newSection = {
      type: 'section',
      heading: 'New Section',
      content: [
        {
          type: 'paragraph',
          text: 'Add your content here.'
        }
      ],
      subsections: []
    }
    const newData = {
      ...data,
      [tabKey]: {
        ...currentTabData,
        sections: [...currentTabData.sections, newSection]
      }
    }
    setData(newData)
    await saveToAPI(newData)
    toast.success('Section added successfully')
  }

  const handleDeleteSection = (sectionIdx: number, tab?: string) => {
    setSectionToDelete({ idx: sectionIdx, tab })
    setDeleteModalOpen(true)
  }

  const handleAddSubsection = async (sectionIdx: number, tab?: string) => {
    const tabKey = tab || activeTab
    const currentTabData = data[tabKey as keyof typeof data]
    const currentSections: Section[] = currentTabData.sections || []
    const target = currentSections[sectionIdx] as Section
    const subsections: Subsection[] = (target?.subsections as Subsection[]) || []
    const newSubsection: Subsection = {
      type: 'subsection',
      heading: 'New Subsection',
      content: [
        {
          type: 'paragraph',
          text: 'Add your content here.'
        }
      ]
    }
    const updatedSections = [...currentSections]
    updatedSections[sectionIdx] = {
      ...target,
      subsections: [...subsections, newSubsection]
    } as Section
    const newData = {
      ...data,
      [tabKey]: {
        ...currentTabData,
        sections: updatedSections
      }
    }
    setData(newData)
    await saveToAPI(newData)
    toast.success('Subsection added successfully')
  }

  const handleDeleteSubsection = async (sectionIdx: number, subIdx: number, tab?: string) => {
    const tabKey = tab || activeTab
    const currentTabData = data[tabKey as keyof typeof data]
    const currentSections: Section[] = currentTabData.sections || []
    const target = currentSections[sectionIdx] as Section
    const subsections: Subsection[] = (target?.subsections as Subsection[]) || []
    const updatedSections = [...currentSections]
    updatedSections[sectionIdx] = {
      ...target,
      subsections: subsections.filter((_: Subsection, i: number) => i !== subIdx)
    } as Section
    const newData = {
      ...data,
      [tabKey]: {
        ...currentTabData,
        sections: updatedSections
      }
    }
    setData(newData)
    await saveToAPI(newData)
    toast.success('Subsection removed successfully')
  }

  const handleAddExampleBlock = async (contentPath: string[], tab?: string) => {
    const tabKey = tab || activeTab
    const currentContent = getNestedValue(data, contentPath) || []
    const newExample = {
      type: 'examples',
      incorrect: '',
      correct: '',
      correctList: [],
      examples: []
    }
    const newData = setNestedValue(data, contentPath, [...currentContent, newExample])
    setData(newData)
    await saveToAPI(newData)
    toast.success('Example block added')
  }

  const handleDeleteExampleBlock = async (contentPath: string[], idx: number) => {
    const currentContent = getNestedValue(data, contentPath) || []
    const newContent = currentContent.filter((_: any, i: number) => i !== idx)
    const newData = setNestedValue(data, contentPath, newContent)
    setData(newData)
    await saveToAPI(newData)
    toast.success('Example block removed')
  }

  const confirmDeleteSection = async () => {
    if (!sectionToDelete) return
    
    const { idx: sectionIdx, tab } = sectionToDelete
    const tabKey = tab || activeTab
    const currentTabData = data[tabKey as keyof typeof data]
    const newSections = currentTabData.sections.filter((_: any, idx: number) => idx !== sectionIdx)
    const newData = {
      ...data,
      [tabKey]: {
        ...currentTabData,
        sections: newSections
      }
    }
    setData(newData)
    await saveToAPI(newData)
    toast.success('Section deleted successfully')
    setDeleteModalOpen(false)
    setSectionToDelete(null)
  }

  const renderContent = (content: any[], basePath: string[]) => {
    return content.map((item, idx) => {
      const itemPath = [...basePath, idx.toString()]
      
      if (item.type === 'paragraph') {
        return (
          <p key={idx} className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            <EditableText
              value={item.text}
              path={[...itemPath, 'text']}
              onSave={handleSave}
              isEditable={isSuperAdmin}
              as="span"
            />
          </p>
        )
      }
      
      if (item.type === 'list') {
        return (
          <ul key={idx} className="list-disc list-inside text-gray-300 space-y-1 ml-4">
            {item.items.map((listItem: string, listIdx: number) => (
              <EditableListItem
                key={listIdx}
                item={listItem}
                path={[...itemPath, 'items', listIdx.toString()]}
                onSave={handleSave}
                isEditable={isSuperAdmin}
              />
            ))}
          </ul>
        )
      }
      
      if (item.type === 'examples') {
        return (
          <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-lg p-3 space-y-2 relative group">
            <EditableExample
              example={item}
              path={itemPath}
              onSave={handleSave}
              isEditable={isSuperAdmin}
            />
            {isSuperAdmin && (
              <div className=" flex gap-2">
                <button
                  onClick={() => handleDeleteExampleBlock(basePath, idx)}
                  className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded text-red-400"
                  title="Delete example block"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )
      }
      
      return null
    })
  }

  const renderSection = (section: any, basePath: string[], tabKey: string) => {
    const sectionPath = [...basePath, 'sections']
    const currentTabData = data[tabKey as keyof typeof data]
    const sectionIdx = currentTabData.sections.findIndex((s: any) => s === section)
    const fullPath = [...sectionPath, sectionIdx.toString()]
    const subsections = (section as any).subsections || []

    return (
      <section key={sectionIdx} className="space-y-4 group relative">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <EditableText
              value={section.heading}
              path={[...fullPath, 'heading']}
              onSave={handleSave}
              isEditable={isSuperAdmin}
              as="h3"
              className="text-xl font-semibold text-[#F5DEB3]"
            />
          </div>
          {isSuperAdmin && (
            <button
              onClick={() => handleDeleteSection(sectionIdx, tabKey)}
              className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded text-red-400"
              title="Delete section"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {section.content && renderContent(section.content, [...fullPath, 'content'])}

        {isSuperAdmin && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddExampleBlock([...fullPath, 'content'], tabKey)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Example
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddSubsection(sectionIdx, tabKey)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Subsection
            </Button>
          </div>
        )}
        
        {subsections.map((subsection: any, subIdx: number) => {
          const subPath = [...fullPath, 'subsections', subIdx.toString()]
          return (
            <div key={subIdx} className="space-y-3 relative group">
              <EditableText
                value={subsection.heading}
                path={[...subPath, 'heading']}
                onSave={handleSave}
                isEditable={isSuperAdmin}
                as="h4"
                className="text-lg font-semibold text-white mb-2"
              />
              {isSuperAdmin && (
                <div className="flex flex-wrap gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddExampleBlock([...subPath, 'content'], tabKey)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Example
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-500"
                    onClick={() => handleDeleteSubsection(sectionIdx, subIdx, tabKey)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Subsection
                  </Button>
                </div>
              )}
              {subsection.content && renderContent(subsection.content, [...subPath, 'content'])}
            </div>
          )
        })}
      </section>
    )
  }

  const currentTabData = data[activeTab as keyof typeof data]

  if (isLoading) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Loading guidelines...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white">
      {/* Header */}
      <div className="mb-6 sm:mb-8 mt-3 sm:mt-5">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Guidelines</h1>
        <p className="text-sm text-gray-400 mt-2">Follow these guidelines to ensure consistency and quality across all content.</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-4 overflow-x-auto no-scrollbar w-full grid grid-cols-1">
          <TabsList className="inline-flex lg:grid lg:grid-cols-6 bg-[#1E1E1E] border border-white/10 lg:w-full w-max min-w-full text-white!">
            <TabsTrigger value="word" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! text-white! whitespace-nowrap px-4 lg:w-full shrink-0 font-medium">
              Word
            </TabsTrigger>
            <TabsTrigger value="province" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! text-white! whitespace-nowrap px-4 lg:w-full shrink-0 font-medium">
              Province
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! text-white! whitespace-nowrap px-4 lg:w-full shrink-0 font-medium">
              Games
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! text-white! whitespace-nowrap px-4 lg:w-full shrink-0 font-medium">
              Users
            </TabsTrigger>
            <TabsTrigger value="encyclopedia" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! text-white! whitespace-nowrap px-4 lg:w-full shrink-0 font-medium">
              Encyclopedia
            </TabsTrigger>
            <TabsTrigger value="other" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! text-white! whitespace-nowrap px-4 lg:w-full shrink-0 font-medium">
              Other
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Word Guidelines Tab */}
        <TabsContent value="word" className="mt-6">
          <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-4 sm:p-6 md:p-8 space-y-6">
            <div className="text-center mb-8">
              <EditableText
                value={currentTabData.title}
                path={[activeTab, 'title']}
                onSave={handleSave}
                isEditable={isSuperAdmin}
                as="h2"
                className="text-2xl sm:text-3xl font-bold text-white mb-2"
              />
            </div>

            {currentTabData.sections.map((section: any, idx: number) => 
              renderSection(section, [activeTab], activeTab)
            )}

            {isSuperAdmin && (
              <div className="pt-4 border-t border-white/10">
                <Button
                  onClick={() => handleAddSection(activeTab)}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Other Tabs */}
        {['province', 'games', 'users', 'encyclopedia', 'other'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-4 sm:p-6 md:p-8 space-y-6">
              <EditableText
                value={data[tab as keyof typeof data].title}
                path={[tab, 'title']}
                onSave={handleSave}
                isEditable={isSuperAdmin}
                as="h2"
                className="text-2xl font-semibold text-white mb-4"
              />
              {data[tab as keyof typeof data].sections.map((section: any, idx: number) => {
                if (section.type === 'paragraph') {
                  return (
                    <div key={idx} className="group relative">
                      <p className="text-gray-400 whitespace-pre-wrap">
                        <EditableText
                          value={section.text}
                          path={[tab, 'sections', idx.toString(), 'text']}
                          onSave={handleSave}
                          isEditable={isSuperAdmin}
                          as="span"
                        />
                      </p>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDeleteSection(idx, tab)}
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity absolute top-0 right-0 p-2 hover:bg-red-500/20 rounded text-red-400"
                          title="Delete section"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
          </div>
                  )
                }
                return renderSection(section, [tab], tab)
              })}
              {isSuperAdmin && (
                <div className="pt-4 border-t border-white/10">
                  <Button
                    onClick={() => handleAddSection(tab)}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
          </div>
              )}
          </div>
        </TabsContent>
        ))}
      </Tabs>

      {/* Delete Section Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this section? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteModalOpen(false)
                setSectionToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteSection}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
