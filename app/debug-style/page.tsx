"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugStyle() {
  const [testText, setTestText] = useState("Hello")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testStyle = async (style: string) => {
    setLoading(true)
    try {
      console.log(`Testing: "${testText}" with style: ${style}`)

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
      setResult(data.styledText)
      setTestText(data.styledText) // Update input with result for chaining

      console.log(`Result: "${data.styledText}"`)
    } catch (error) {
      console.error("Test error:", error)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setTestText("Hello")
    setResult("")
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Style Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Text:</label>
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full p-2 border rounded font-mono"
              placeholder="Enter text to test..."
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => testStyle("normal")} disabled={loading}>
              Normal
            </Button>
            <Button onClick={() => testStyle("bold")} disabled={loading}>
              Bold
            </Button>
            <Button onClick={() => testStyle("italic")} disabled={loading}>
              Italic
            </Button>
            <Button onClick={() => testStyle("boldItalic")} disabled={loading}>
              Bold Italic
            </Button>
            <Button onClick={reset} variant="outline">
              Reset
            </Button>
          </div>

          {result && (
            <div className="space-y-2">
              <h3 className="font-semibold">Result:</h3>
              <div className="p-3 bg-gray-100 rounded font-mono text-lg">{result}</div>
              <div className="text-xs text-gray-500">Length: {result.length} characters</div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">Test Sequence:</h3>
            <div className="text-sm space-y-1">
              <div>1. Type "Hello" → Click Bold → Should get: 𝐇𝐞𝐥𝐥𝐨</div>
              <div>2. Click Bold again → Should get: Hello (toggle off)</div>
              <div>3. Click Italic → Should get: 𝐻𝑒𝑙𝑙𝑜</div>
              <div>4. Click Bold → Should get: 𝑯𝒆𝒍𝒍𝒐 (bold italic)</div>
              <div>5. Click Normal → Should get: Hello</div>
            </div>
          </div>

          <div className="text-xs text-gray-500">Check browser console for detailed logs</div>
        </CardContent>
      </Card>
    </div>
  )
}
