import { type NextRequest, NextResponse } from "next/server"

// Complete Unicode to normal character mapping
const UNICODE_TO_NORMAL: { [key: string]: string } = {
  // Bold characters (Mathematical Bold)
  𝐀: "A",
  𝐁: "B",
  𝐂: "C",
  𝐃: "D",
  𝐄: "E",
  𝐅: "F",
  𝐆: "G",
  𝐇: "H",
  𝐈: "I",
  𝐉: "J",
  𝐊: "K",
  𝐋: "L",
  𝐌: "M",
  𝐍: "N",
  𝐎: "O",
  𝐏: "P",
  𝐐: "Q",
  𝐑: "R",
  𝐒: "S",
  𝐓: "T",
  𝐔: "U",
  𝐕: "V",
  𝐖: "W",
  𝐗: "X",
  𝐘: "Y",
  𝐙: "Z",
  𝐚: "a",
  𝐛: "b",
  𝐜: "c",
  𝐝: "d",
  𝐞: "e",
  𝐟: "f",
  𝐠: "g",
  𝐡: "h",
  𝐢: "i",
  𝐣: "j",
  𝐤: "k",
  𝐥: "l",
  𝐦: "m",
  𝐧: "n",
  𝐨: "o",
  𝐩: "p",
  𝐪: "q",
  𝐫: "r",
  𝐬: "s",
  𝐭: "t",
  𝐮: "u",
  𝐯: "v",
  𝐰: "w",
  𝐱: "x",
  𝐲: "y",
  𝐳: "z",
  "𝟎": "0",
  "𝟏": "1",
  "𝟐": "2",
  "𝟑": "3",
  "𝟒": "4",
  "𝟓": "5",
  "𝟔": "6",
  "𝟕": "7",
  "𝟖": "8",
  "𝟗": "9",

  // Italic characters (Mathematical Italic)
  𝐴: "A",
  𝐵: "B",
  𝐶: "C",
  𝐷: "D",
  𝐸: "E",
  𝐹: "F",
  𝐺: "G",
  𝐻: "H",
  𝐼: "I",
  𝐽: "J",
  𝐾: "K",
  𝐿: "L",
  𝑀: "M",
  𝑁: "N",
  𝑂: "O",
  𝑃: "P",
  𝑄: "Q",
  𝑅: "R",
  𝑆: "S",
  𝑇: "T",
  𝑈: "U",
  𝑉: "V",
  𝑊: "W",
  𝑋: "X",
  𝑌: "Y",
  𝑍: "Z",
  𝑎: "a",
  𝑏: "b",
  𝑐: "c",
  𝑑: "d",
  𝑒: "e",
  𝑓: "f",
  𝑔: "g",
  ℎ: "h",
  𝑖: "i",
  𝑗: "j",
  𝑘: "k",
  𝑙: "l",
  𝑚: "m",
  𝑛: "n",
  𝑜: "o",
  𝑝: "p",
  𝑞: "q",
  𝑟: "r",
  𝑠: "s",
  𝑡: "t",
  𝑢: "u",
  𝑣: "v",
  𝑤: "w",
  𝑥: "x",
  𝑦: "y",
  𝑧: "z",

  // Bold Italic characters (Mathematical Bold Italic)
  𝑨: "A",
  𝑩: "B",
  𝑪: "C",
  𝑫: "D",
  𝑬: "E",
  𝑭: "F",
  𝑮: "G",
  𝑯: "H",
  𝑰: "I",
  𝑱: "J",
  𝑲: "K",
  𝑳: "L",
  𝑴: "M",
  𝑵: "N",
  𝑶: "O",
  𝑷: "P",
  𝑸: "Q",
  𝑹: "R",
  𝑺: "S",
  𝑻: "T",
  𝑼: "U",
  𝑽: "V",
  𝑾: "W",
  𝑿: "X",
  𝒀: "Y",
  𝒁: "Z",
  𝒂: "a",
  𝒃: "b",
  𝒄: "c",
  𝒅: "d",
  𝒆: "e",
  𝒇: "f",
  𝒈: "g",
  𝒉: "h",
  𝒊: "i",
  𝒋: "j",
  𝒌: "k",
  𝒍: "l",
  𝒎: "m",
  𝒏: "n",
  𝒐: "o",
  𝒑: "p",
  𝒒: "q",
  𝒓: "r",
  𝒔: "s",
  𝒕: "t",
  𝒖: "u",
  𝒗: "v",
  𝒘: "w",
  𝒙: "x",
  𝒚: "y",
  𝒛: "z",
}

