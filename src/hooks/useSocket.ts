"use client"

import { Room } from "@/types"
import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"

let socket: Socket

const useSocket = () => {
  const [room, setRoom] = useState<Room | null>(null)

  useEffect(() => {
    socket = io("http://localhost:8080")
    socket.on("connect", () => {
      console.log("connected")
    })

    socket.on("room-created", roomCreated)

    socket.on("room-not-found", () => alert("room not found"))

    socket.on("room-joined", roomJoined)

    return () => {
      socket.disconnect()
      socket.off("room-created")
      socket.off("room-not-found")
      socket.off("room-joined")
    }
  }, [])

  function roomCreated(room: Room) {
    console.log("room created", room)
    setRoom(room)
  }

  function roomJoined(room: Room) {
    console.log("room joined", room)
    setRoom(room)
  }

  function createRoom() {
    console.log("create room ejecutada", socket.id)
    socket.emit("create-room", socket.id)
  }

  function joinRoom(roomId: string, socket: Socket) {
    console.log("join room ejecutada", socket.id)
    socket.emit("join-room", roomId, socket.id)
  }

  return { room, createRoom, joinRoom, socket }
}

export default useSocket
