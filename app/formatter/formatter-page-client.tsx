"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Download, Moon, Sun, AlertTriangle, ArrowLeft, Type, Sparkles, Home } from "lucide-react"
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

  const editorRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

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

  // Optimized text selection handler
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

    // Calculate toolbar position with bounds checking
    const rect = range.getBoundingClientRect()
    const editorRect = editorRef.current?.getBoundingClientRect()

    if (editorRect) {
      const x = Math.max(
        0,
        Math.min(
          rect.left + rect.width / 2 - editorRect.left,
          editorRect.width - 250, // Prevent toolbar from going off-screen
        ),
      )
      const y = Math.max(0, rect.top - editorRect.top - 60)

      setToolbarPosition({ x, y })
      setShowToolbar(true)

      // Store selection range for later use
      const startOffset = range.startOffset
      const endOffset = range.endOffset
      setSelectionRange({ start: startOffset, end: endOffset })
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
      return newHistory.slice(-HISTORY_LIMIT) // Keep only last N states
    })
    setRedoHistory([]) // Clear redo history when new action is performed
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
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

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

  // Optimized keyboard shortcuts
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
            // Manual save
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

      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-transparent text-black dark:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Type className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LinkedIn Post Formatter Tool</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Format your LinkedIn posts with Unicode styling - CodeWithKetan
                  {lastSaved && (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                      • Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 dark:text-white">
              <Sun className="h-4 w-4" />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Toggle dark mode" />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Compatibility Warnings */}
        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> Styled Unicode text may not be searchable on LinkedIn and might not be
            interpreted correctly by screen readers. Use sparingly for accessibility.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <Card className="relative shadow-xl border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>LinkedIn Post Editor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "default"}
                    className="px-3 py-1"
                  >
                    {charCount}/{LINKEDIN_CHAR_LIMIT}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Instructions */}
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 dark:text-blue-400 text-lg">💡</div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      How to Format Your LinkedIn Post
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Select any text</strong> in the editor below and formatting options will appear above your
                      selection. You can apply <strong>bold</strong>, <em>italic</em>, or{" "}
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
                  className="min-h-[300px] p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                  style={{ whiteSpace: "pre-wrap" }}
                  onInput={(e) => setContent(e.currentTarget.textContent || "")}
                  onMouseUp={handleSelection}
                  onKeyUp={handleSelection}
                  placeholder="Write your LinkedIn post here... Select text to format it with bold, italic, or combined Unicode styling for better engagement."
                  spellCheck="true"
                />

                {/* Selection Instructions Overlay */}
                {!content && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="text-center text-gray-400 dark:text-gray-500 max-w-md">
                      <div className="text-4xl mb-2">✍️</div>
                      <p className="text-sm">Start typing your LinkedIn post...</p>
                      <p className="text-xs mt-1">Select any text to see Unicode formatting options</p>
                    </div>
                  </div>
                )}

                {/* Floating Toolbar */}
                {showToolbar && (
                  <FloatingToolbar position={toolbarPosition} onStyleSelect={applyStyle} isLoading={isLoading} />
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute top-4 right-4 z-50" data-emoji-picker>
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
                  </div>
                )}

                {/* Bullet Selector */}
                {showBulletSelector && (
                  <div className="absolute top-4 right-20 z-50" data-bullet-selector>
                    <BulletSelector onBulletSelect={handleBulletSelect} onClose={() => setShowBulletSelector(false)} />
                  </div>
                )}
              </div>

              {/* Quick Insert Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl transition-colors duration-200">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 border-2 transition-all duration-200 hover:scale-105"
                  data-emoji-button
                  title="Add emojis to your LinkedIn post"
                >
                  <span className="text-xl">😀</span>
                  <span className="font-medium">Emojis</span>
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setShowBulletSelector(!showBulletSelector)}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900 border-2 transition-all duration-200 hover:scale-105"
                  data-bullet-button
                  title="Add bullet points to your LinkedIn post"
                >
                  <span className="text-xl">•</span>
                  <span className="font-medium">Bullets</span>
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleUndo}
                  disabled={undoHistory.length === 0}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900 border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  title="Undo last action (Ctrl+Z)"
                >
                  <span className="text-xl">↶</span>
                  <span className="font-medium">Undo</span>
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleRedo}
                  disabled={redoHistory.length === 0}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900 border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  title="Redo last action (Ctrl+Y or Ctrl+Shift+Z)"
                >
                  <span className="text-xl">↷</span>
                  <span className="font-medium">Redo</span>
                </Button>
              </div>

              {isOverLimit && (
                <Alert className="mt-4" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Your LinkedIn post exceeds the {LINKEDIN_CHAR_LIMIT} character limit by{" "}
                    {charCount - LINKEDIN_CHAR_LIMIT} characters. Please shorten your content.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={copyToClipboard}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105"
                  title="Copy formatted LinkedIn post to clipboard"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={exportAsJSON}
                  variant="outline"
                  className="border-2 hover:scale-105 transition-all duration-200 bg-transparent"
                  title="Export LinkedIn post as JSON file"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-xl border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <CardTitle className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-green-600" />
                <span>LinkedIn Post Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 min-h-[300px] transition-colors duration-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    You
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Your Name</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Your Title • Now</div>
                  </div>
                </div>

                <div className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                  {previewContent ||
                    "Your formatted LinkedIn post will appear here... Start typing to see the real-time preview with Unicode styling."}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex space-x-4">
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

        {/* Keyboard Shortcuts */}
        <Card className="mt-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Type className="w-5 h-5 text-purple-600" />
              <span>Keyboard Shortcuts for LinkedIn Post Formatting</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="font-mono">
                  Ctrl + B
                </Badge>
                <span>Bold Text</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="font-mono">
                  Ctrl + I
                </Badge>
                <span>Italic Text</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="font-mono">
                  Ctrl + Z
                </Badge>
                <span>Undo</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="font-mono">
                  Ctrl + Y
                </Badge>
                <span>Redo</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="font-mono">
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
