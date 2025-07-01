"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bold, Italic, Loader2, RotateCcw } from "lucide-react"
import { memo } from "react"

type StyleType = "bold" | "italic" | "boldItalic" | "normal"

interface FloatingToolbarProps {
  position: { x: number; y: number }
  onStyleSelect: (style: StyleType) => void
  isLoading: boolean
}

export const FloatingToolbar = memo(function FloatingToolbar({
  position,
  onStyleSelect,
  isLoading,
}: FloatingToolbarProps) {
  const toolbarButtons = [
    { style: "normal" as StyleType, icon: RotateCcw, label: "Remove All Styling", shortcut: "", example: "Reset" },
    { style: "bold" as StyleType, icon: Bold, label: "Bold", shortcut: "Ctrl+B", example: "𝐁𝐨𝐥𝐝" },
    { style: "italic" as StyleType, icon: Italic, label: "Italic", shortcut: "Ctrl+I", example: "𝐼𝑡𝑎𝑙𝑖𝑐" },
    {
      style: "boldItalic" as StyleType,
      icon: Bold,
      label: "Bold + Italic",
      shortcut: "",
      example: "𝑩𝒐𝒍𝒅𝑰𝒕𝒂𝒍𝒊𝒄",
      className: "relative",
    },
  ]

  return (
    <Card
      className="absolute z-50 p-2 sm:p-3 shadow-xl border-2 bg-white dark:bg-gray-800 rounded-lg transition-all duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translateX(-50%)",
      }}
    >
      <div className="flex space-x-1 sm:space-x-2">
        {toolbarButtons.map(({ style, icon: Icon, label, shortcut, example, className }) => (
          <Button
            key={style}
            variant="outline"
            size="sm"
            onClick={() => onStyleSelect(style)}
            disabled={isLoading}
            title={`${label}${shortcut ? ` (${shortcut})` : ""} - ${example}`}
            className={`h-8 w-8 sm:h-10 sm:w-10 p-0 relative group ${
              style === "normal"
                ? "hover:bg-red-50 dark:hover:bg-red-900 border-red-200 dark:border-red-700"
                : "hover:bg-blue-50 dark:hover:bg-blue-900"
            } border-2 transition-colors duration-200 touch-manipulation ${className || ""}`}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : style === "boldItalic" ? (
              <div className="flex items-center">
                <Bold className="h-2 w-2 sm:h-3 sm:w-3" />
                <Italic className="h-2 w-2 sm:h-3 sm:w-3 -ml-1" />
              </div>
            ) : (
              <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${style === "normal" ? "text-red-600 dark:text-red-400" : ""}`} />
            )}
            <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              {example}
            </div>
          </Button>
        ))}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 text-center">
        Reset removes styling • Other styles toggle on/off
      </div>
    </Card>
  )
})
