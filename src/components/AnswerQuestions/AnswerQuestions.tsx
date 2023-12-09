"use client"

import { useSocketContext } from "@/context/SocketContext"
import { Answer, Question, AnsweredQuestion } from "@/types"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"

const AnswerQuestions: React.FC = () => {
  const { room, socket, sendAnswers } = useSocketContext()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  )
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    null
  )
  const [answeredQuestions, setAnsweredQuestions] = useState<
    AnsweredQuestion[]
  >([])

  const mixAnswers = (answers: Answer[]) => {
    return answers.sort(() => Math.random() - 0.5)
  }

  const handleSetQuestions = () => {
    const rival = room?.players.find((player) => player.id !== socket?.id)

    if (rival?.questions) {
      rival.questions.forEach((question) => {
        question.answers = mixAnswers(question.answers)
      })
      setQuestions(rival.questions)
    }
  }

  useEffect(() => {
    handleSetQuestions()
  }, [])

  useEffect(() => {
    // Reset selected answer when moving to the next question
    setSelectedAnswerIndex(null)
    setCorrectAnswerIndex(null)
  }, [currentQuestionIndex])

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswerIndex === null) {
      setSelectedAnswerIndex(answerIndex)

      // Show notification based on correctness
      if (questions[currentQuestionIndex].answers[answerIndex].isCorrect) {
        toast.success("Respuesta correcta!")
      } else {
        toast.error("Respuesta incorrecta! La respuesta correcta fue marcada.")
        setCorrectAnswerIndex(
          questions[currentQuestionIndex].answers.findIndex(
            (answer) => answer.isCorrect
          )
        )
      }
    }

    // Save answer to array
    const correctAnswer = questions[currentQuestionIndex].answers.find(
      (answer) => answer.isCorrect
    )
    if (!correctAnswer) return
    const newAnsweredQuestions = [...answeredQuestions]
    newAnsweredQuestions[currentQuestionIndex] = {
      question: questions[currentQuestionIndex].question,
      answers: questions[currentQuestionIndex].answers,
      correctAnswer: correctAnswer,
      playerAnswer: questions[currentQuestionIndex].answers[answerIndex],
    }

    setAnsweredQuestions(newAnsweredQuestions)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      toast.info("You have completed all questions.")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow-md">
      {currentQuestionIndex < questions.length && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Pregunta {currentQuestionIndex + 1}:
          </h2>
          <p className="mb-4">{questions[currentQuestionIndex].question}</p>

          <div className="mb-4">
            {questions[currentQuestionIndex].answers.map(
              (answer, answerIndex) => (
                <div
                  key={answerIndex}
                  className={`p-2 border rounded cursor-pointer mb-2 ${
                    selectedAnswerIndex === answerIndex
                      ? answer.isCorrect
                        ? "bg-green-300"
                        : "bg-red-300"
                      : correctAnswerIndex === answerIndex
                      ? "bg-green-300"
                      : ""
                  }`}
                  onClick={() => handleAnswerClick(answerIndex)}
                >
                  {answer.text}
                </div>
              )
            )}
          </div>

          {
            // If it is last question, show submit button
            currentQuestionIndex === questions.length - 1 ? (
              <button
                className={`mt-4 bg-green-500 text-white px-4 py-2 rounded w-full ${
                  answeredQuestions.length < questions.length
                    ? "opacity-50"
                    : ""
                }`}
                disabled={answeredQuestions.length < questions.length}
                onClick={() => sendAnswers(answeredQuestions)}
              >
                Enviar respuestas
              </button>
            ) : (
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded w-full ${
                  selectedAnswerIndex === null ? "opacity-50" : ""
                }`}
                onClick={handleNextQuestion}
                disabled={selectedAnswerIndex === null}
              >
                Siguiente Pregunta
              </button>
            )
          }
        </div>
      )}
    </div>
  )
}

export default AnswerQuestions
