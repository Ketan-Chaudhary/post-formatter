"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { memo, useMemo } from "react"

interface BulletSelectorProps {
  onBulletSelect: (bullet: string) => void
  onClose: () => void
}

export const BulletSelector = memo(function BulletSelector({ onBulletSelect, onClose }: BulletSelectorProps) {
  const bulletStyles = useMemo(
    () => [
      { symbol: "•", name: "Bullet", description: "Standard bullet point" },
      { symbol: "○", name: "Circle", description: "Hollow circle" },
      { symbol: "◦", name: "Small Circle", description: "Small hollow circle" },
      { symbol: "▪", name: "Square", description: "Small black square" },
      { symbol: "▫", name: "White Square", description: "Small white square" },
      { symbol: "‣", name: "Triangle", description: "Triangular bullet" },
      { symbol: "⁃", name: "Hyphen", description: "Hyphen bullet" },
      { symbol: "✓", name: "Check", description: "Check mark" },
      { symbol: "✗", name: "X Mark", description: "X mark" },
      { symbol: "→", name: "Arrow", description: "Right arrow" },
      { symbol: "⇒", name: "Double Arrow", description: "Double right arrow" },
      { symbol: "➤", name: "Pointer", description: "Right pointer" },
      { symbol: "★", name: "Star", description: "Black star" },
      { symbol: "☆", name: "White Star", description: "White star" },
      { symbol: "♦", name: "Diamond", description: "Black diamond" },
      { symbol: "◆", name: "Solid Diamond", description: "Solid diamond" },
      { symbol: "►", name: "Play", description: "Play button" },
      { symbol: "▶", name: "Triangle Right", description: "Right triangle" },
      { symbol: "❯", name: "Chevron", description: "Right chevron" },
      { symbol: "⟩", name: "Angle", description: "Right angle bracket" },
    ],
    [],
  )

  return (
    <Card className="w-64 sm:w-72 max-h-72 sm:max-h-80 overflow-y-auto shadow-xl border-2 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50 dark:bg-green-900 p-3 sm:p-4">
        <CardTitle className="text-sm font-medium">• Bullet Styles</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-800 touch-manipulation"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-2 sm:p-3">
        <div className="grid grid-cols-1 gap-1">
          {bulletStyles.map((bullet) => (
            <Button
              key={bullet.symbol}
              variant="ghost"
              onClick={() => onBulletSelect(bullet.symbol)}
              className="justify-start h-auto p-2 sm:p-3 text-left hover:bg-green-100 dark:hover:bg-green-800 rounded-md transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 touch-manipulation"
              title={bullet.description}
            >
              <span className="text-base sm:text-lg mr-2 sm:mr-3 w-5 sm:w-6 text-center font-bold">
                {bullet.symbol}
              </span>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-medium">{bullet.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{bullet.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
