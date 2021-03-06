import {useHistory, useParams} from 'react-router-dom';

import LogoImg from '../assets/images/logo.svg';
import CheckImg from '../assets/images/check.svg';
import AnswerImg from '../assets/images/answer.svg';
import DeleteImg from '../assets/images/delete.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { database } from '../services/firebase';
import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
}


export function AdminRoom() {
  const params = useParams<RoomParams>();
  const {questions, title} = useRoom(params.id);
  const history = useHistory();

  async function handleEndRoom(){
    await database.ref(`rooms/${params.id}`).update({
      endedAt: new Date()
    });

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Deseja realmente excluir a pergunta?")) {
      await database.ref(`rooms/${params.id}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    if (window.confirm("Marcar a pergunta como respondida?")) {
      await database.ref(`rooms/${params.id}/questions/${questionId}`).update({
        isAnswered: true
      });
    }
  }

  async function handleHighlightQuestion(questionId: string) {
    if (window.confirm("Destacar a pergunta?")) {
      await database.ref(`rooms/${params.id}/questions/${questionId}`).update({
        isHighlighted: true
      });
    }
  }

  return (
    <div id="page-room">
      <header className="content">
        <div className="content">
          <img src={LogoImg} alt="Letmeask" />
          <div>
            <RoomCode code={params.id}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>

        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0
            && <span>{questions.length} pergunta(s)</span>
          }
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {
                  !question.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                        <img src={CheckImg} alt="Marcar pergunta como respondida" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighlightQuestion(question.id)}
                      >
                        <img src={AnswerImg} alt="Dar destaque ?? pergunta" />
                      </button>
                    </>
                  )
                }
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={DeleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}