// Normal to Unicode mappings
const NORMAL_TO_BOLD: { [key: string]: string } = {
  A: "𝐀",
  B: "𝐁",
  C: "𝐂",
  D: "𝐃",
  E: "𝐄",
  F: "𝐅",
  G: "𝐆",
  H: "𝐇",
  I: "𝐈",
  J: "𝐉",
  K: "𝐊",
  L: "𝐋",
  M: "𝐌",
  N: "𝐍",
  O: "𝐎",
  P: "𝐏",
  Q: "𝐐",
  R: "𝐑",
  S: "𝐒",
  T: "𝐓",
  U: "𝐔",
  V: "𝐕",
  W: "𝐖",
  X: "𝐗",
  Y: "𝐘",
  Z: "𝐙",
  a: "𝐚",
  b: "𝐛",
  c: "𝐜",
  d: "𝐝",
  e: "𝐞",
  f: "𝐟",
  g: "𝐠",
  h: "𝐡",
  i: "𝐢",
  j: "𝐣",
  k: "𝐤",
  l: "𝐥",
  m: "𝐦",
  n: "𝐧",
  o: "𝐨",
  p: "𝐩",
  q: "𝐪",
  r: "𝐫",
  s: "𝐬",
  t: "𝐭",
  u: "𝐮",
  v: "𝐯",
  w: "𝐰",
  x: "𝐱",
  y: "𝐲",
  z: "𝐳",
  "0": "𝟎",
  "1": "𝟏",
  "2": "𝟐",
  "3": "𝟑",
  "4": "𝟒",
  "5": "𝟓",
  "6": "𝟔",
  "7": "𝟕",
  "8": "𝟖",
  "9": "𝟗",
}

const NORMAL_TO_ITALIC: { [key: string]: string } = {
  A: "𝐴",
  B: "𝐵",
  C: "𝐶",
  D: "𝐷",
  E: "𝐸",
  F: "𝐹",
  G: "𝐺",
  H: "𝐻",
  I: "𝐼",
  J: "𝐽",
  K: "𝐾",
  L: "𝐿",
  M: "𝑀",
  N: "𝑁",
  O: "𝑂",
  P: "𝑃",
  Q: "𝑄",
  R: "𝑅",
  S: "𝑆",
  T: "𝑇",
  U: "𝑈",
  V: "𝑉",
  W: "𝑊",
  X: "𝑋",
  Y: "𝑌",
  Z: "𝑍",
  a: "𝑎",
  b: "𝑏",
  c: "𝑐",
  d: "𝑑",
  e: "𝑒",
  f: "𝑓",
  g: "𝑔",
  h: "ℎ",
  i: "𝑖",
  j: "𝑗",
  k: "𝑘",
  l: "𝑙",
  m: "𝑚",
  n: "𝑛",
  o: "𝑜",
  p: "𝑝",
  q: "𝑞",
  r: "𝑟",
  s: "𝑠",
  t: "𝑡",
  u: "𝑢",
  v: "𝑣",
  w: "𝑤",
  x: "𝑥",
  y: "𝑦",
  z: "𝑧",
}

