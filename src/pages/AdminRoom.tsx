import {useHistory, useParams} from 'react-router-dom';

import LogoImg from '../assets/images/logo.svg';
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
              <Question key={question.id} content={question.content} author={question.author}>
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