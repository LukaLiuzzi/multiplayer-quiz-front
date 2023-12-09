"use client"

import { Button } from "@/components/ui/button"
import { useSocketContext } from "@/context/SocketContext"
// import useSocket from "@/hooks/useSocket"
import { useEffect } from "react"

export default function RoomPage() {
  const { room, leaveRoom, socket, startGame } = useSocketContext()

  useEffect(() => {
    if (room !== null) {
      console.log("room", room)
    }
  }, [room])

  return (
    <>
      <div>
        <h2>Esperando jugadores:</h2>
        <ul>
          {room?.players.map((player) => (
            <li key={player.id}>{player.id}</li>
          ))}
          <li>ROOM ID: {room?.id}</li>
          <li>ROOM OWNER: {room?.owner}</li>

          {room && (
            <li>
              <Button onClick={() => leaveRoom()}>Salir de la sala</Button>
            </li>
          )}

          {room && room.players?.length >= 2 && room.owner === socket?.id && (
            <li>
              <Button onClick={() => startGame(room.id)}>Empezar juego</Button>
            </li>
          )}
        </ul>
      </div>
    </>
  )
}
