"use client"

import { useSocketContext } from "@/context/SocketContext"
import CreateQuestions from "@/components/CreateQuestions/CreateQuestions"
import AnswerQuestions from "@/components/AnswerQuestions/AnswerQuestions"

const GamePage: React.FC = () => {
  const { room } = useSocketContext()
  console.log("room", room)
  return (
    <>
      {room?.state === "question" && <CreateQuestions />}
      {room?.state === "answer" && <AnswerQuestions />}
    </>
  )
}

export default GamePage