const NORMAL_TO_BOLD_ITALIC: { [key: string]: string } = {
  A: "𝑨",
  B: "𝑩",
  C: "𝑪",
  D: "𝑫",
  E: "𝑬",
  F: "𝑭",
  G: "𝑮",
  H: "𝑯",
  I: "𝑰",
  J: "𝑱",
  K: "𝑲",
  L: "𝑳",
  M: "𝑴",
  N: "𝑵",
  O: "𝑶",
  P: "𝑷",
  Q: "𝑸",
  R: "𝑹",
  S: "𝑺",
  T: "𝑻",
  U: "𝑼",
  V: "𝑽",
  W: "𝑾",
  X: "𝑿",
  Y: "𝒀",
  Z: "𝒁",
  a: "𝒂",
  b: "𝒃",
  c: "𝒄",
  d: "𝒅",
  e: "𝒆",
  f: "𝒇",
  g: "𝒈",
  h: "𝒉",
  i: "𝒊",
  j: "𝒋",
  k: "𝒌",
  l: "𝒍",
  m: "𝒎",
  n: "𝒏",
  o: "𝒐",
  p: "𝒑",
  q: "𝒒",
  r: "𝒓",
  s: "𝒔",
  t: "𝒕",
  u: "𝒖",
  v: "𝒗",
  w: "𝒘",
  x: "𝒙",
  y: "𝒚",
  z: "𝒛",
}

// Create sets for faster lookup
const BOLD_CHARS = new Set(Object.values(NORMAL_TO_BOLD))
const ITALIC_CHARS = new Set(Object.values(NORMAL_TO_ITALIC))
const BOLD_ITALIC_CHARS = new Set(Object.values(NORMAL_TO_BOLD_ITALIC))

// Proper Unicode-aware string splitting
function getUnicodeChars(text: string): string[] {
  return Array.from(text)
}

function detectCurrentStyle(text: string): "normal" | "bold" | "italic" | "boldItalic" | "mixed" {
  const chars = getUnicodeChars(text)
  let hasBold = false
  let hasItalic = false
  let hasBoldItalic = false
  let hasNormal = false

  console.log("🔍 STYLE DETECTION:")
  console.log("Input chars:", chars)

  // Debug: Show character codes
  chars.forEach((char, i) => {
    console.log(`Char ${i}: "${char}" (code: ${char.codePointAt(0)})`)
  })

  for (const char of chars) {
    // Check if character exists in our mappings
    if (UNICODE_TO_NORMAL[char]) {
      // This is a styled character, determine which style
      if (BOLD_ITALIC_CHARS.has(char)) {
        hasBoldItalic = true
        console.log(`Found bold italic: ${char}`)
      } else if (BOLD_CHARS.has(char)) {
        hasBold = true
        console.log(`Found bold: ${char}`)
      } else if (ITALIC_CHARS.has(char)) {
        hasItalic = true
        console.log(`Found italic: ${char}`)
      }
    } else if (/[a-zA-Z0-9]/.test(char)) {
      hasNormal = true
      console.log(`Found normal: ${char}`)
    }
  }

  console.log(
    `Detection results: bold=${hasBold}, italic=${hasItalic}, boldItalic=${hasBoldItalic}, normal=${hasNormal}`,
  )

  // Count how many different styles we have
  const styleCount = [hasBold, hasItalic, hasBoldItalic, hasNormal].filter(Boolean).length

  if (styleCount > 1) return "mixed"
  if (hasBoldItalic) return "boldItalic"
  if (hasBold) return "bold"
  if (hasItalic) return "italic"
  return "normal"
}

function hasAnyUnicodeStyle(text: string): boolean {
  const chars = getUnicodeChars(text)
  const result = chars.some((char) => UNICODE_TO_NORMAL[char])
  console.log(`Has styled chars check: "${text}" -> ${result}`)

  // Debug: Check each character
  chars.forEach((char, i) => {
    const isStyled = UNICODE_TO_NORMAL[char]
    console.log(`  Char ${i}: "${char}" -> styled: ${!!isStyled}`)
  })

  return result
}

function convertToNormal(text: string): string {
  console.log("🔄 Converting to normal:", text)
  const chars = getUnicodeChars(text)
  const result = chars
    .map((char) => {
      const normalChar = UNICODE_TO_NORMAL[char] || char
      if (normalChar !== char) {
        console.log(`  ${char} -> ${normalChar}`)
      }
      return normalChar
    })
    .join("")
  console.log("Normal result:", result)
  return result
}

