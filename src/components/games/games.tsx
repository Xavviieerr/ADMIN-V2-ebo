'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  X, 
  Upload,
  Eye,
  Save,
  Gamepad2,
  BookOpen,
  FileQuestion,
  Layers,
  Edit,
  ArrowLeft,
  Download
} from 'lucide-react'
import UploadModal from './UploadModal'
import { toast } from 'sonner'

interface GameOption {
  word: string
  image: string
}

interface MultipleChoiceQuestion {
  question: string
  options: GameOption[]
  answer: string
  type: 'multiple_choice'
}

interface TextInputQuestion {
  question: string
  answer: string
  acceptedAnswers: string[]
  caseSensitive: boolean
  type: 'text_input'
}

type Question = MultipleChoiceQuestion | TextInputQuestion

interface Lesson {
  lesson: string
  shortGreeting: string
  questions: Question[]
}

interface Level {
  level: string
  intro: string
  lessons: Lesson[]
}

interface GameData {
  id?: string
  title: string
  description: string
  levels: Level[]
  createdAt?: string
  updatedAt?: string
}

const STEPS = [
  { id: 1, name: 'Game Info', icon: Gamepad2 },
  { id: 2, name: 'Levels', icon: Layers },
  { id: 3, name: 'Lessons', icon: BookOpen },
  { id: 4, name: 'Questions', icon: FileQuestion },
]

type ViewMode = 'list' | 'create' | 'edit' | 'view'

