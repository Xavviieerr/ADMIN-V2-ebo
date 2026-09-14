'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import { X, GripVertical } from 'lucide-react'

interface VirtualUrhoboKeyboardProps {
  onInput?: (input: string) => void
  targetInputId?: string
  className?: string
  onClose?: () => void
}

export default function VirtualUrhoboKeyboard({ 
  onInput, 
  targetInputId,
  className = '',
  onClose
}: VirtualUrhoboKeyboardProps) {
  const [input, setInput] = useState('')
  const [layoutName, setLayoutName] = useState('default')
  const [language, setLanguage] = useState<'eng' | 'urh'>('urh')
  const [showIPA, setShowIPA] = useState(false) // For IPA phonetic characters
  const [keyboardMode, setKeyboardMode] = useState<'abc' | '123' | 'symbols'>('abc') // ABC, 123, or symbols mode
  const [showVariants, setShowVariants] = useState(false) // Show accented/variant letters
  const keyboardRef = useRef<any>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0 })
  // Track if Enter key was recently pressed to distinguish from button clicks
  const enterKeyPressedRef = useRef(false)
  
  // Long press popup state
  const [longPressPopup, setLongPressPopup] = useState<{
    visible: boolean
    x: number
    y: number
    characters: string[]
    baseChar: string
  } | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const longPressButtonRef = useRef<string | null>(null)
  const isLongPressActive = useRef<boolean>(false)

  // English QWERTY layout - organized by mode
  const englishLayout = {
    abc: {
      default: [
        'q w e r t y u i o p',
        'a s d f g h j k l',
        '{shift} z x c v b n m {bksp}',
        '{123} {lang} {space} {enter}'
      ],
      shift: [
        'Q W E R T Y U I O P {bksp}',
        'A S D F G H J K L {enter}',
        '{shift} Z X C V B N M {shift}',
        '{123} {lang} {space} {enter}'
      ]
    },
    '123': {
      default: [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        '- / : ; ( ) $ & @ " {enter}',
        '{symbols} . , ? ! \' {symbols}',
        '{abc} {lang} {space} {enter}'
      ],
      shift: [
        '[ ] { } # % ^ * + = {bksp}',
        '_ \\ | ~ < > € £ ¥ • {enter}',
        '{symbols} . , ? ! \' {symbols}',
        '{abc} {lang} {space} {enter}'
      ]
    },
    symbols: {
      default: [
        '[ ] { } # % ^ * + = {bksp}',
        '_ \\ | ~ < > € £ ¥ • {enter}',
        '{123} . , ? ! \' {123}',
        '{abc} {lang} {space} {enter}'
      ],
      shift: [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        '- / : ; ( ) $ & @ " {enter}',
        '{123} . , ? ! \' {123}',
        '{abc} {lang} {space} {enter}'
      ]
    }
  }

  // Urhobo layout - organized by mode
  const urhoboLayout = {
    abc: {
      default: [
        't b k s g j p y n l',
        '{variants} a e ọ u r h o ẹ i {bksp}',
        '{shift} z c v w f d m {enter}',
        '{123} {lang} ? , {space} ! . {ipa}'
      ],
      shift: [
        'T B K S G J P Y N L',
        '{variants} A E Ọ U R H O Ẹ I {enter}',
        '{shift} Z C V W F D M {bksp}',
        '{123} {lang} ? , {space} ! . {ipa}'
      ],
      variants: {
        default: [
          'á à ã é è ẽ í ì ĩ ó ò õ',
          'ẹ ọ ɛ ɛ́ ɛ̀ ɛ̃ ɔ ɔ́ ɔ̀ ɔ̃ {enter}',
          '{shift} {variants} ú ù ũ , . ? ! {bksp}',
          '{123} {lang} {space} {ipa} {enter}'
        ],
        shift: [
          'Á À Ã É È Ẽ Í Ì Ĩ Ó Ò Õ',
          'Ẹ Ọ ɛ ɛ́ ɛ̀ ɛ̃ ɔ ɔ́ ɔ̀ ɔ̃ {enter}',
          '{shift} {variants} Ú Ù Ũ , . ? ! {bksp}',
          '{123} {lang} {space} {ipa} {enter}'
        ]
      }
    },
    '123': {
      default: [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        '- / : ; ( ) $ & @ " {enter}',
        '{symbols} . , ? ! \' {symbols}',
        '{abc} {lang} {space} {ipa} {enter}'
      ],
      shift: [
        '[ ] { } # % ^ * + = {bksp}',
        '_ \\ | ~ < > € £ ¥ • {enter}',
        '{symbols} . , ? ! \' {symbols}',
        '{abc} {lang} {space} {ipa} {enter}'
      ]
    },
    symbols: {
      default: [
        '[ ] { } # % ^ * + = {bksp}',
        '_ \\ | ~ < > € £ ¥ • {enter}',
        '{123} . , ? ! \' {123}',
        '{abc} {lang} {space} {ipa} {enter}'
      ],
      shift: [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        '- / : ; ( ) $ & @ " {enter}',
        '{123} . , ? ! \' {123}',
        '{abc} {lang} {space} {ipa} {enter}'
      ]
    },
    ipa: {
      default: [
        'ɛ ɔ ʄ ɡ͡b ɣ k͡p ɸ · ɾ ɾ̣',
        'ɣw ɣ͡w ŋm ŋ͡m ɲ mw ghw {enter}',
        '{shift} ʃ β gb , . ? ! {bksp}',
        '{123} {lang} {space} {ipa} {enter}'
      ],
      shift: [
        'ɛ ɔ ʄ ɡ͡b ɣ k͡p ŋm ŋ͡m ɲ mw ɸ ɾ',
        'ɣw ɣ͡w dj gh kp ny ph rh sh vw {enter}',
        '{shift} ʃ β gb ghw , . ? ! {bksp}',
        '{123} {lang} {space} {ipa} {enter}'
      ]
    }
  }

  // Get current layout based on language, IPA state, keyboard mode, and variants
  const currentLayout = useMemo(() => {
    if (language === 'eng') {
      return englishLayout[keyboardMode] || englishLayout.abc
    } else {
      if (showIPA) {
        return urhoboLayout.ipa
      }
      const baseLayout = urhoboLayout[keyboardMode] || urhoboLayout.abc
      // If showing variants and we have a variants layout, use it
      if (showVariants && 'variants' in baseLayout && baseLayout.variants) {
        return baseLayout.variants
      }
      return baseLayout
    }
  }, [language, showIPA, keyboardMode, showVariants])

  // Character variants mapping for long press
  const characterVariants: Record<string, string[]> = {
    'a': ['a', 'á', 'à', 'ã', 'A', 'Á', 'À', 'Ã'],
    'e': ['e', 'é', 'è', 'ẽ', 'E', 'É', 'È', 'Ẽ'],
    'i': ['i', 'í', 'ì', 'ĩ', 'I', 'Í', 'Ì', 'Ĩ'],
    'o': ['o', 'ó', 'ò', 'õ', 'O', 'Ó', 'Ò', 'Õ'],
    'u': ['u', 'ú', 'ù', 'ũ', 'U', 'Ú', 'Ù', 'Ũ'],
    'ẹ': ['ẹ', 'Ẹ'],
    'ọ': ['ọ', 'Ọ'],
    'ɛ': ['ɛ', 'ɛ́', 'ɛ̀', 'ɛ̃'],
    'ɔ': ['ɔ', 'ɔ́', 'ɔ̀', 'ɔ̃'],
    'ch': ['ch', 'Ch', 'CH'],
    'dj': ['dj', 'Dj', 'DJ'],
    'gb': ['gb', 'Gb', 'GB', 'ɡ͡b'],
    'gh': ['gh', 'Gh', 'GH', 'ɣ'],
    'kp': ['kp', 'Kp', 'KP', 'k͡p'],
    'mw': ['mw', 'Mw', 'MW', 'ŋm', 'ŋ͡m'],
    'ny': ['ny', 'Ny', 'NY', 'ɲ'],
    'ph': ['ph', 'Ph', 'PH', 'ɸ'],
    'rh': ['rh', 'Rh', 'RH', 'ɾ̣'],
    'sh': ['sh', 'Sh', 'SH', 'ʃ'],
    'vw': ['vw', 'Vw', 'VW', 'β'],
    'ghw': ['ghw', 'Ghw', 'GHW', 'ɣw', 'ɣ͡w']
  }

  // Display names for special buttons
  const displayNames = useMemo(() => ({
    '{bksp}': '⌫',
    '{tab}': 'Tab',
    '{lock}': 'Caps',
    '{shift}': '⇧',
    '{enter}': language === 'urh' ? 'ruru' : '↵',
    '{space}': language === 'urh' ? 'uphẹ' : 'Space',
    '{lang}': language === 'eng' ? 'Urh' : 'Eng',
    '{ipa}': showIPA ? 'ABC' : 'IPA',
    '{abc}': 'ABC',
    '{123}': '123?',
    '{symbols}': '=/<',
    '{variants}': showVariants ? 'ABC' : 'áéí'
  }), [language, showIPA, showVariants])

  // Drag handlers - Fixed to use top positioning (desktop only, disabled on mobile)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Disable dragging on mobile devices
    if (isMobile.current) return
    
    // Only allow dragging from the drag handle area
    const target = e.target as HTMLElement
    const dragHandle = target.closest('.virtual-urhobo-keyboard-wrapper > div:first-child')
    if (!dragHandle) return
    
    // Don't start dragging if clicking on close button
    if (target.closest('button[aria-label="Close keyboard"]')) {
      return
    }
    
    e.stopPropagation()
    if (wrapperRef.current) {
      setIsDragging(true)
      const rect = wrapperRef.current.getBoundingClientRect()
      dragStartPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Disable dragging on mobile devices
    if (isMobile.current) return
    
    // Only allow dragging from the drag handle area
    const target = e.target as HTMLElement
    const dragHandle = target.closest('.virtual-urhobo-keyboard-wrapper > div:first-child')
    if (!dragHandle) return
    
    // Don't start dragging if clicking on close button
    if (target.closest('button[aria-label="Close keyboard"]')) {
      return
    }
    
    e.stopPropagation()
    if (wrapperRef.current && e.touches.length > 0) {
      setIsDragging(true)
      const rect = wrapperRef.current.getBoundingClientRect()
      dragStartPos.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && wrapperRef.current) {
        e.preventDefault() // Prevent text selection and scrolling
        // Calculate position from top-left corner
        const newX = e.clientX - dragStartPos.current.x
        const newY = e.clientY - dragStartPos.current.y
        
        // Constrain to viewport
        const maxX = window.innerWidth - wrapperRef.current.offsetWidth
        const maxY = window.innerHeight - wrapperRef.current.offsetHeight
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        })
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && wrapperRef.current && e.touches.length > 0) {
        e.preventDefault() // Prevent scrolling while dragging
        // Calculate position from top-left corner
        const newX = e.touches[0].clientX - dragStartPos.current.x
        const newY = e.touches[0].clientY - dragStartPos.current.y
        
        // Constrain to viewport
        const maxX = window.innerWidth - wrapperRef.current.offsetWidth
        const maxY = window.innerHeight - wrapperRef.current.offsetHeight
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchend', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchend', handleMouseUp)
      }
    }
  }, [isDragging])

  // Helper function to trigger React Hook Form's onChange handler
  const triggerReactHookFormChange = (input: HTMLInputElement | HTMLTextAreaElement, value: string) => {
    // Method 1: Use native value setter to bypass React's value tracking, then trigger events
    // This is the most reliable way to trigger React Hook Form's onChange
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 
      'value'
    )?.set || Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 
      'value'
    )?.set
    
    if (nativeInputValueSetter) {
      // Set the value using the native setter (bypasses React's controlled component check)
      nativeInputValueSetter.call(input, value)
    } else {
      // Fallback if native setter is not available
      input.value = value
    }
    
    // Create and dispatch input event (React Hook Form listens to this)
    const inputEvent = new Event('input', { bubbles: true, cancelable: true })
    Object.defineProperty(inputEvent, 'target', { 
      value: input, 
      enumerable: true,
      writable: false 
    })
    input.dispatchEvent(inputEvent)
    
    // Also dispatch change event for compatibility
    const changeEvent = new Event('change', { bubbles: true, cancelable: true })
    Object.defineProperty(changeEvent, 'target', { 
      value: input, 
      enumerable: true,
      writable: false 
    })
    input.dispatchEvent(changeEvent)
    
    // Method 2: Try to find and call React Hook Form's onChange directly
    // This is a fallback if events don't work
    try {
      const reactKey = Object.keys(input).find(key => 
        key.startsWith('__reactFiber') || 
        key.startsWith('__reactInternalInstance') ||
        key.startsWith('__reactContainer')
      )
      
      if (reactKey) {
        const reactFiber = (input as any)[reactKey]
        if (reactFiber) {
          // Traverse the fiber tree to find the onChange handler
          let fiber = reactFiber
          let depth = 0
          while (fiber && depth < 10) { // Limit depth to avoid infinite loops
            const props = fiber.memoizedProps || fiber.pendingProps
            if (props?.onChange) {
              // Create a synthetic event-like object that React Hook Form expects
              const syntheticEvent = {
                target: { 
                  value,
                  name: props.name || input.name || '',
                  id: input.id || '',
                },
                currentTarget: input,
                preventDefault: () => {},
                stopPropagation: () => {},
              }
              props.onChange(syntheticEvent as any)
              return
            }
            fiber = fiber.return || fiber._owner
            depth++
          }
        }
      }
    } catch (e) {
      // If React fiber access fails, rely on events only
      console.debug('Could not access React fiber for onChange', e)
    }
  }

  // Insert text at cursor position in target input
  const insertAtCursor = (text: string) => {
    if (targetInputId) {
      const targetInput = document.getElementById(targetInputId) as HTMLInputElement | HTMLTextAreaElement
      if (targetInput) {
        const start = targetInput.selectionStart || 0
        const end = targetInput.selectionEnd || 0
        const currentValue = targetInput.value || ''
        const newValue = currentValue.slice(0, start) + text + currentValue.slice(end)
        
        // Set cursor position after inserted text
        const newCursorPos = start + text.length
        
        // Trigger React Hook Form's onChange handler
        triggerReactHookFormChange(targetInput, newValue)
        
        // Set cursor position after React updates
        setTimeout(() => {
          targetInput.setSelectionRange(newCursorPos, newCursorPos)
        }, 0)
        
        return newValue
      }
    }
    return null
  }

  // Delete character at cursor position
  const deleteAtCursor = () => {
    if (targetInputId) {
      const targetInput = document.getElementById(targetInputId) as HTMLInputElement | HTMLTextAreaElement
      if (targetInput) {
        const start = targetInput.selectionStart || 0
        const end = targetInput.selectionEnd || 0
        const currentValue = targetInput.value || ''
        
        if (start === end && start > 0) {
          // Delete one character before cursor
          const newValue = currentValue.slice(0, start - 1) + currentValue.slice(start)
          const newCursorPos = start - 1
          
          // Trigger React Hook Form's onChange handler
          triggerReactHookFormChange(targetInput, newValue)
          
          // Set cursor position after React updates
          setTimeout(() => {
            targetInput.setSelectionRange(newCursorPos, newCursorPos)
          }, 0)
          
          return newValue
        } else if (start !== end) {
          // Delete selection
          const newValue = currentValue.slice(0, start) + currentValue.slice(end)
          
          // Trigger React Hook Form's onChange handler
          triggerReactHookFormChange(targetInput, newValue)
          
          // Set cursor position after React updates
          setTimeout(() => {
            targetInput.setSelectionRange(start, start)
          }, 0)
          
          return newValue
        }
      }
    }
    return null
  }

  const onChange = (inputValue: string) => {
    setInput(inputValue)
    if (onInput) {
      onInput(inputValue)
    }
  }

  const onKeyPress = (button: string) => {
    // Don't process key press if long press popup is showing or if we're in a long press state
    if (longPressPopup?.visible || isLongPressActive.current) {
      // If this is the same button that triggered long press, ignore it
      if (longPressButtonRef.current && button === longPressButtonRef.current) {
        return
      }
    }
    
    // Handle special buttons - these should never trigger form submission or modal closing
    if (button === '{shift}' || button === '{lock}') {
      const newLayout = layoutName === 'default' ? 'shift' : 'default'
      setLayoutName(newLayout)
      if (keyboardRef.current) {
        keyboardRef.current.setOptions({ layoutName: newLayout })
      }
      return // Prevent any further processing
    } else if (button === '{lang}') {
      // Toggle between English and Urhobo
      const newLanguage = language === 'eng' ? 'urh' : 'eng'
      setLanguage(newLanguage)
      setShowIPA(false) // Reset IPA view when switching languages
      setKeyboardMode('abc') // Reset to ABC mode when switching languages
      setShowVariants(false) // Reset variants when switching languages
      setLayoutName('default') // Reset layout name
      // The useEffect hook will automatically update the keyboard layout
      return // Prevent any further processing
    } else if (button === '{ipa}') {
      // Toggle IPA mode in Urhobo
      if (language === 'urh') {
        const newShowIPA = !showIPA
        setShowIPA(newShowIPA)
        setLayoutName('default') // Reset to default layout name
      }
      return // Prevent any further processing
    } else if (button === '{abc}') {
      // Switch to ABC mode
      setKeyboardMode('abc')
      setShowVariants(false) // Reset variants when switching modes
      setLayoutName('default')
      return // Prevent any further processing
    } else if (button === '{123}') {
      // Switch to 123 mode
      setKeyboardMode('123')
      setShowVariants(false) // Reset variants when switching modes
      setLayoutName('default')
      return // Prevent any further processing
    } else if (button === '{symbols}') {
      // Switch to symbols mode
      setKeyboardMode('symbols')
      setShowVariants(false) // Reset variants when switching modes
      setLayoutName('default')
      return // Prevent any further processing
    } else if (button === '{variants}') {
      // Toggle variants (accented letters) in Urhobo mode
      if (language === 'urh' && keyboardMode === 'abc' && !showIPA) {
        setShowVariants(!showVariants)
        setLayoutName('default') // Reset to default layout name
      }
      return // Prevent any further processing
    } else if (button === '{tab}') {
      const newValue = insertAtCursor('\t')
      if (newValue !== null) {
        setInput(newValue)
        if (onInput) onInput(newValue)
        if (keyboardRef.current) {
          keyboardRef.current.setInput(newValue)
        }
      }
      return // Prevent tab from moving focus
    } else if (button === '{space}') {
      const newValue = insertAtCursor(' ')
      if (newValue !== null) {
        setInput(newValue)
        if (onInput) onInput(newValue)
        if (keyboardRef.current) {
          keyboardRef.current.setInput(newValue)
        }
      }
      return
    } else if (button === '{enter}') {
      // Check if target input is in a form and handle accordingly
      if (targetInputId) {
        const targetInput = document.getElementById(targetInputId) as HTMLInputElement | HTMLTextAreaElement
        if (targetInput) {
          const form = targetInput.closest('form')
          const isTextarea = targetInput.tagName === 'TEXTAREA'
          
          // If it's a textarea, always insert newline
          if (isTextarea) {
            const newValue = insertAtCursor('\n')
            if (newValue !== null) {
              setInput(newValue)
              if (onInput) onInput(newValue)
              if (keyboardRef.current) {
                keyboardRef.current.setInput(newValue)
              }
            }
            return
          }
          
          // If it's a single-line input in a form, prevent form submission
          // Only insert newline if it's not in a form, or if form has preventDefault
          if (form) {
            // Don't insert newline, and prevent form submission
            // The form should be submitted via submit button, not enter key
            return
          } else {
            // Not in a form, insert newline (though single-line inputs won't show it)
            const newValue = insertAtCursor('\n')
            if (newValue !== null) {
              setInput(newValue)
              if (onInput) onInput(newValue)
              if (keyboardRef.current) {
                keyboardRef.current.setInput(newValue)
              }
            }
            return
          }
        }
      }
      // Fallback: insert newline if no target input
      const newValue = insertAtCursor('\n')
      if (newValue !== null) {
        setInput(newValue)
        if (onInput) onInput(newValue)
        if (keyboardRef.current) {
          keyboardRef.current.setInput(newValue)
        }
      }
      return
    } else if (button === '{bksp}') {
      const newValue = deleteAtCursor()
      if (newValue !== null) {
        setInput(newValue)
        if (onInput) onInput(newValue)
        if (keyboardRef.current) {
          keyboardRef.current.setInput(newValue)
        }
      } else {
        // If no target input, just update internal state
        const newInput = input.slice(0, -1)
        setInput(newInput)
        if (onInput) onInput(newInput)
        if (keyboardRef.current) {
          keyboardRef.current.setInput(newInput)
        }
      }
    } else if (!button.startsWith('{')) {
      // Regular character
      const newValue = insertAtCursor(button)
      if (newValue !== null) {
        setInput(newValue)
        if (onInput) onInput(newValue)
        if (keyboardRef.current) {
          keyboardRef.current.setInput(newValue)
        }
      } else {
        // If no target input, just update internal state
        const newInput = input + button
        setInput(newInput)
        if (onInput) onInput(newInput)
        if (keyboardRef.current) {
          keyboardRef.current.setInput(newInput)
        }
      }
    }
  }

  // Update keyboard layout when language, IPA state, or keyboard mode changes
  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.setOptions({
        layout: currentLayout,
        layoutName: layoutName,
        display: displayNames
      })
    }
  }, [currentLayout, layoutName, displayNames, language, keyboardMode, showIPA, showVariants])

  // Handle long press for character variants (mobile)
  useEffect(() => {
    if (language !== 'urh') return // Only in Urhobo mode
    
    const keyboardElement = wrapperRef.current?.querySelector('.hg-theme-default')
    if (!keyboardElement) return

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (!target.classList.contains('hg-button')) return
      
      const buttonText = target.textContent?.trim() || ''
      // Skip special buttons
      if (buttonText.startsWith('{') || buttonText.length === 0) return
      
      // Check if this character has variants
      const baseChar = buttonText.toLowerCase()
      const variants = characterVariants[baseChar] || characterVariants[buttonText]
      
      if (!variants || variants.length <= 1) return
      
      longPressButtonRef.current = buttonText
      
      // Start long press timer
      longPressTimer.current = setTimeout(() => {
        isLongPressActive.current = true
        const rect = target.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const topY = rect.top - 10
        
        // Ensure popup stays within viewport
        const popupWidth = Math.min(variants.length * 44 + 16, 300) // Approximate width
        const adjustedX = Math.max(popupWidth / 2, Math.min(centerX, window.innerWidth - popupWidth / 2))
        
        setLongPressPopup({
          visible: true,
          x: adjustedX,
          y: Math.max(10, topY), // Ensure it doesn't go off top of screen
          characters: variants,
          baseChar: buttonText
        })
      }, 500) // 500ms long press
    }

    const handleTouchEnd = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
        // If timer was cleared before popup showed, reset state immediately
        if (!isLongPressActive.current) {
          longPressButtonRef.current = null
        }
      }
    }

    const handleTouchMove = () => {
      // Cancel long press if finger moves
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    }

    keyboardElement.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true })
    keyboardElement.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true })
    keyboardElement.addEventListener('touchmove', handleTouchMove as EventListener, { passive: true })
    keyboardElement.addEventListener('touchcancel', handleTouchEnd as EventListener, { passive: true })

    return () => {
      keyboardElement.removeEventListener('touchstart', handleTouchStart as EventListener)
      keyboardElement.removeEventListener('touchend', handleTouchEnd as EventListener)
      keyboardElement.removeEventListener('touchmove', handleTouchMove as EventListener)
      keyboardElement.removeEventListener('touchcancel', handleTouchEnd as EventListener)
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [language, characterVariants])

  // Handle variant selection from popup
  const handleVariantSelect = (variant: string) => {
    // Insert the selected variant
    const newValue = insertAtCursor(variant)
    if (newValue !== null) {
      setInput(newValue)
      if (onInput) onInput(newValue)
      if (keyboardRef.current) {
        keyboardRef.current.setInput(newValue)
      }
    } else {
      // If no target input, just update internal state
      const newInput = input + variant
      setInput(newInput)
      if (onInput) onInput(newInput)
      if (keyboardRef.current) {
        keyboardRef.current.setInput(newInput)
      }
    }
    // Reset long press state
    isLongPressActive.current = false
    longPressButtonRef.current = null
    setLongPressPopup(null)
  }

  // Close popup when clicking outside
  useEffect(() => {
    if (!longPressPopup?.visible) return

    const handleClickOutside = (e: Event) => {
      const target = e.target as HTMLElement
      if (!target.closest('.long-press-popup')) {
        // Reset long press state when closing popup
        isLongPressActive.current = false
        longPressButtonRef.current = null
        setLongPressPopup(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [longPressPopup])

  // Prevent native keyboard on mobile when virtual keyboard is active
  // But allow focus changes between inputs
  useEffect(() => {
    if (!isMobile.current) return

    const preventNativeKeyboardFocus = (e: Event) => {
      const focusEvent = e as FocusEvent
      const target = focusEvent.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        const input = target as HTMLInputElement | HTMLTextAreaElement
        // Set inputMode to 'none' to prevent native keyboard AFTER focus happens
        // Use setTimeout to ensure focus completes first
        setTimeout(() => {
          input.setAttribute('inputmode', 'none')
        }, 0)
      }
    }

    const preventNativeKeyboardTouch = (e: Event) => {
      const touchEvent = e as TouchEvent
      const target = touchEvent.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        const input = target as HTMLInputElement | HTMLTextAreaElement
        // Set inputMode to 'none' immediately to prevent keyboard
        input.setAttribute('inputmode', 'none')
        
        // Don't prevent default - allow focus to happen naturally
        // The inputMode='none' will prevent the keyboard from appearing
      }
    }

    // Listen for focus events on all inputs to set inputMode after focus
    document.addEventListener('focusin', preventNativeKeyboardFocus, true)
    // Listen for touchstart to set inputMode before focus (but don't prevent default)
    document.addEventListener('touchstart', preventNativeKeyboardTouch, { passive: true, capture: true })

    return () => {
      document.removeEventListener('focusin', preventNativeKeyboardFocus, true)
      document.removeEventListener('touchstart', preventNativeKeyboardTouch, true)
    }
  }, [])

  // Prevent dialog from closing when interacting with keyboard (but allow close button and drag handle to work)
  useEffect(() => {
    const isCloseButton = (target: HTMLElement): boolean => {
      // Check if target is the close button or inside it
      const button = target.closest('button[aria-label="Close keyboard"]')
      if (button) return true
      // Check if target is an SVG icon inside a button in the keyboard wrapper
      if (target.tagName === 'svg' || target.tagName === 'path') {
        const parentButton = target.closest('.virtual-urhobo-keyboard-wrapper button')
        if (parentButton && parentButton.getAttribute('aria-label') === 'Close keyboard') {
          return true
        }
      }
      return false
    }

    const isDragHandle = (target: HTMLElement): boolean => {
      // Check if target is in the drag handle area (the div with the grip icon)
      const dragHandle = target.closest('.virtual-urhobo-keyboard-wrapper > div:first-child')
      if (dragHandle) {
        // Don't prevent if clicking on close button within drag handle
        if (!isCloseButton(target)) {
          return true
        }
      }
      return false
    }

    const isKeyboardElement = (target: HTMLElement): boolean => {
      return !!(
        target.closest('.virtual-urhobo-keyboard-wrapper') || 
        target.closest('[data-keyboard-widget="true"]') ||
        target.closest('.hg-theme-default') ||
        target.closest('.hg-button')
      )
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Don't prevent if clicking on close button or drag handle
      if (isCloseButton(target) || isDragHandle(target)) {
        return // Allow close button and drag handle to work
      }
      // Prevent all keyboard interactions from closing modals
      if (isKeyboardElement(target)) {
        e.stopPropagation()
        e.preventDefault()
        // stopImmediatePropagation exists on native MouseEvent
        e.stopImmediatePropagation()
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Don't prevent if clicking on close button or drag handle
      if (isCloseButton(target) || isDragHandle(target)) {
        return // Allow close button and drag handle to work
      }
      // Prevent all keyboard interactions from closing modals
      if (isKeyboardElement(target)) {
        e.stopPropagation()
        e.preventDefault()
        // stopImmediatePropagation exists on native MouseEvent
        e.stopImmediatePropagation()
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      // Don't prevent if clicking on close button
      if (isCloseButton(target)) {
        return // Allow close button to work
      }
      // On mobile, allow drag handle to work (don't prevent)
      if (isDragHandle(target)) {
        return // Allow drag handle to work on mobile
      }
      // Prevent all keyboard interactions from closing modals
      if (isKeyboardElement(target)) {
        e.stopPropagation()
        e.preventDefault()
        // stopImmediatePropagation exists on native TouchEvent
        e.stopImmediatePropagation()
      }
    }

    // Track Enter key presses to distinguish from button clicks
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && targetInputId) {
        const activeElement = document.activeElement as HTMLElement
        if (activeElement && activeElement.id === targetInputId) {
          enterKeyPressedRef.current = true
          // Reset after a short delay
          setTimeout(() => {
            enterKeyPressedRef.current = false
          }, 100)
        }
      }
    }

    // Prevent form submission ONLY when enter is pressed from keyboard
    // Allow form submission when submit button is clicked
    const handleFormSubmit = (e: SubmitEvent) => {
      const target = e.target as HTMLElement
      // If the submit was triggered from a keyboard button, prevent it
      if (isKeyboardElement(target)) {
        e.stopPropagation()
        e.preventDefault()
        return false
      }
      
      // Check if submit was triggered by a button click (not Enter key)
      // If submitter exists and is a button, allow the submission
      const submitter = (e as any).submitter as HTMLElement | null
      if (submitter) {
        const isButton = submitter.tagName === 'BUTTON'
        const isSubmitInput = submitter.tagName === 'INPUT' && (submitter as HTMLInputElement).type === 'submit'
        if (isButton || isSubmitInput) {
          // This is a legitimate button click - allow form submission
          enterKeyPressedRef.current = false // Reset flag
          return
        }
      }
      
      // Check if the currently focused input is the one using the keyboard
      // AND the submit was triggered by Enter key (not button click)
      const activeElement = document.activeElement as HTMLElement
      if (activeElement && targetInputId && activeElement.id === targetInputId) {
        // Only prevent if Enter key was recently pressed (not button click)
        if (enterKeyPressedRef.current) {
          // This was triggered by Enter key - prevent form submission
          // Forms should only submit via submit button, not enter key
          e.stopPropagation()
          e.preventDefault()
          enterKeyPressedRef.current = false // Reset flag
          return false
        }
        // If Enter key wasn't pressed, this might be a button click - allow it
      }
    }

    // Listen for Enter key presses
    document.addEventListener('keydown', handleKeyDown, true)

    // Use capture phase to intercept before Radix UI's handlers
    document.addEventListener('click', handleClick, true)
    document.addEventListener('mousedown', handleMouseDown, true)
    document.addEventListener('touchstart', handleTouchStart, true)
    document.addEventListener('submit', handleFormSubmit, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('mousedown', handleMouseDown, true)
      document.removeEventListener('touchstart', handleTouchStart, true)
      document.removeEventListener('submit', handleFormSubmit, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [targetInputId])

  // Add event listeners to all keyboard buttons after render to prevent modal closing
  useEffect(() => {
    if (!wrapperRef.current) return

    const handleButtonClick = (e: Event) => {
      e.stopPropagation()
      e.preventDefault()
      // stopImmediatePropagation exists on MouseEvent
      if (e instanceof MouseEvent) {
        e.stopImmediatePropagation()
      }
    }

    const handleButtonMouseDown = (e: Event) => {
      e.stopPropagation()
      e.preventDefault()
      // stopImmediatePropagation exists on MouseEvent
      if (e instanceof MouseEvent) {
        e.stopImmediatePropagation()
      }
    }

    const handleButtonTouchStart = (e: Event) => {
      e.stopPropagation()
      e.preventDefault()
      // stopImmediatePropagation exists on TouchEvent
      if (e instanceof TouchEvent) {
        e.stopImmediatePropagation()
      }
    }

    const keyboardButtons = wrapperRef.current.querySelectorAll('.hg-button')
    
    keyboardButtons.forEach((button) => {
      button.addEventListener('click', handleButtonClick, true)
      button.addEventListener('mousedown', handleButtonMouseDown, true)
      button.addEventListener('touchstart', handleButtonTouchStart, true)
      // Also prevent form submission if button is inside a form
      button.addEventListener('submit', (e) => {
        e.stopPropagation()
        e.preventDefault()
        if ('stopImmediatePropagation' in e) {
          (e as any).stopImmediatePropagation()
        }
      }, true)
    })

    return () => {
      keyboardButtons.forEach((button) => {
        button.removeEventListener('click', handleButtonClick, true)
        button.removeEventListener('mousedown', handleButtonMouseDown, true)
        button.removeEventListener('touchstart', handleButtonTouchStart, true)
      })
    }
  }, [currentLayout, layoutName, language, showIPA, keyboardMode, showVariants])

  // Detect mobile device
  const isMobile = useRef(
    typeof window !== 'undefined' && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.matchMedia && window.matchMedia('(max-width: 768px)').matches && 'ontouchstart' in window)
    )
  )

  // Sync with target input and prevent form submission on Enter
  // This effect runs when targetInputId changes, allowing focus to switch between inputs
  useEffect(() => {
    if (targetInputId) {
      const targetInput = document.getElementById(targetInputId) as HTMLInputElement | HTMLTextAreaElement
      if (targetInput) {
        // Ensure visible cursor and allow cursor movement when virtual keyboard is active
        const originalCaretColor = targetInput.style.caretColor
        const originalUserSelect = targetInput.style.userSelect
        targetInput.style.caretColor = '#F5DEB3'
        targetInput.style.userSelect = 'text'
        targetInput.setAttribute('data-virtual-keyboard-target', 'true')
        targetInput.classList.add('virtual-keyboard-target-input')

        // Sync the keyboard with the current input value
        const currentValue = targetInput.value || ''
        if (currentValue !== input) {
          setInput(currentValue)
          if (keyboardRef.current) {
            keyboardRef.current.setInput(currentValue)
          }
        }
        // On mobile, prevent native keyboard from appearing
        if (isMobile.current) {
          // Store original inputMode if it exists
          const originalInputMode = targetInput.getAttribute('inputmode')
          
          // Set inputMode to 'none' to prevent native keyboard
          targetInput.setAttribute('inputmode', 'none')
          
          const ensureCaretVisible = () => {
            requestAnimationFrame(() => {
              const start = targetInput.selectionStart ?? targetInput.value?.length ?? 0
              const end = targetInput.selectionEnd ?? start
              targetInput.setSelectionRange(start, end)
            })
          }

          const handleFocus = (e: Event) => {
            // Ensure inputMode is still 'none' when focused
            if (targetInput.getAttribute('inputmode') !== 'none') {
              targetInput.setAttribute('inputmode', 'none')
            }
            // Force caret to be visible and allow cursor positioning (some browsers hide it with inputmode="none")
            ensureCaretVisible()
          }

          // When user clicks/taps to move cursor, re-apply selection so caret stays visible (no preventDefault)
          const handleClick = () => {
            ensureCaretVisible()
          }
          
          // Only listen to focus to ensure inputMode stays 'none'
          // Don't prevent touchstart - allow natural focus behavior
          targetInput.addEventListener('focus', handleFocus as EventListener)
          targetInput.addEventListener('click', handleClick)
          
          // Prevent form submission when Enter is pressed in this input
          const handleKeyDown = (e: Event) => {
            const keyEvent = e as KeyboardEvent
            // If Enter is pressed and it's not a textarea, prevent form submission
            if (keyEvent.key === 'Enter' && targetInput.tagName !== 'TEXTAREA') {
              const form = targetInput.closest('form')
              if (form) {
                // Prevent form submission - user should use submit button
                keyEvent.preventDefault()
                keyEvent.stopPropagation()
              }
            }
          }

          // Prevent Enter from submitting forms
          targetInput.addEventListener('keydown', handleKeyDown, true)

          const syncInput = () => {
            const value = targetInput.value || ''
            if (value !== input) {
              setInput(value)
              if (keyboardRef.current) {
                keyboardRef.current.setInput(value)
              }
            }
          }
          
          targetInput.addEventListener('input', syncInput)
          targetInput.addEventListener('change', syncInput)
          
          return () => {
            targetInput.removeEventListener('input', syncInput)
            targetInput.removeEventListener('change', syncInput)
            targetInput.removeEventListener('keydown', handleKeyDown, true)
            targetInput.removeEventListener('focus', handleFocus)
            targetInput.removeEventListener('click', handleClick)
            // Restore original inputMode
            if (originalInputMode) {
              targetInput.setAttribute('inputmode', originalInputMode)
            } else {
              targetInput.removeAttribute('inputmode')
            }
            // Restore original styles
            targetInput.style.caretColor = originalCaretColor
            targetInput.style.userSelect = originalUserSelect
            targetInput.removeAttribute('data-virtual-keyboard-target')
            targetInput.classList.remove('virtual-keyboard-target-input')
          }
        } else {
          // Desktop: just prevent form submission and ensure caret visible on click
          const handleKeyDown = (e: Event) => {
            const keyEvent = e as KeyboardEvent
            // If Enter is pressed and it's not a textarea, prevent form submission
            if (keyEvent.key === 'Enter' && targetInput.tagName !== 'TEXTAREA') {
              const form = targetInput.closest('form')
              if (form) {
                // Prevent form submission - user should use submit button
                keyEvent.preventDefault()
                keyEvent.stopPropagation()
              }
            }
          }

          const handleClick = () => {
            requestAnimationFrame(() => {
              const start = targetInput.selectionStart ?? targetInput.value?.length ?? 0
              const end = targetInput.selectionEnd ?? start
              targetInput.setSelectionRange(start, end)
            })
          }

          // Prevent Enter from submitting forms
          targetInput.addEventListener('keydown', handleKeyDown, true)
          targetInput.addEventListener('click', handleClick)

          const syncInput = () => {
            const value = targetInput.value || ''
            if (value !== input) {
              setInput(value)
              if (keyboardRef.current) {
                keyboardRef.current.setInput(value)
              }
            }
          }
          
          targetInput.addEventListener('input', syncInput)
          targetInput.addEventListener('change', syncInput)
          
          return () => {
            targetInput.removeEventListener('input', syncInput)
            targetInput.removeEventListener('change', syncInput)
            targetInput.removeEventListener('keydown', handleKeyDown, true)
            targetInput.removeEventListener('click', handleClick)
            // Restore original styles
            targetInput.style.caretColor = originalCaretColor
            targetInput.style.userSelect = originalUserSelect
            targetInput.removeAttribute('data-virtual-keyboard-target')
            targetInput.classList.remove('virtual-keyboard-target-input')
          }
        }
      }
    }
  }, [targetInputId, input])

  const keyboardContent = (
    <div 
      ref={wrapperRef}
      className={`virtual-urhobo-keyboard-wrapper ${className}`}
      data-keyboard-widget="true"
      onClick={(e) => {
        e.stopPropagation()
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
      onTouchStart={(e) => {
        e.stopPropagation()
      }}
      style={{
        position: 'fixed',
        left: position.x || '50%',
        top: position.y || 'auto',
        bottom: position.y ? 'auto' : 0,
        transform: position.x ? 'none' : 'translateX(-50%)',
        cursor: isMobile.current ? 'default' : (isDragging ? 'grabbing' : 'grab'),
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
    >
      <style jsx global>{`
        .virtual-urhobo-keyboard-wrapper {
          z-index: 9999 !important;
          background: #1e1e1e;
          border-radius: 12px 12px 0 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1);
          padding: 8px;
          width: 100vw;
          min-width: 100vw;
          max-width: 100vw;
          user-select: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-left: none;
          border-right: none;
        }

        @media (min-width: 768px) {
          .virtual-urhobo-keyboard-wrapper {
            width: auto;
            min-width: 600px;
            max-width: 800px;
            border-radius: 12px;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
          }
        }

        .virtual-urhobo-keyboard-wrapper .hg-theme-default {
          background-color: transparent;
          border-radius: 0;
          padding: 0;
        }
        
        .virtual-urhobo-keyboard-wrapper .hg-button {
          background-color: #2a2a2a;
          color: #e0e0e0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-size: 14px;
          font-weight: 400;
          height: 40px;
          min-width: 0;
          flex: 1;
          transition: all 0.1s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          touch-action: manipulation;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        @media (min-width: 768px) {
          .virtual-urhobo-keyboard-wrapper .hg-button {
            height: 48px;
            font-size: 16px;
          }
        }
        
        .virtual-urhobo-keyboard-wrapper .hg-button:hover {
          background-color: #3a3a3a;
          border-color: rgba(255, 230, 176, 0.3);
        }
        
        .virtual-urhobo-keyboard-wrapper .hg-button:active {
          background-color: #4a4a4a;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
          transform: scale(0.98);
        }
        
        .virtual-urhobo-keyboard-wrapper .hg-button.hg-activeButton {
          background-color: #ffe6b0;
          color: #1e1e1e;
          border-color: #ffe6b0;
        }
        
        .virtual-urhobo-keyboard-wrapper .hg-row {
          display: flex;
          gap: 6px;
          margin-bottom: 6px;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .virtual-urhobo-keyboard-wrapper .hg-row {
            gap: 8px;
            margin-bottom: 8px;
          }
        }
        
        .virtual-urhobo-keyboard-wrapper .hg-button.hg-functionBtn {
          background-color: #404040;
          color: #e0e0e0;
          font-weight: 500;
          border-color: rgba(255, 255, 255, 0.15);
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-functionBtn:hover {
          background-color: #505050;
          border-color: rgba(255, 230, 176, 0.4);
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-functionBtn:active {
          background-color: #606060;
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-space {
          flex: 4;
          min-width: 0;
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-bksp {
          flex: 1.5;
          min-width: 0;
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-tab {
          flex: 1.5;
          min-width: 0;
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-lock {
          flex: 1.8;
          min-width: 0;
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-shift {
          flex: 2;
          min-width: 0;
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-enter {
          flex: 1.5;
          min-width: 0;
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-lang {
          flex: 1.2;
          min-width: 0;
          background-color: #ffe6b0;
          color: #1e1e1e;
          font-weight: 600;
          border-color: #ffe6b0;
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-lang:hover {
          background-color: #ffd98f;
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-lang:active {
          background-color: #ffcc66;
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-ipa {
          flex: 1.2;
          min-width: 0;
          background-color: ${showIPA && language === 'urh' ? '#ffe6b0' : '#404040'};
          color: ${showIPA && language === 'urh' ? '#1e1e1e' : '#ffe6b0'};
          font-weight: 600;
          border-color: ${showIPA && language === 'urh' ? '#ffe6b0' : 'rgba(255, 230, 176, 0.3)'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-ipa:hover {
          background-color: ${showIPA && language === 'urh' ? '#ffd98f' : '#505050'};
          border-color: ${showIPA && language === 'urh' ? '#ffe6b0' : 'rgba(255, 230, 176, 0.5)'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-ipa:active {
          background-color: ${showIPA && language === 'urh' ? '#ffcc66' : '#606060'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-abc {
          flex: 1.2;
          min-width: 0;
          background-color: ${keyboardMode === 'abc' ? '#ffe6b0' : '#404040'};
          color: ${keyboardMode === 'abc' ? '#1e1e1e' : '#ffe6b0'};
          font-weight: 600;
          border-color: ${keyboardMode === 'abc' ? '#ffe6b0' : 'rgba(255, 230, 176, 0.3)'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-abc:hover {
          background-color: ${keyboardMode === 'abc' ? '#ffd98f' : '#505050'};
          border-color: ${keyboardMode === 'abc' ? '#ffe6b0' : 'rgba(255, 230, 176, 0.5)'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-abc:active {
          background-color: ${keyboardMode === 'abc' ? '#ffcc66' : '#606060'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-123 {
          flex: 1.2;
          min-width: 0;
          background-color: ${keyboardMode === '123' ? '#ffe6b0' : '#404040'};
          color: ${keyboardMode === '123' ? '#1e1e1e' : '#ffe6b0'};
          font-weight: 600;
          border-color: ${keyboardMode === '123' ? '#ffe6b0' : 'rgba(255, 230, 176, 0.3)'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-123:hover {
          background-color: ${keyboardMode === '123' ? '#ffd98f' : '#505050'};
          border-color: ${keyboardMode === '123' ? '#ffe6b0' : 'rgba(255, 230, 176, 0.5)'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-123:active {
          background-color: ${keyboardMode === '123' ? '#ffcc66' : '#606060'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-symbols {
          flex: 1.2;
          min-width: 0;
          background-color: ${keyboardMode === 'symbols' ? '#ffe6b0' : '#404040'};
          color: ${keyboardMode === 'symbols' ? '#1e1e1e' : '#ffe6b0'};
          font-weight: 600;
          border-color: ${keyboardMode === 'symbols' ? '#ffe6b0' : 'rgba(255, 230, 176, 0.3)'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-symbols:hover {
          background-color: ${keyboardMode === 'symbols' ? '#ffd98f' : '#505050'};
          border-color: ${keyboardMode === 'symbols' ? '#ffe6b0' : 'rgba(255, 230, 176, 0.5)'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-symbols:active {
          background-color: ${keyboardMode === 'symbols' ? '#ffcc66' : '#606060'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-variants {
          flex: 1.2;
          min-width: 0;
          background-color: ${showVariants && language === 'urh' && keyboardMode === 'abc' && !showIPA ? '#ffe6b0' : '#404040'};
          color: ${showVariants && language === 'urh' && keyboardMode === 'abc' && !showIPA ? '#1e1e1e' : '#ffe6b0'};
          font-weight: 600;
          border-color: ${showVariants && language === 'urh' && keyboardMode === 'abc' && !showIPA ? '#ffe6b0' : 'rgba(255, 230, 176, 0.3)'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-variants:hover {
          background-color: ${showVariants && language === 'urh' && keyboardMode === 'abc' && !showIPA ? '#ffd98f' : '#505050'};
          border-color: ${showVariants && language === 'urh' && keyboardMode === 'abc' && !showIPA ? '#ffe6b0' : 'rgba(255, 230, 176, 0.5)'};
        }

        .virtual-urhobo-keyboard-wrapper .hg-button.hg-button-variants:active {
          background-color: ${showVariants && language === 'urh' && keyboardMode === 'abc' && !showIPA ? '#ffcc66' : '#606060'};
        }

        .keyboard-drag-handle {
          user-select: none;
          -webkit-user-select: none;
        }

        @media (hover: hover) and (pointer: fine) {
          .keyboard-drag-handle {
            cursor: grab;
          }

          .keyboard-drag-handle:active {
            cursor: grabbing;
          }
        }

        .long-press-popup {
          position: fixed;
          z-index: 10000 !important;
          background: #2a2a2a;
          border: 1px solid rgba(255, 230, 176, 0.3);
          border-radius: 8px;
          padding: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          display: flex;
          gap: 4px;
          align-items: center;
          transform: translateX(-50%) translateY(-100%);
        }

        .long-press-popup-item {
          min-width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1e1e1e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #e0e0e0;
          font-size: 16px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.1s ease;
          user-select: none;
          -webkit-user-select: none;
        }

        .long-press-popup-item:hover,
        .long-press-popup-item:active {
          background: #ffe6b0;
          color: #1e1e1e;
          border-color: #ffe6b0;
          transform: scale(1.1);
        }

        .long-press-popup-item.active {
          background: #ffe6b0;
          color: #1e1e1e;
          border-color: #ffe6b0;
        }
      `}</style>

      {/* Drag Handle and Close Button */}
      <div 
        className="flex items-center justify-between mb-2 pb-2 border-b border-gray-600"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          cursor: isMobile.current ? 'default' : (isDragging ? 'grabbing' : 'grab')
        }}
      >
        <div className="flex items-center gap-2 text-gray-400">
          {!isMobile.current && (
            <>
              <GripVertical className="h-4 w-4" />
              <span className="text-xs font-medium">Drag to move</span>
            </>
          )}
          {/* <span className="text-xs font-medium px-2 py-0.5 bg-[#2a2a2a] border border-[#ffe6b0] rounded text-[#ffe6b0]">
            {language === 'eng' ? 'English' : 'Urhobo'}
          </span> */}
        </div>
        {onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onClose()
            }}
            onTouchEnd={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onClose()
            }}
            className="p-1.5 rounded-full hover:bg-[#2a2a2a] transition-colors text-gray-400 hover:text-[#ffe6b0] touch-manipulation"
            aria-label="Close keyboard"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main Keyboard */}
      <div
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          if (e.nativeEvent && 'stopImmediatePropagation' in e.nativeEvent) {
            e.nativeEvent.stopImmediatePropagation()
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          if (e.nativeEvent && 'stopImmediatePropagation' in e.nativeEvent) {
            e.nativeEvent.stopImmediatePropagation()
          }
        }}
        onTouchStart={(e) => {
          e.stopPropagation()
          e.preventDefault()
          if (e.nativeEvent && 'stopImmediatePropagation' in e.nativeEvent) {
            e.nativeEvent.stopImmediatePropagation()
          }
        }}
        onSubmit={(e) => {
          e.stopPropagation()
          e.preventDefault()
          if (e.nativeEvent && 'stopImmediatePropagation' in e.nativeEvent) {
            e.nativeEvent.stopImmediatePropagation()
          }
        }}
        data-keyboard-widget="true"
      >
        <Keyboard
          keyboardRef={(r) => (keyboardRef.current = r)}
          layout={currentLayout}
          layoutName={layoutName}
          display={displayNames}
          onChange={onChange}
          onKeyPress={onKeyPress}
          theme="hg-theme-default"
          physicalKeyboardHighlight={false}
          preventMouseDownDefault={true}
        />
      </div>

      {/* Long Press Popup */}
      {longPressPopup?.visible && (
        <div
          className="long-press-popup"
          style={{
            left: `${longPressPopup.x}px`,
            top: `${longPressPopup.y}px`,
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {longPressPopup.characters.map((char, index) => (
            <button
              key={`${char}-${index}`}
              className={`long-press-popup-item ${char === longPressPopup.baseChar ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleVariantSelect(char)
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleVariantSelect(char)
              }}
            >
              {char}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  // Render keyboard in a portal to ensure it's always above modals
  if (typeof window !== 'undefined') {
    return createPortal(keyboardContent, document.body)
  }
  
  return keyboardContent
}
