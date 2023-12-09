"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import "./CreateQuestions.css" // Make sure to import the CSS styles file
import { Question } from "@/types"
import { useSocketContext } from "@/context/SocketContext"

const CreateQuestions: React.FC = () => {
  const { room, sendQuestions } = useSocketContext()
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      id: crypto.randomUUID(),
      answers: [
        { text: "", isCorrect: true, id: crypto.randomUUID() },
        { text: "", isCorrect: false, id: crypto.randomUUID() },
        { text: "", isCorrect: false, id: crypto.randomUUID() },
        { text: "", isCorrect: false, id: crypto.randomUUID() },
      ],
    },
  ])

  const handleQuestionChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = [...questions]
    newQuestions[index].question = event.target.value
    newQuestions[index].id = crypto.randomUUID()
    setQuestions(newQuestions)
  }

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers[answerIndex].text = event.target.value
    newQuestions[questionIndex].answers[answerIndex].id = crypto.randomUUID()
    setQuestions(newQuestions)
  }

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          question: "",
          id: crypto.randomUUID(),
          answers: [
            { text: "", isCorrect: true, id: crypto.randomUUID() },
            { text: "", isCorrect: false, id: crypto.randomUUID() },
            { text: "", isCorrect: false, id: crypto.randomUUID() },
            { text: "", isCorrect: false, id: crypto.randomUUID() },
          ],
        },
      ])
      toast.success("Pregunta añadida correctamente")
    } else {
      toast.error("No puedes añadir más de 5 preguntas")
    }
  }

  const handleCreateQuestions = () => {
    // Handle logic to send or process the questions here
    console.log("Questions created:", questions)
    toast.success("Preguntas creadas correctamente")
    sendQuestions(questions)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow-md">
      <TransitionGroup>
        {questions.map((question, questionIndex) => (
          <CSSTransition key={questionIndex} timeout={300} classNames="fade">
            <div className="mb-8">
              <label className="block text-lg font-semibold mb-4">
                Ingresa la pregunta {questionIndex + 1}:
              </label>
              <input
                type="text"
                value={question.question}
                onChange={(event) => handleQuestionChange(questionIndex, event)}
                className="w-full p-2 mb-4 border rounded text-black font-bold"
              />

              <label className="block text-lg font-semibold mb-4">
                Ingresa las respuestas:
              </label>
              <ul>
                {question.answers.map((answer, answerIndex) => (
                  <li key={answerIndex} className="mb-2">
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(event) =>
                        handleAnswerChange(questionIndex, answerIndex, event)
                      }
                      placeholder={
                        answerIndex === 0
                          ? `Respuesta correcta`
                          : `Respuesta incorrecta`
                      }
                      className={`w-full p-2 border rounded text-black ${
                        answerIndex === 0 ? `bg-green-100` : `bg-red-100`
                      }`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>

      {questions.length === 5 ? (
        <button
          onClick={handleCreateQuestions}
          className="p-2 bg-blue-800 text-white rounded w-full"
        >
          Crear preguntas
        </button>
      ) : (
        <button
          onClick={handleAddQuestion}
          className="mb-4 p-2 bg-blue-800 text-white rounded w-full"
        >
          Agregar pregunta
        </button>
      )}
    </div>
  )
}

export default CreateQuestions
