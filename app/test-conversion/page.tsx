"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestConversion() {
  const [testText, setTestText] = useState("Hello World")
  const [results, setResults] = useState<{ [key: string]: string }>({})

  const testConversion = async (style: string) => {
    try {
      const response = await fetch("/api/style", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: testText,
          style: style,
        }),
      })

      const data = await response.json()
      setResults((prev) => ({
        ...prev,
        [style]: data.styledText,
      }))
    } catch (error) {
      console.error("Test error:", error)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Style Conversion Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Text:</label>
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => testConversion("normal")}>Normal</Button>
            <Button onClick={() => testConversion("bold")}>Bold</Button>
            <Button onClick={() => testConversion("italic")}>Italic</Button>
            <Button onClick={() => testConversion("boldItalic")}>Bold Italic</Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Results:</h3>
            {Object.entries(results).map(([style, result]) => (
              <div key={style} className="p-2 bg-gray-100 rounded">
                <strong>{style}:</strong> {result}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Test Cases:</h3>
            <div className="space-y-1 text-sm">
              <div>Bold: 𝐇𝐞𝐥𝐥𝐨 𝐖𝐨𝐫𝐥𝐝</div>
              <div>Italic: 𝐻𝑒𝑙𝑙𝑜 𝑊𝑜𝑟𝑙𝑑</div>
              <div>Bold Italic: 𝑯𝒆𝒍𝒍𝒐 𝑾𝒐𝒓𝒍𝒅</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
