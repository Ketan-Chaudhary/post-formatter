import { NextResponse } from "next/server"

export async function GET() {
  // Test cases
  const testCases = [
    { input: "𝐇𝐞𝐥𝐥𝐨", expected: "Hello", description: "Bold text" },
    { input: "𝐻𝑒𝑙𝑙𝑜", expected: "Hello", description: "Italic text" },
    { input: "𝑯𝒆𝒍𝒍𝒐", expected: "Hello", description: "Bold italic text" },
    { input: "Hello", expected: "Hello", description: "Normal text" },
  ]

  const results = testCases.map((testCase) => {
    // Test the conversion logic here
    const response = fetch("/api/style", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: testCase.input, style: "normal" }),
    })

    return {
      ...testCase,
      // We'll see the actual result in the main API
    }
  })

  return NextResponse.json({
    message: "Test route for debugging style conversion",
    testCases: results,
    unicodeInfo: {
      boldH: "𝐇".charCodeAt(0),
      normalH: "H".charCodeAt(0),
      italicH: "𝐻".charCodeAt(0),
      boldItalicH: "𝑯".charCodeAt(0),
    },
  })
}
