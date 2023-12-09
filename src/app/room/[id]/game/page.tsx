"use client"

import { useSocketContext } from "@/context/SocketContext"
import CreateQuestions from "@/components/CreateQuestions/CreateQuestions"

const GamePage: React.FC = () => {
  const { room } = useSocketContext()
  console.log("room", room)
  return <>{room?.state === "question" && <CreateQuestions />}</>
}

export default GamePage
