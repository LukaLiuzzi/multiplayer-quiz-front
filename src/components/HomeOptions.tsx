"use client"

// import useSocket from "@/hooks/useSocket"
import { Button } from "./ui/button"
import { useState } from "react"
import { Input } from "./ui/input"
import { useSocketContext } from "@/context/SocketContext"

const HomeOptions = () => {
  const [roomId, setRoomId] = useState("")

  const { createRoom, joinRoom, room } = useSocketContext()

  return (
    <>
      {room === null && (
        <>
          <Button
            onClick={() => {
              createRoom()
            }}
          >
            Crear sala
          </Button>
          <div className="flex">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                joinRoom(roomId)
              }}
            >
              <Input
                placeholder="Id de la sala"
                onChange={(e) => setRoomId(e.target.value)}
              />
              <Button>Unirse a sala</Button>
            </form>
          </div>
        </>
      )}
    </>
  )
}

export default HomeOptions
