import {
  Space_Mono,
  Nunito,
  Literata,
  Instrument_Serif
} from "next/font/google"

export const fontMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
})

export const fontSans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400", "400"],
  variable: "--font-serif",
})