export default function Games() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [currentStep, setCurrentStep] = useState(1)
  const [gameData, setGameData] = useState<GameData>({
    title: '',
    description: '',
    levels: []
  })
  const [gamesList, setGamesList] = useState<GameData[]>([])
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [_selectedLevelIndex, _setSelectedLevelIndex] = useState<number | null>(null)
  const [_selectedLessonIndex, _setSelectedLessonIndex] = useState<number | null>(null)

  // Load games from localStorage on mount
  useEffect(() => {
    const savedGames = localStorage.getItem('games')
    if (savedGames) {
      try {
        setGamesList(JSON.parse(savedGames))
      } catch (e) {
        console.error('Error loading games:', e)
      }
    }
  }, [])

  // Save games to localStorage whenever gamesList changes
  useEffect(() => {
    if (gamesList.length > 0 || viewMode === 'list') {
      localStorage.setItem('games', JSON.stringify(gamesList))
    }
  }, [gamesList, viewMode])

  const loadGameForEdit = (game: GameData) => {
    setGameData(game)
    setSelectedGameId(game.id || null)
    setCurrentStep(1)
    setViewMode('edit')
  }

  const loadGameForView = (game: GameData) => {
    setGameData(game)
    setViewMode('view')
  }

  const resetForm = () => {
    setGameData({
      title: '',
      description: '',
      levels: []
    })
    setCurrentStep(1)
    setSelectedGameId(null)
  }

  const handleCreateNew = () => {
    resetForm()
    setViewMode('create')
  }

  const handleBackToList = () => {
    resetForm()
    setViewMode('list')
  }

  const deleteGame = (gameId: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      setGamesList(prev => prev.filter(g => g.id !== gameId))
      toast.success('Game deleted successfully')
    }
  }

  const addLevel = () => {
    setGameData(prev => ({
      ...prev,
      levels: [...prev.levels, {
        level: String(prev.levels.length + 1),
        intro: '',
        lessons: []
      }]
    }))
    toast.success('Level added successfully')
  }

  const removeLevel = (index: number) => {
    setGameData(prev => ({
      ...prev,
      levels: prev.levels.filter((_, i) => i !== index)
    }))
    toast.success('Level removed')
  }

  const updateLevel = (index: number, field: 'level' | 'intro', value: string) => {
    setGameData(prev => ({
      ...prev,
      levels: prev.levels.map((level, i) => 
        i === index ? { ...level, [field]: value } : level
      )
    }))
  }

  const addLesson = (levelIndex: number) => {
    setGameData(prev => ({
      ...prev,
      levels: prev.levels.map((level, i) => 
        i === levelIndex 
          ? { ...level, lessons: [...level.lessons, { lesson: '', shortGreeting: '', questions: [] }] }
          : level
      )
    }))
    toast.success('Lesson added successfully')
  }

  const removeLesson = (levelIndex: number, lessonIndex: number) => {
    setGameData(prev => ({
      ...prev,
      levels: prev.levels.map((level, i) => 
        i === levelIndex 
          ? { ...level, lessons: level.lessons.filter((_, li) => li !== lessonIndex) }
          : level
      )
    }))
    toast.success('Lesson removed')
  }

  const updateLesson = (levelIndex: number, lessonIndex: number, field: 'lesson' | 'shortGreeting', value: string) => {
    setGameData(prev => ({
      ...prev,
      levels: prev.levels.map((level, i) => 
        i === levelIndex 
          ? {
              ...level,
              lessons: level.lessons.map((lesson, li) => 
                li === lessonIndex ? { ...lesson, [field]: value } : lesson
              )
            }
          : level
      )
    }))
  }

  const addQuestion = (levelIndex: number, lessonIndex: number, type: 'multiple_choice' | 'text_input') => {
    const newQuestion: Question = type === 'multiple_choice'
      ? {
          question: '',
          options: [{ word: '', image: '' }, { word: '', image: '' }, { word: '', image: '' }, { word: '', image: '' }],
          answer: '',
          type: 'multiple_choice'
        }
      : {
          question: '',
          answer: '',
          acceptedAnswers: [''],
          caseSensitive: false,
          type: 'text_input'
        }

    setGameData(prev => ({
      ...prev,
      levels: prev.levels.map((level, i) => 
        i === levelIndex 
          ? {
              ...level,
              lessons: level.lessons.map((lesson, li) => 
                li === lessonIndex 
                  ? { ...lesson, questions: [...lesson.questions, newQuestion] }
                  : lesson
              )
            }
          : level
      )
    }))
    toast.success(`${type === 'multiple_choice' ? 'Multiple choice' : 'Text input'} question added`)
  }

  const removeQuestion = (levelIndex: number, lessonIndex: number, questionIndex: number) => {
    setGameData(prev => ({
      ...prev,
      levels: prev.levels.map((level, i) => 
        i === levelIndex 
          ? {
              ...level,
              lessons: level.lessons.map((lesson, li) => 
                li === lessonIndex 
                  ? { ...lesson, questions: lesson.questions.filter((_, qi) => qi !== questionIndex) }
                  : lesson
              )
            }
          : level
      )
    }))
    toast.success('Question removed')
  }

  const updateQuestion = (
    levelIndex: number,
    lessonIndex: number,
    questionIndex: number,
    updates: Partial<MultipleChoiceQuestion> | Partial<TextInputQuestion>
  ) => {
    setGameData(prev => ({
      ...prev,
      levels: prev.levels.map((level, i) => 
        i === levelIndex 
          ? {
              ...level,
              lessons: level.lessons.map((lesson, li) => 
                li === lessonIndex 
                  ? {
                      ...lesson,
                      questions: lesson.questions.map((q, qi) => 
                        qi === questionIndex ? { ...q, ...updates } as Question : q
                      )
                    }
                  : lesson
              )
            }
          : level
      )
    }))
  }

  const updateMultipleChoiceOption = (
    levelIndex: number,
    lessonIndex: number,
    questionIndex: number,
    optionIndex: number,
    field: 'word' | 'image',
    value: string
  ) => {
    const question = gameData.levels[levelIndex].lessons[lessonIndex].questions[questionIndex] as MultipleChoiceQuestion
    const updatedOptions = question.options.map((opt, i) => 
      i === optionIndex ? { ...opt, [field]: value } : opt
    )
    updateQuestion(levelIndex, lessonIndex, questionIndex, { options: updatedOptions })
  }

  const addOption = (levelIndex: number, lessonIndex: number, questionIndex: number) => {
    const question = gameData.levels[levelIndex].lessons[lessonIndex].questions[questionIndex] as MultipleChoiceQuestion
    updateQuestion(levelIndex, lessonIndex, questionIndex, {
      options: [...question.options, { word: '', image: '' }]
    })
  }

  const removeOption = (levelIndex: number, lessonIndex: number, questionIndex: number, optionIndex: number) => {
    const question = gameData.levels[levelIndex].lessons[lessonIndex].questions[questionIndex] as MultipleChoiceQuestion
    if (question.options.length > 2) {
      updateQuestion(levelIndex, lessonIndex, questionIndex, {
        options: question.options.filter((_, i) => i !== optionIndex)
      })
    } else {
      toast.error('At least 2 options are required')
    }
  }

  const updateTextInputAcceptedAnswers = (
    levelIndex: number,
    lessonIndex: number,
    questionIndex: number,
    answerIndex: number,
    value: string
  ) => {
    const question = gameData.levels[levelIndex].lessons[lessonIndex].questions[questionIndex] as TextInputQuestion
    const updatedAnswers = question.acceptedAnswers.map((ans, i) => 
      i === answerIndex ? value : ans
    )
    updateQuestion(levelIndex, lessonIndex, questionIndex, { acceptedAnswers: updatedAnswers })
  }

  const addAcceptedAnswer = (levelIndex: number, lessonIndex: number, questionIndex: number) => {
    const question = gameData.levels[levelIndex].lessons[lessonIndex].questions[questionIndex] as TextInputQuestion
    updateQuestion(levelIndex, lessonIndex, questionIndex, {
      acceptedAnswers: [...question.acceptedAnswers, '']
    })
  }

  const removeAcceptedAnswer = (levelIndex: number, lessonIndex: number, questionIndex: number, answerIndex: number) => {
    const question = gameData.levels[levelIndex].lessons[lessonIndex].questions[questionIndex] as TextInputQuestion
    if (question.acceptedAnswers.length > 1) {
      updateQuestion(levelIndex, lessonIndex, questionIndex, {
        acceptedAnswers: question.acceptedAnswers.filter((_, i) => i !== answerIndex)
      })
    } else {
      toast.error('At least one accepted answer is required')
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return gameData.title.trim() !== '' && gameData.description.trim() !== ''
      case 2:
        return gameData.levels.length > 0 && gameData.levels.every(l => l.level && l.intro.trim() !== '')
      case 3:
        return gameData.levels.every(level => 
          level.lessons.length > 0 && 
          level.lessons.every(lesson => lesson.lesson.trim() !== '' && lesson.shortGreeting.trim() !== '')
        )
      case 4:
        return gameData.levels.every(level => 
          level.lessons.every(lesson => 
            lesson.questions.length > 0 && 
            lesson.questions.every(q => {
              if (q.type === 'multiple_choice') {
                const mcq = q as MultipleChoiceQuestion
                return mcq.question.trim() !== '' && 
                       mcq.answer.trim() !== '' && 
                       mcq.options.every(opt => opt.word.trim() !== '')
              } else {
                const tiq = q as TextInputQuestion
                return tiq.question.trim() !== '' && 
                       tiq.answer.trim() !== '' && 
                       tiq.acceptedAnswers.some(ans => ans.trim() !== '')
              }
            })
          )
        )
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed()) {
      if (currentStep < STEPS.length) {
        setCurrentStep(prev => prev + 1)
      }
    } else {
      toast.error('Please complete all required fields before proceeding')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSave = () => {
    if (!canProceed()) {
      toast.error('Please complete all required fields')
      return
    }

    // Format data according to quiz 2.json structure
    const _formattedData = {
      levels: gameData.levels.map(level => ({
        level: level.level,
        intro: level.intro,
        lessons: level.lessons.map(lesson => ({
          lesson: lesson.lesson,
          shortGreeting: lesson.shortGreeting,
          questions: lesson.questions.map(q => {
            if (q.type === 'multiple_choice') {
              const mcq = q as MultipleChoiceQuestion
              return {
                question: mcq.question,
                options: mcq.options,
                answer: mcq.answer,
                type: 'multiple_choice'
              }
            } else {
              const tiq = q as TextInputQuestion
              return {
                question: tiq.question,
                type: 'text_input',
                answer: tiq.answer,
                acceptedAnswers: tiq.acceptedAnswers.filter(ans => ans.trim() !== ''),
                caseSensitive: tiq.caseSensitive
              }
            }
          })
        }))
      }))
    }

    const now = new Date().toISOString()
    const gameToSave: GameData = {
      ...gameData,
      id: selectedGameId || `game-${Date.now()}`,
      updatedAt: now,
      createdAt: gameData.createdAt || now
    }

    if (viewMode === 'edit' && selectedGameId) {
      // Update existing game
      setGamesList(prev => prev.map(g => g.id === selectedGameId ? gameToSave : g))
      toast.success('Game updated successfully!')
    } else {
      // Create new game
      setGamesList(prev => [...prev, gameToSave])
      toast.success('Game created successfully!')
    }

    // Here you would typically send this to your API
    // For now, we're using localStorage via the useEffect hook
    
    // Reset and go back to list
    setTimeout(() => {
      handleBackToList()
    }, 1000)
  }


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 step-content">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Game Title *
                </label>
                <Input
                  value={gameData.title}
                  onChange={(e) => setGameData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter game title"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <Textarea
                  value={gameData.description}
                  onChange={(e) => setGameData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter game description"
                  className="w-full min-h-[120px]"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4 step-content">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-200">Levels</h3>
              <Button onClick={addLevel} size="sm" className="bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#F5DEB3]/90">
                <Plus className="h-4 w-4 mr-1" />
                Add Level
              </Button>
            </div>

            <div className="space-y-4">
              {gameData.levels.map((level, index) => (
                <div
                  key={index}
                  className="bg-[#1e1e1e] border border-white/10 rounded-lg p-4 space-y-3 level-item hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Level Number *
                        </label>
                        <Input
                          value={level.level}
                          onChange={(e) => updateLevel(index, 'level', e.target.value)}
                          placeholder="e.g., 1"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Introduction *
                        </label>
                        <Textarea
                          value={level.intro}
                          onChange={(e) => updateLevel(index, 'intro', e.target.value)}
                          placeholder="Enter level introduction"
                          className="w-full min-h-20"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => removeLevel(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-500 hover:bg-red-600/10 ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {gameData.levels.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No levels added yet. Click &quot;Add Level&quot; to get started.</p>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 step-content">
            {gameData.levels.map((level, levelIndex) => (
              <div key={levelIndex} className="space-y-4">
                <div className="flex justify-between items-center bg-[#1e1e1e] border border-white/10 rounded-lg p-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">Level {level.level}</h3>
                    <p className="text-sm text-gray-400">{level.intro}</p>
                  </div>
                  <Button
                    onClick={() => addLesson(levelIndex)}
                    size="sm"
                    className="bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#F5DEB3]/90"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Lesson
                  </Button>
                </div>

                <div className="space-y-3 ml-4">
                  {level.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="bg-[#1a1a1a] border border-white/5 rounded-lg p-4 space-y-3 transition-all duration-200 ease-in-out hover:border-white/10"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Lesson Name *
                            </label>
                            <Input
                              value={lesson.lesson}
                              onChange={(e) => updateLesson(levelIndex, lessonIndex, 'lesson', e.target.value)}
                              placeholder="e.g., Basic People Terms"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Short Greeting *
                            </label>
                            <Input
                              value={lesson.shortGreeting}
                              onChange={(e) => updateLesson(levelIndex, lessonIndex, 'shortGreeting', e.target.value)}
                              placeholder="e.g., Welcome to Lesson 1!"
                              className="w-full"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => removeLesson(levelIndex, lessonIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-500 hover:bg-red-600/10 ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {level.lessons.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No lessons added for this level yet.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 step-content">
            {gameData.levels.map((level, levelIndex) => (
              <div key={levelIndex} className="space-y-4">
                {level.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="space-y-4">
                    <div className="bg-[#1e1e1e] border border-white/10 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-md font-semibold text-gray-200">
                            Level {level.level} - {lesson.lesson}
                          </h4>
                          <p className="text-sm text-gray-400">{lesson.shortGreeting}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => addQuestion(levelIndex, lessonIndex, 'multiple_choice')}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Multiple Choice
                          </Button>
                          <Button
                            onClick={() => addQuestion(levelIndex, lessonIndex, 'text_input')}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Text Input
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {lesson.questions.map((question, questionIndex) => (
                          <div
                            key={questionIndex}
                            className="bg-[#1a1a1a] border border-white/5 rounded-lg p-4 space-y-4 transition-all duration-200 ease-in-out hover:border-white/10"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Question *
                                  </label>
                                  <Input
                                    value={question.question}
                                    onChange={(e) => updateQuestion(levelIndex, lessonIndex, questionIndex, { question: e.target.value })}
                                    placeholder="Enter question"
                                    className="w-full"
                                  />
                                </div>

                                {question.type === 'multiple_choice' ? (
                                  <>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Options *
                                      </label>
                                      <div className="space-y-3">
                                        {(question as MultipleChoiceQuestion).options.map((option, optIndex) => (
                                          <div key={optIndex} className="flex gap-3 items-start">
                                            <div className="flex-1 space-y-2">
                                              <Input
                                                value={option.word}
                                                onChange={(e) => updateMultipleChoiceOption(levelIndex, lessonIndex, questionIndex, optIndex, 'word', e.target.value)}
                                                placeholder="Option text"
                                                className="w-full"
                                              />
                                              <div className="flex gap-2">
                                                <Input
                                                  value={option.image}
                                                  onChange={(e) => updateMultipleChoiceOption(levelIndex, lessonIndex, questionIndex, optIndex, 'image', e.target.value)}
                                                  placeholder="Image URL or filename"
                                                  className="flex-1"
                                                />
                                                <UploadModal
                                                  type="image"
                                                  onUrlSelect={(url) => updateMultipleChoiceOption(levelIndex, lessonIndex, questionIndex, optIndex, 'image', url)}
                                                >
                                                  <Button type="button" size="sm" variant="outline">
                                                    <Upload className="h-3 w-3 mr-1" />
                                                    Upload
                                                  </Button>
                                                </UploadModal>
                                              </div>
                                            </div>
                                            {(question as MultipleChoiceQuestion).options.length > 2 && (
                                              <Button
                                                onClick={() => removeOption(levelIndex, lessonIndex, questionIndex, optIndex)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-400 hover:text-red-500"
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            )}
                                          </div>
                                        ))}
                                        <Button
                                          onClick={() => addOption(levelIndex, lessonIndex, questionIndex)}
                                          size="sm"
                                          variant="outline"
                                          className="w-full"
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          Add Option
                                        </Button>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Correct Answer *
                                      </label>
                                      <Input
                                        value={(question as MultipleChoiceQuestion).answer}
                                        onChange={(e) => updateQuestion(levelIndex, lessonIndex, questionIndex, { answer: e.target.value })}
                                        placeholder="Enter correct answer (must match one of the options)"
                                        className="w-full"
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Correct Answer *
                                      </label>
                                      <Input
                                        value={(question as TextInputQuestion).answer}
                                        onChange={(e) => updateQuestion(levelIndex, lessonIndex, questionIndex, { answer: e.target.value })}
                                        placeholder="Enter correct answer"
                                        className="w-full"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Accepted Answers *
                                      </label>
                                      <div className="space-y-2">
                                        {(question as TextInputQuestion).acceptedAnswers.map((ans, ansIndex) => (
                                          <div key={ansIndex} className="flex gap-2">
                                            <Input
                                              value={ans}
                                              onChange={(e) => updateTextInputAcceptedAnswers(levelIndex, lessonIndex, questionIndex, ansIndex, e.target.value)}
                                              placeholder="Accepted answer variant"
                                              className="flex-1"
                                            />
                                            {(question as TextInputQuestion).acceptedAnswers.length > 1 && (
                                              <Button
                                                onClick={() => removeAcceptedAnswer(levelIndex, lessonIndex, questionIndex, ansIndex)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-400 hover:text-red-500"
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            )}
                                          </div>
                                        ))}
                                        <Button
                                          onClick={() => addAcceptedAnswer(levelIndex, lessonIndex, questionIndex)}
                                          size="sm"
                                          variant="outline"
                                          className="w-full"
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          Add Accepted Answer
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`case-sensitive-${levelIndex}-${lessonIndex}-${questionIndex}`}
                                        checked={(question as TextInputQuestion).caseSensitive}
                                        onChange={(e) => updateQuestion(levelIndex, lessonIndex, questionIndex, { caseSensitive: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-400"
                                      />
                                      <label htmlFor={`case-sensitive-${levelIndex}-${lessonIndex}-${questionIndex}`} className="text-sm text-gray-300">
                                        Case Sensitive
                                      </label>
                                    </div>
                                  </>
                                )}
                              </div>
                              <Button
                                onClick={() => removeQuestion(levelIndex, lessonIndex, questionIndex)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-500 hover:bg-red-600/10 ml-4"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {lesson.questions.length === 0 && (
                          <div className="text-center py-8 text-gray-400 text-sm">
                            <FileQuestion className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No questions added for this lesson yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  const renderGamesList = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Games</h2>
            <p className="text-gray-400">Manage your learning games</p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#F5DEB3]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Game
          </Button>
        </div>

        {gamesList.length === 0 ? (
          <div className="text-center py-16 bg-[#1e1e1e] border border-white/10 rounded-xl">
            <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No games yet</h3>
            <p className="text-gray-400 mb-6">Get started by creating your first game</p>
            <Button
              onClick={handleCreateNew}
              className="bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#F5DEB3]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Game
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gamesList.map((game) => (
              <div
                key={game.id}
                className="bg-[#1e1e1e] border border-white/10 rounded-xl p-6 hover:border-[#F5DEB3]/50 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-200 mb-1">{game.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{game.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    <span>{game.levels.length} Level{game.levels.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>
                      {game.levels.reduce((acc, level) => acc + level.lessons.length, 0)} Lesson{game.levels.reduce((acc, level) => acc + level.lessons.length, 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileQuestion className="h-4 w-4" />
                    <span>
                      {game.levels.reduce((acc, level) => 
                        acc + level.lessons.reduce((acc2, lesson) => acc2 + lesson.questions.length, 0), 0
                      )} Question{game.levels.reduce((acc, level) => 
                        acc + level.lessons.reduce((acc2, lesson) => acc2 + lesson.questions.length, 0), 0
                      ) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {game.createdAt && (
                  <p className="text-xs text-gray-500 mb-4">
                    Created: {new Date(game.createdAt).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => loadGameForView(game)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    onClick={() => loadGameForEdit(game)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => game.id && deleteGame(game.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-500 hover:bg-red-600/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderGameView = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Button
              onClick={handleBackToList}
              variant="ghost"
              size="sm"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">{gameData.title}</h2>
            <p className="text-gray-400">{gameData.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => loadGameForEdit(gameData)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => {
                const formattedData = {
                  levels: gameData.levels.map(level => ({
                    level: level.level,
                    intro: level.intro,
                    lessons: level.lessons.map(lesson => ({
                      lesson: lesson.lesson,
                      shortGreeting: lesson.shortGreeting,
                      questions: lesson.questions.map(q => {
                        if (q.type === 'multiple_choice') {
                          const mcq = q as MultipleChoiceQuestion
                          return {
                            question: mcq.question,
                            options: mcq.options,
                            answer: mcq.answer,
                            type: 'multiple_choice'
                          }
                        } else {
                          const tiq = q as TextInputQuestion
                          return {
                            question: tiq.question,
                            type: 'text_input',
                            answer: tiq.answer,
                            acceptedAnswers: tiq.acceptedAnswers.filter(ans => ans.trim() !== ''),
                            caseSensitive: tiq.caseSensitive
                          }
                        }
                      })
                    }))
                  }))
                }
                const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${gameData.title || 'game'}.json`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
                toast.success('Game exported as JSON!')
              }}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {gameData.levels.map((level, levelIndex) => (
            <div key={levelIndex} className="bg-[#1e1e1e] border border-white/10 rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-200 mb-2">Level {level.level}</h3>
                <p className="text-gray-400">{level.intro}</p>
              </div>

              <div className="space-y-4">
                {level.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="bg-[#1a1a1a] border border-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-200 mb-2">{lesson.lesson}</h4>
                    <p className="text-sm text-gray-400 mb-4">{lesson.shortGreeting}</p>

                    <div className="space-y-3">
                      {lesson.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="bg-[#0a0a0a] border border-white/5 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-300 mb-3">{question.question}</p>
                          {question.type === 'multiple_choice' ? (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500 mb-2">Options:</p>
                              <div className="grid grid-cols-2 gap-2">
                                {(question as MultipleChoiceQuestion).options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`p-2 rounded border ${
                                      option.word === (question as MultipleChoiceQuestion).answer
                                        ? 'border-green-500 bg-green-500/10'
                                        : 'border-white/10 bg-[#1e1e1e]'
                                    }`}
                                  >
                                    <p className="text-sm text-gray-300">{option.word}</p>
                                    {option.image && (
                                      <p className="text-xs text-gray-500 mt-1">{option.image}</p>
                                    )}
                                    {option.word === (question as MultipleChoiceQuestion).answer && (
                                      <span className="text-xs text-green-400 mt-1 block">✓ Correct Answer</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500">Correct Answer:</p>
                              <p className="text-sm text-gray-300 bg-[#1e1e1e] p-2 rounded">
                                {(question as TextInputQuestion).answer}
                              </p>
                              {(question as TextInputQuestion).acceptedAnswers.length > 0 && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Accepted Answers:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {(question as TextInputQuestion).acceptedAnswers.map((ans, ansIndex) => (
                                      <span key={ansIndex} className="text-xs bg-[#1e1e1e] px-2 py-1 rounded text-gray-300">
                                        {ans}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {(question as TextInputQuestion).caseSensitive && (
                                <p className="text-xs text-gray-500">Case Sensitive: Yes</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderCreateEditForm = () => {
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInBottom {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .step-content {
          animation: slideInRight 0.3s ease-out;
        }
        .level-item {
          animation: slideInBottom 0.2s ease-out;
        }
      `}} />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={handleBackToList}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            {viewMode === 'edit' ? 'Edit Game' : 'Create Game'}
          </h1>
          <p className="text-gray-400">Build interactive learning games for your users</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-[#F5DEB3] border-[#F5DEB3] text-[#1e1e1e]'
                        : 'bg-transparent border-gray-600 text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`text-sm font-medium ${currentStep >= step.id ? 'text-gray-200' : 'text-gray-500'}`}>
                      {step.name}
                    </div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-[#F5DEB3]' : 'bg-gray-600'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#1e1e1e] border border-white/10 rounded-xl p-6 md:p-8 shadow-lg min-h-[500px]">
          {renderStepContent()}
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center mt-6">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                size="sm"
                className="bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#F5DEB3]/90"
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#F5DEB3]/90"
                disabled={!canProceed()}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Game
              </Button>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#18191f] text-white">
      <div className="max-w-6xl mx-auto">
        {viewMode === 'list' && renderGamesList()}
        {viewMode === 'view' && renderGameView()}
        {(viewMode === 'create' || viewMode === 'edit') && renderCreateEditForm()}
      </div>
    </div>
  )
}
