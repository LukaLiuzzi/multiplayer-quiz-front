"use client"

import useSocket from "@/hooks/useSocket"
import { Button } from "./ui/button"
import { useState } from "react"
import { Input } from "./ui/input"

const HomeOptions = () => {
  const [inputId, setInputId] = useState("")

  const { createRoom, joinRoom, room, socket } = useSocket()
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
                joinRoom(inputId, socket)
              }}
            >
              <Input
                placeholder="Id de la sala"
                onChange={(e) => setInputId(e.target.value)}
              />
              <Button>Unirse a sala</Button>
            </form>
          </div>
        </>
      )}
      {room?.state === "waiting" && (
        <div>
          <h2>Esperando jugadores:</h2>
          <ul>
            {room.players.map((player) => (
              <div key={player.id}>
                <li>{player.id}</li>
                <li>ROOM ID: {room.id}</li>
              </div>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default HomeOptions
