"use client"

import { useSocketContext } from "@/context/SocketContext"
import { Room } from "@/types"
import { useEffect, useState } from "react"

const Score: React.FC = () => {
  const { room, leaveRoom } = useSocketContext()
  const [roomSnapshot, setRoomSnapshot] = useState<Room | null>(null) // This is a deep clone of the room object to avoid loss score when player leaves the room

  useEffect(() => {
    setRoomSnapshot(room) // This is a deep clone of the room object to avoid loss score when player leaves the room
  }, [])

  return (
    <div className="py-8 px-4">
      <h1 className="text-4xl font-semibold text-center mb-8">
        Resultados de la partida
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-12">
        {roomSnapshot?.players.map((player, playerIndex) => {
          return (
            <section
              key={player.id}
              className={`w-full max-w-xl flex ${
                playerIndex === 0 ? "order-1" : "order-3"
              }`}
            >
              <div className="w-full">
                <div
                  className="mt-8 p-4 border rounded shadow-md max-h-[600px] overflow-y-auto"
                  key={player.id}
                >
                  <h2 className="text-lg font-semibold mb-4">{`Jugador ${
                    playerIndex + 1
                  }`}</h2>
                  {player.answers.map((answer, index) => {
                    return (
                      <div className="mb-4" key={index}>
                        <h2 className="text-lg font-semibold mb-4">
                          Pregunta {index + 1}:
                        </h2>
                        <p className="mb-4">{answer.question}</p>
                        <div className="mb-4">
                          {answer.answers.map((answer) => {
                            let correctAnswer
                            const playerAnswer =
                              player.answers[index].playerAnswer

                            if (!playerAnswer.isCorrect) {
                              correctAnswer =
                                player.answers[index].correctAnswer.id
                            }

                            return (
                              <div
                                key={answer.id}
                                className={`p-2 border rounded mb-2 ${
                                  playerAnswer.id === answer.id
                                    ? playerAnswer.isCorrect
                                      ? "bg-green-300"
                                      : "bg-red-300"
                                    : correctAnswer === answer.id
                                    ? "bg-green-300"
                                    : ""
                                }`}
                              >
                                {answer.text || "Respuesta vacía"}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="w-full mt-8 p-4 border rounded shadow-md text-center">
                  <h2 className="text-lg font-semibold mb-4">Puntaje:</h2>
                  <p className="mb-4">
                    {
                      player.answers.filter(
                        (answer) => answer.playerAnswer.isCorrect
                      ).length
                    }{" "}
                    / 5
                  </p>
                </div>
              </div>
            </section>
          )
        })}

        <span className="text-8xl [text-shadow:2px_2px_0px_red,4px_4px_0px_black,6px_6px_0px_orange,8px_8px_0px_yellow] text-red-500 text-center order-2">
          VS
        </span>
      </div>

      <button
        className="mt-12 bg-blue-500 text-white px-4 py-2 w-full max-w-sm rounded flex justify-center items-center mx-auto"
        onClick={() => leaveRoom()}
      >
        Volver a jugar
      </button>
    </div>
  )
}

export default Score
