"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { io, Socket } from "socket.io-client"
import { useRouter } from "next/navigation"
import { Question, Room } from "@/types"

const SocketContext = createContext<SocketContextType>({
  socket: null,
  room: null,
  createRoom: () => {},
  joinRoom: () => {},
  leaveRoom: () => {},
  startGame: () => {},
  sendQuestions: () => {},
})

type SocketContextType = {
  socket: Socket | null
  room: Room | null
  createRoom: () => void
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  startGame: (roomId: string) => void
  sendQuestions: (questions: Question[]) => void
}

interface SocketProviderProps {
  children: React.ReactNode
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const router = useRouter()

  useEffect(() => {
    const socket = io("http://localhost:8080")

    socket.on("connect", () => {
      console.log("connected")
    })

    setSocket(socket)

    // Cleanup and disconnect on unmount
    return () => {
      socket.disconnect()
      setSocket(null)
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on("room-created", roomCreated)
    socket.on("room-joined", roomJoined)
    socket.on("room-left", roomLeft)
    socket.on("room-not-found", handleRoomNotFound)
    socket.on("game-started", gameStarted)
    socket.on("questions-sent", questionsReceived)

    // Cleanup event listeners on unmount
    return () => {
      socket.off("room-created", roomCreated)
      socket.off("room-not-found", handleRoomNotFound)
      socket.off("room-joined", roomJoined)
      socket.off("room-left", roomLeft)
      socket.off("game-started", gameStarted)
      socket.off("questions-sent", questionsReceived)
    }
  }, [socket])

  function roomCreated(newRoom: Room) {
    setRoom(newRoom)
    router.push(`/room/${newRoom.id}`)
  }

  function roomJoined(newRoom: Room) {
    setRoom(newRoom)
    router.push(`/room/${newRoom.id}`)
  }

  function roomLeft(updatedRoom: Room) {
    setRoom(updatedRoom)

    if (updatedRoom.players.length === 0) {
      setRoom(null)
    } else {
      if (updatedRoom.players.length === 1) {
        updatedRoom.owner = updatedRoom.players[0].id
      }
      setRoom(updatedRoom)
    }
  }

  function gameStarted(room: Room) {
    router.push(`/room/${room?.id}/game`)
    setRoom(room)
  }

  function questionsReceived(room: Room) {
    setRoom(room)
  }

  function handleRoomNotFound() {
    alert("Room not found")
  }

  function createRoom() {
    socket?.emit("create-room", socket.id)
  }

  function joinRoom(roomId: string) {
    socket?.emit("join-room", roomId, socket.id)
  }

  function leaveRoom(roomId: string) {
    socket?.emit("leave-room", socket.id, roomId)
    router.push("/")
    setRoom(null)
  }

  function startGame(roomId: string) {
    socket?.emit("start-game", roomId)
  }

  function sendQuestions(questions: Question[]) {
    socket?.emit("send-questions", {
      questions,
      roomId: room?.id,
    })
  }

  const contextValue: SocketContextType = {
    socket,
    room,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    sendQuestions,
  }

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)