function convertToBold(text: string): string {
  console.log("🔥 Converting to bold:", text)
  const normalText = convertToNormal(text)
  const chars = getUnicodeChars(normalText)
  const result = chars.map((char) => NORMAL_TO_BOLD[char] || char).join("")
  console.log("Bold result:", result)
  return result
}

function convertToItalic(text: string): string {
  console.log("📐 Converting to italic:", text)
  const normalText = convertToNormal(text)
  const chars = getUnicodeChars(normalText)
  const result = chars.map((char) => NORMAL_TO_ITALIC[char] || char).join("")
  console.log("Italic result:", result)
  return result
}

function convertToBoldItalic(text: string): string {
  console.log("🔥📐 Converting to bold italic:", text)
  const normalText = convertToNormal(text)
  const chars = getUnicodeChars(normalText)
  const result = chars.map((char) => NORMAL_TO_BOLD_ITALIC[char] || char).join("")
  console.log("Bold italic result:", result)
  return result
}

function applyStyleWithToggle(text: string, requestedStyle: "normal" | "bold" | "italic" | "boldItalic"): string {
  const currentStyle = detectCurrentStyle(text)
  const hasStyledChars = hasAnyUnicodeStyle(text)

  console.log(`=== STYLE CONVERSION ===`)
  console.log(`Input text: "${text}"`)
  console.log(`Current style: ${currentStyle}`)
  console.log(`Has styled chars: ${hasStyledChars}`)
  console.log(`Requested style: ${requestedStyle}`)

  // NORMAL BUTTON = PURE RESET FUNCTIONALITY
  if (requestedStyle === "normal") {
    if (hasStyledChars) {
      console.log("🔄 RESET: Removing all styling -> normal text")
      return convertToNormal(text)
    } else {
      console.log("⚪ NO CHANGE: Text is already normal")
      return text
    }
  }

  // For other styles, check if we should toggle off
  if (currentStyle === requestedStyle) {
    console.log("🔄 TOGGLE OFF: Same style detected - converting to normal")
    return convertToNormal(text)
  }

  // Handle style combinations
  if (currentStyle === "bold" && requestedStyle === "italic") {
    console.log("➕ COMBINE: Adding italic to bold -> bold italic")
    return convertToBoldItalic(text)
  }

  if (currentStyle === "italic" && requestedStyle === "bold") {
    console.log("➕ COMBINE: Adding bold to italic -> bold italic")
    return convertToBoldItalic(text)
  }

  // Handle removing one style from boldItalic
  if (currentStyle === "boldItalic") {
    if (requestedStyle === "bold") {
      console.log("➖ REMOVE: Removing bold from bold italic -> italic")
      return convertToItalic(text)
    }
    if (requestedStyle === "italic") {
      console.log("➖ REMOVE: Removing italic from bold italic -> bold")
      return convertToBold(text)
    }
  }

  // Default: apply the requested style
  console.log(`✨ APPLY: Applying ${requestedStyle} style`)
  switch (requestedStyle) {
    case "bold":
      return convertToBold(text)
    case "italic":
      return convertToItalic(text)
    case "boldItalic":
      return convertToBoldItalic(text)
    default:
      return text
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, style } = await request.json()

    console.log(`\n🔥 API REQUEST 🔥`)
    console.log(`Text: "${text}"`)
    console.log(`Style: ${style}`)

    if (!text || !style) {
      return NextResponse.json({ error: "Text and style are required" }, { status: 400 })
    }

    const supportedStyles = ["normal", "bold", "italic", "boldItalic"]
    if (!supportedStyles.includes(style)) {
      return NextResponse.json({ error: "Unsupported style" }, { status: 400 })
    }

    const styledText = applyStyleWithToggle(text, style)

    console.log(`✅ API RESPONSE`)
    console.log(`Result: "${styledText}"`)
    console.log(`Changed: ${text !== styledText}`)

    return NextResponse.json({ styledText })
  } catch (error) {
    console.error("Style API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
