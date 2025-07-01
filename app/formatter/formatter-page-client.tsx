"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Copy,
  Download,
  Moon,
  Sun,
  AlertTriangle,
  ArrowLeft,
  Type,
  Sparkles,
  Home,
  Bold,
  Italic,
  RotateCcw,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { FloatingToolbar } from "../components/floating-toolbar"
import { useToast } from "@/hooks/use-toast"
import { EmojiPicker } from "../components/emoji-picker"
import { BulletSelector } from "../components/bullet-selector"
import { debounce } from "../utils/debounce"

const LINKEDIN_CHAR_LIMIT = 3000
const AUTOSAVE_DELAY = 2000
const HISTORY_LIMIT = 50

type StyleType = "bold" | "italic" | "boldItalic" | "normal"

interface EditorState {
  content: string
  charCount: number
  timestamp: number
}

export default function FormatterPageClient() {
  const [content, setContent] = useState("")
  const [previewContent, setPreviewContent] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const [selectedText, setSelectedText] = useState("")
  const [selectionRange, setSelectionRange] = useState<{
    start: number
    end: number
  } | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showBulletSelector, setShowBulletSelector] = useState(false)
  const [undoHistory, setUndoHistory] = useState<EditorState[]>([])
  const [redoHistory, setRedoHistory] = useState<EditorState[]>([])
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<number>(0)

  const editorRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Load saved content on mount
  useEffect(() => {
    const savedContent = localStorage.getItem("linkedin-post-draft")
    const savedDarkMode = localStorage.getItem("linkedin-post-dark-mode")

    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (editorRef.current) {
          editorRef.current.textContent = parsed.content || ""
          setContent(parsed.content || "")
        }
        setLastSaved(new Date(parsed.timestamp))
      } catch (error) {
        console.warn("Failed to load saved content:", error)
      }
    }

    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true")
    }
  }, [])

  // Auto-save functionality with debouncing
  const debouncedSave = useMemo(
    () =>
      debounce((content: string) => {
        const saveData = {
          content,
          timestamp: Date.now(),
        }
        localStorage.setItem("linkedin-post-draft", JSON.stringify(saveData))
        setLastSaved(new Date())
      }, AUTOSAVE_DELAY),
    [],
  )

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("linkedin-post-dark-mode", darkMode.toString())
  }, [darkMode])

  // Update character count and preview with performance optimization
  const updateContentState = useCallback(
    (newContent: string) => {
      setCharCount(newContent.length)
      setPreviewContent(newContent)
      debouncedSave(newContent)
    },
    [debouncedSave],
  )

  useEffect(() => {
    const textContent = editorRef.current?.textContent || ""
    updateContentState(textContent)
  }, [content, updateContentState])

  // Mobile-optimized text selection handler
  const handleSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      setShowToolbar(false)
      return
    }

    const range = selection.getRangeAt(0)
    const selectedText = selection.toString().trim()

    if (selectedText.length === 0) {
      setShowToolbar(false)
      return
    }

    setSelectedText(selectedText)

    // Calculate toolbar position with mobile optimization
    const rect = range.getBoundingClientRect()
    const editorRect = editorRef.current?.getBoundingClientRect()

    if (editorRect) {
      // For mobile, position toolbar at the top of the editor
      if (isMobile) {
        setToolbarPosition({
          x: editorRect.width / 2,
          y: -60,
        })
      } else {
        const x = Math.max(0, Math.min(rect.left + rect.width / 2 - editorRect.left, editorRect.width - 250))
        const y = Math.max(0, rect.top - editorRect.top - 60)
        setToolbarPosition({ x, y })
      }

      setShowToolbar(true)

      // Store selection range for later use
      const startOffset = range.startOffset
      const endOffset = range.endOffset
      setSelectionRange({ start: startOffset, end: endOffset })
    }
  }, [isMobile])

  const handleCursorPosition = useCallback(() => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0)
      setCursorPosition(range.startOffset)
    }
  }, [])

  // Optimized text insertion
  const insertTextAtCursor = useCallback((textToInsert: string) => {
    if (!editorRef.current) return

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(textToInsert))
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      // Fallback: append to end
      editorRef.current.textContent += textToInsert
    }

    // Update content state
    const newContent = editorRef.current.textContent || ""
    setContent(newContent)
    editorRef.current.focus()
  }, [])

  // Optimized history management
  const saveToHistory = useCallback((content: string) => {
    const newState: EditorState = {
      content,
      charCount: content.length,
      timestamp: Date.now(),
    }

    setUndoHistory((prev) => {
      const newHistory = [...prev, newState]
      return newHistory.slice(-HISTORY_LIMIT)
    })
    setRedoHistory([])
  }, [])

  // Optimized undo function
  const handleUndo = useCallback(() => {
    if (undoHistory.length === 0) return

    const currentContent = editorRef.current?.textContent || ""
    const previousState = undoHistory[undoHistory.length - 1]

    if (editorRef.current) {
      editorRef.current.textContent = previousState.content
      setContent(previousState.content)
    }

    const currentState: EditorState = {
      content: currentContent,
      charCount: currentContent.length,
      timestamp: Date.now(),
    }

    setRedoHistory((prev) => [currentState, ...prev.slice(0, HISTORY_LIMIT - 1)])
    setUndoHistory((prev) => prev.slice(0, -1))
  }, [undoHistory])

  // Optimized redo function
  const handleRedo = useCallback(() => {
    if (redoHistory.length === 0) return

    const currentContent = editorRef.current?.textContent || ""
    const nextState = redoHistory[0]

    if (editorRef.current) {
      editorRef.current.textContent = nextState.content
      setContent(nextState.content)
    }

    const currentState: EditorState = {
      content: currentContent,
      charCount: currentContent.length,
      timestamp: Date.now(),
    }

    setUndoHistory((prev) => [...prev.slice(-HISTORY_LIMIT + 1), currentState])
    setRedoHistory((prev) => prev.slice(1))
  }, [redoHistory])

  // Simplified styling with direct API calls
  const applyStyle = useCallback(
    async (style: StyleType) => {
      if (!selectedText || !selectionRange) return

      // Save current state to history before making changes
      const currentContent = editorRef.current?.textContent || ""
      saveToHistory(currentContent)

      setIsLoading(true)

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch("/api/style", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: selectedText,
            style: style,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Replace selected text with styled text
        const beforeSelection = currentContent.substring(0, selectionRange.start)
        const afterSelection = currentContent.substring(selectionRange.end)
        const newContent = beforeSelection + data.styledText + afterSelection

        if (editorRef.current) {
          editorRef.current.textContent = newContent
          setContent(newContent)
        }

        setShowToolbar(false)
      } catch (error) {
        console.error("Styling error:", error)
        toast({
          title: "Error",
          description:
            error instanceof Error && error.name === "AbortError"
              ? "Request timed out. Please try again."
              : "Failed to apply styling. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [selectedText, selectionRange, saveToHistory, toast],
  )

  const applyStyleAtCursor = useCallback(
    async (style: StyleType) => {
      if (!editorRef.current) return

      const selection = window.getSelection()
      let textToStyle = ""
      let replaceRange = { start: 0, end: 0 }

      // If there's selected text, use it
      if (selection && selection.toString().trim()) {
        textToStyle = selection.toString().trim()
        const range = selection.getRangeAt(0)
        const fullText = editorRef.current.textContent || ""
        const beforeSelection = fullText.substring(0, range.startOffset)
        const afterSelection = fullText.substring(range.endOffset)
        replaceRange = { start: range.startOffset, end: range.endOffset }
      } else {
        // If no selection, try to get the word at cursor position
        const fullText = editorRef.current.textContent || ""
        const words = fullText.split(/(\s+)/)
        let currentPos = 0
        let wordStart = 0
        let wordEnd = 0

        for (let i = 0; i < words.length; i++) {
          const word = words[i]
          if (currentPos <= cursorPosition && cursorPosition <= currentPos + word.length) {
            if (word.trim()) {
              // Only style non-whitespace words
              wordStart = currentPos
              wordEnd = currentPos + word.length
              textToStyle = word
              break
            }
          }
          currentPos += word.length
        }

        if (!textToStyle) {
          toast({
            title: "No text to style",
            description: "Please select text or place cursor on a word to apply styling.",
            variant: "destructive",
          })
          return
        }

        replaceRange = { start: wordStart, end: wordEnd }
      }

      // Save current state to history before making changes
      const currentContent = editorRef.current.textContent || ""
      saveToHistory(currentContent)

      setIsLoading(true)

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch("/api/style", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: textToStyle,
            style: style,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Replace text with styled text
        const beforeText = currentContent.substring(0, replaceRange.start)
        const afterText = currentContent.substring(replaceRange.end)
        const newContent = beforeText + data.styledText + afterText

        if (editorRef.current) {
          editorRef.current.textContent = newContent
          setContent(newContent)

          // Restore cursor position
          const newCursorPos = replaceRange.start + data.styledText.length
          const range = document.createRange()
          const sel = window.getSelection()

          if (sel && editorRef.current.firstChild) {
            range.setStart(editorRef.current.firstChild, Math.min(newCursorPos, newContent.length))
            range.collapse(true)
            sel.removeAllRanges()
            sel.addRange(range)
          }
        }

        toast({
          title: "Style Applied",
          description: `Applied ${style} styling successfully.`,
        })
      } catch (error) {
        console.error("Styling error:", error)
        toast({
          title: "Error",
          description:
            error instanceof Error && error.name === "AbortError"
              ? "Request timed out. Please try again."
              : "Failed to apply styling. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [cursorPosition, saveToHistory, toast],
  )

  // Optimized emoji selection
  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      insertTextAtCursor(emoji)
      setShowEmojiPicker(false)
    },
    [insertTextAtCursor],
  )

  // Optimized bullet selection
  const handleBulletSelect = useCallback(
    (bullet: string) => {
      insertTextAtCursor(bullet + " ")
      setShowBulletSelector(false)
    },
    [insertTextAtCursor],
  )

  // Memoized calculations
  const isOverLimit = useMemo(() => charCount > LINKEDIN_CHAR_LIMIT, [charCount])
  const isNearLimit = useMemo(() => charCount > LINKEDIN_CHAR_LIMIT * 0.9, [charCount])

  // Optimized clipboard operations
  const copyToClipboard = useCallback(async () => {
    if (!editorRef.current) return

    try {
      await navigator.clipboard.writeText(editorRef.current.textContent || "")
      toast({
        title: "Copied to Clipboard",
        description: "Your formatted LinkedIn post has been copied to the clipboard.",
      })
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = editorRef.current.textContent || ""
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)

      toast({
        title: "Copied to Clipboard",
        description: "Your formatted LinkedIn post has been copied to the clipboard.",
      })
    }
  }, [toast])

  // Optimized JSON export
  const exportAsJSON = useCallback(() => {
    const post = {
      content: editorRef.current?.textContent || "",
      charCount: charCount,
      timestamp: new Date().toISOString(),
      metadata: {
        version: "1.0",
        platform: "LinkedIn",
        tool: "CodeWithKetan LinkedIn Post Formatter",
      },
    }

    const json = JSON.stringify(post, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `linkedin-post-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Exported as JSON",
      description: "Your LinkedIn post has been exported as a JSON file.",
    })
  }, [charCount, toast])

  // Mobile-optimized keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              handleRedo()
            } else {
              handleUndo()
            }
            break
          case "y":
            e.preventDefault()
            handleRedo()
            break
          case "b":
            e.preventDefault()
            if (selectedText) applyStyle("bold")
            break
          case "i":
            e.preventDefault()
            if (selectedText) applyStyle("italic")
            break
          case "s":
            e.preventDefault()
            debouncedSave(content)
            toast({
              title: "Draft Saved",
              description: "Your LinkedIn post draft has been saved locally.",
            })
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedText, handleUndo, handleRedo, applyStyle, content, debouncedSave, toast])

  // Click outside handler for closing popups
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest("[data-emoji-picker]") && !target.closest("[data-emoji-button]")) {
        setShowEmojiPicker(false)
      }
      if (!target.closest("[data-bullet-selector]") && !target.closest("[data-bullet-button]")) {
        setShowBulletSelector(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* SEO structured data for formatter page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LinkedIn Post Formatter Tool",
            url: "https://www.codewithketan.me/formatter",
            description:
              "Free online tool to format LinkedIn posts with Unicode styling. Add bold, italic, and combined formatting.",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Unicode text formatting",
              "Bold text conversion",
              "Italic text conversion",
              "Real-time LinkedIn preview",
              "Character counter",
              "Emoji picker",
              "Bullet point styles",
            ],
          }),
        }}
      />

      <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl">
        {/* Mobile-Optimized Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 bg-transparent text-black dark:text-white p-2 sm:px-3 sm:py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>

            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Type className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  <span className="hidden sm:inline">LinkedIn Post Formatter Tool</span>
                  <span className="sm:hidden">Post Formatter</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className="hidden sm:inline">
                    Format your LinkedIn posts with Unicode styling - CodeWithKetan
                  </span>
                  <span className="sm:hidden">CodeWithKetan</span>
                  {lastSaved && (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400 hidden md:inline">
                      • Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1 sm:space-x-2 dark:text-white">
              <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Toggle dark mode" />
              <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Compatibility Warning */}
        <Alert className="mb-4 sm:mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
            <strong>Important:</strong> Styled Unicode text may not be searchable on LinkedIn and might not be
            interpreted correctly by screen readers. Use sparingly for accessibility.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Mobile-Optimized Editor Section */}
          <Card className="relative shadow-xl border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-base sm:text-lg">LinkedIn Post Editor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "default"}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
                  >
                    {charCount}/{LINKEDIN_CHAR_LIMIT}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {/* Mobile-Optimized Instructions */}
              <div className="mb-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="text-blue-600 dark:text-blue-400 text-base sm:text-lg">💡</div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-sm sm:text-base">
                      How to Format Your LinkedIn Post
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                      <strong>Select any text</strong> in the editor below and formatting options will appear. You can
                      apply <strong>bold</strong>, <em>italic</em>, or{" "}
                      <strong>
                        <em>combined</em>
                      </strong>{" "}
                      Unicode styling for maximum impact.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-[250px] sm:min-h-[300px] p-3 sm:p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 text-sm sm:text-base"
                  style={{ whiteSpace: "pre-wrap" }}
                  onInput={(e) => {
                    setContent(e.currentTarget.textContent || "")
                    handleCursorPosition()
                  }}
                  onMouseUp={() => {
                    handleSelection()
                    handleCursorPosition()
                  }}
                  onKeyUp={() => {
                    handleSelection()
                    handleCursorPosition()
                  }}
                  onTouchEnd={() => {
                    handleSelection()
                    handleCursorPosition()
                  }}
                  onFocus={handleCursorPosition}
                  placeholder="Write your LinkedIn post here... Select text to format it with bold, italic, or combined Unicode styling for better engagement."
                  spellCheck="true"
                />

                {/* Selection Instructions Overlay */}
                {!content && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="text-center text-gray-400 dark:text-gray-500 max-w-xs sm:max-w-md px-4">
                      <div className="text-3xl sm:text-4xl mb-2">✍️</div>
                      <p className="text-xs sm:text-sm">Start typing your LinkedIn post...</p>
                      <p className="text-xs mt-1">Select any text to see Unicode formatting options</p>
                    </div>
                  </div>
                )}

                {/* Mobile-Optimized Floating Toolbar */}
                {showToolbar && (
                  <FloatingToolbar position={toolbarPosition} onStyleSelect={applyStyle} isLoading={isLoading} />
                )}

                {/* Mobile-Optimized Emoji Picker */}
                {showEmojiPicker && (
                  <div
                    className="fixed inset-x-4 top-20 z-50 sm:absolute sm:top-4 sm:right-4 sm:inset-x-auto"
                    data-emoji-picker
                  >
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
                  </div>
                )}

                {/* Mobile-Optimized Bullet Selector */}
                {showBulletSelector && (
                  <div
                    className="fixed inset-x-4 top-20 z-50 sm:absolute sm:top-4 sm:right-20 sm:inset-x-auto"
                    data-bullet-selector
                  >
                    <BulletSelector onBulletSelect={handleBulletSelect} onClose={() => setShowBulletSelector(false)} />
                  </div>
                )}
              </div>

              {/* Mobile-Optimized Quick Insert Buttons */}
              {/* Mobile/Tablet Permanent Styling Buttons */}
              {(isMobile || (typeof window !== "undefined" && window.innerWidth <= 1024)) && (
                <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                  <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    Quick Text Styling (No Selection Required)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyStyleAtCursor("bold")}
                      disabled={isLoading}
                      className="flex items-center justify-center space-x-1 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 border-2 transition-all duration-200 hover:scale-105 text-xs sm:text-sm p-2 sm:p-3 touch-manipulation min-h-[44px]"
                      title="Apply bold styling to word at cursor or selected text"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <>
                          <Bold className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-bold text-xs">𝐁𝐨𝐥𝐝</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyStyleAtCursor("italic")}
                      disabled={isLoading}
                      className="flex items-center justify-center space-x-1 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900 border-2 transition-all duration-200 hover:scale-105 text-xs sm:text-sm p-2 sm:p-3 touch-manipulation min-h-[44px]"
                      title="Apply italic styling to word at cursor or selected text"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <>
                          <Italic className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="italic text-xs">𝐼𝑡𝑎𝑙𝑖𝑐</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyStyleAtCursor("boldItalic")}
                      disabled={isLoading}
                      className="flex items-center justify-center space-x-1 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900 border-2 transition-all duration-200 hover:scale-105 text-xs sm:text-sm p-2 sm:p-3 touch-manipulation min-h-[44px]"
                      title="Apply bold italic styling to word at cursor or selected text"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <>
                          <div className="flex items-center">
                            <Bold className="w-2 h-2 sm:w-3 sm:h-3" />
                            <Italic className="w-2 h-2 sm:w-3 sm:h-3 -ml-1" />
                          </div>
                          <span className="font-bold italic text-xs">𝑩𝒐𝒍𝒅</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyStyleAtCursor("normal")}
                      disabled={isLoading}
                      className="flex items-center justify-center space-x-1 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900 border-2 border-red-200 dark:border-red-700 transition-all duration-200 hover:scale-105 text-xs sm:text-sm p-2 sm:p-3 touch-manipulation min-h-[44px]"
                      title="Remove styling from word at cursor or selected text"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-red-600 dark:text-red-400" />
                      ) : (
                        <>
                          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                          <span className="text-red-600 dark:text-red-400 text-xs">Reset</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-300 mt-2 text-center">
                    💡 Place cursor on any word and click a style button, or select text for precise formatting
                  </p>
                </div>
              )}

              {/* Enhanced Quick Insert Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl transition-colors duration-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center justify-center space-x-1 sm:space-x-2 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 border-2 transition-all duration-200 hover:scale-105 text-xs sm:text-sm p-2 sm:p-3 touch-manipulation"
                  data-emoji-button
                  title="Add emojis to your LinkedIn post"
                >
                  <span className="text-base sm:text-xl">😀</span>
                  <span className="font-medium">Emojis</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulletSelector(!showBulletSelector)}
                  className="flex items-center justify-center space-x-1 sm:space-x-2 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900 border-2 transition-all duration-200 hover:scale-105 text-xs sm:text-sm p-2 sm:p-3 touch-manipulation"
                  data-bullet-button
                  title="Add bullet points to your LinkedIn post"
                >
                  <span className="text-base sm:text-xl">•</span>
                  <span className="font-medium">Bullets</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUndo}
                  disabled={undoHistory.length === 0}
                  className="flex items-center justify-center space-x-1 sm:space-x-2 bg-white dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900 border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 text-xs sm:text-sm p-2 sm:p-3 touch-manipulation"
                  title="Undo last action (Ctrl+Z)"
                >
                  <span className="text-base sm:text-xl">↶</span>
                  <span className="font-medium">Undo</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRedo}
                  disabled={redoHistory.length === 0}
                  className="flex items-center justify-center space-x-1 sm:space-x-2 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900 border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 text-xs sm:text-sm p-2 sm:p-3 touch-manipulation"
                  title="Redo last action (Ctrl+Y or Ctrl+Shift+Z)"
                >
                  <span className="text-base sm:text-xl">↷</span>
                  <span className="font-medium">Redo</span>
                </Button>
              </div>

              {isOverLimit && (
                <Alert className="mt-4" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Your LinkedIn post exceeds the {LINKEDIN_CHAR_LIMIT} character limit by{" "}
                    {charCount - LINKEDIN_CHAR_LIMIT} characters. Please shorten your content.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                <Button
                  onClick={copyToClipboard}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 touch-manipulation text-sm sm:text-base py-2 sm:py-3"
                  title="Copy formatted LinkedIn post to clipboard"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={exportAsJSON}
                  variant="outline"
                  className="border-2 hover:scale-105 transition-all duration-200 bg-transparent touch-manipulation text-sm sm:text-base py-2 sm:py-3"
                  title="Export LinkedIn post as JSON file"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mobile-Optimized Preview Section */}
          <Card className="shadow-xl border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="text-base sm:text-lg">LinkedIn Post Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 sm:p-6 min-h-[250px] sm:min-h-[300px] transition-colors duration-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    You
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Your Name</div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Your Title • Now</div>
                  </div>
                </div>

                <div className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {previewContent ||
                    "Your formatted LinkedIn post will appear here... Start typing to see the real-time preview with Unicode styling."}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex space-x-3 sm:space-x-4">
                    <span>👍 Like</span>
                    <span>💬 Comment</span>
                    <span>🔄 Repost</span>
                    <span>📤 Send</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile-Optimized Keyboard Shortcuts */}
        <Card className="mt-4 sm:mt-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2">
              <Type className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <span className="text-base sm:text-lg">Keyboard Shortcuts for LinkedIn Post Formatting</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <Badge variant="outline" className="font-mono text-xs">
                  Ctrl + B
                </Badge>
                <span>Bold Text</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <Badge variant="outline" className="font-mono text-xs">
                  Ctrl + I
                </Badge>
                <span>Italic Text</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <Badge variant="outline" className="font-mono text-xs">
                  Ctrl + Z
                </Badge>
                <span>Undo</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <Badge variant="outline" className="font-mono text-xs">
                  Ctrl + Y
                </Badge>
                <span>Redo</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <Badge variant="outline" className="font-mono text-xs">
                  Ctrl + S
                </Badge>
                <span>Save Draft</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
