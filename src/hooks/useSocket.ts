import { Room } from "@/types"
import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"

let socket: Socket

const useSocket = () => {
  const [room, setRoom] = useState<Room | null>(null)

  useEffect(() => {
    initializeSocket()
    setupEventListeners()

    return cleanup
  }, [])

  function initializeSocket() {
    socket = io("http://localhost:8080")
    socket.on("connect", () => {
      console.log("connected")
    })
  }

  function setupEventListeners() {
    socket.on("room-created", roomCreated)
    socket.on("room-not-found", handleRoomNotFound)
    socket.on("room-joined", roomJoined)
  }

  function cleanup() {
    socket.disconnect()
    socket.off("room-created", roomCreated)
    socket.off("room-not-found", handleRoomNotFound)
    socket.off("room-joined", roomJoined)
  }

  function roomCreated(room: Room) {
    console.log("room created", room)
    setRoom(room)
  }

  function roomJoined(room: Room) {
    console.log("room joined", room)
    setRoom(room)
  }

  function handleRoomNotFound() {
    alert("room not found")
  }

  function createRoom() {
    console.log("create room executed", socket.id)
    socket.emit("create-room", socket.id)
  }

  function joinRoom(roomId: string) {
    console.log("join room executed", socket.id)
    socket.emit("join-room", roomId, socket.id)
  }

  return { room, createRoom, joinRoom, socket }
}

export default useSocket
