import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SocketProvider } from "@/context/SocketContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quiz",
  description: "Quiz",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SocketProvider>
      <html lang="es">
        <body className={`${inter.className} dark`} suppressHydrationWarning>
          <ToastContainer />
          {children}
        </body>
      </html>
    </SocketProvider>
  )
}
