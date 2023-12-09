"use client"

import { useSocketContext } from "@/context/SocketContext"
import CreateQuestions from "@/components/CreateQuestions/CreateQuestions"
import AnswerQuestions from "@/components/AnswerQuestions/AnswerQuestions"
import Score from "@/components/Score/Score"

const GamePage: React.FC = () => {
  const { room } = useSocketContext()
  console.log("room", room)
  return (
    <>
      {room?.state === "question" && <CreateQuestions />}
      {room?.state === "answer" && <AnswerQuestions />}
      {room?.state === "score" && <Score />}
    </>
  )
}

export default GamePage
