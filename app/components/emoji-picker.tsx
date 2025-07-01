"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { memo, useMemo } from "react"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
}

export const EmojiPicker = memo(function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const emojiCategories = useMemo(
    () => ({
      "Smileys & People": [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "🤣",
        "😂",
        "🙂",
        "🙃",
        "😉",
        "😊",
        "😇",
        "🥰",
        "😍",
        "🤩",
        "😘",
        "😗",
        "😚",
        "😙",
        "😋",
        "😛",
        "😜",
        "🤪",
        "😝",
        "🤑",
        "🤗",
        "🤭",
        "🤫",
        "🤔",
        "🤐",
        "🤨",
        "😐",
        "😑",
        "😶",
        "😏",
        "😒",
        "🙄",
        "😬",
        "🤥",
        "😔",
        "😪",
        "🤤",
        "😴",
        "😷",
        "🤒",
        "🤕",
        "🤢",
        "🤮",
        "🤧",
        "🥵",
        "🥶",
        "🥴",
        "😵",
        "🤯",
        "🤠",
        "🥳",
        "😎",
        "🤓",
        "🧐",
      ],
      "Gestures & Body": [
        "👍",
        "👎",
        "👌",
        "✌️",
        "🤞",
        "🤟",
        "🤘",
        "🤙",
        "👈",
        "👉",
        "👆",
        "🖕",
        "👇",
        "☝️",
        "👋",
        "🤚",
        "🖐️",
        "✋",
        "🖖",
        "👏",
        "🙌",
        "🤲",
        "🤝",
        "🙏",
        "✍️",
        "💪",
        "🦵",
        "🦶",
        "👂",
        "👃",
      ],
      "Objects & Symbols": [
        "💼",
        "💻",
        "📱",
        "⌚",
        "📧",
        "📈",
        "📊",
        "💡",
        "🔥",
        "⭐",
        "✨",
        "🎯",
        "🚀",
        "💎",
        "🏆",
        "🎉",
        "🎊",
        "❤️",
        "💙",
        "💚",
        "💛",
        "🧡",
        "💜",
        "🖤",
        "🤍",
        "🤎",
        "💯",
        "✅",
        "❌",
        "⚠️",
      ],
      Activities: [
        "⚽",
        "🏀",
        "🏈",
        "⚾",
        "🎾",
        "🏐",
        "🏉",
        "🎱",
        "🏓",
        "🏸",
        "🥅",
        "🏒",
        "🏑",
        "🥍",
        "🏏",
        "⛳",
        "🏹",
        "🎣",
        "🥊",
        "🥋",
        "🎽",
        "⛸️",
        "🥌",
        "🛷",
        "🎿",
        "⛷️",
        "🏂",
        "🏋️",
        "🤼",
        "🤸",
      ],
    }),
    [],
  )

  return (
    <Card className="w-72 sm:w-80 max-h-80 sm:max-h-96 overflow-y-auto shadow-xl border-2 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 dark:bg-blue-900 p-3 sm:p-4">
        <CardTitle className="text-sm font-medium">😀 Emoji Picker</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-800 touch-manipulation"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 border-b pb-1">{category}</h4>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => onEmojiSelect(emoji)}
                  className="h-8 w-8 p-0 text-base sm:text-lg hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md transition-colors touch-manipulation"
                  title={emoji}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
})
