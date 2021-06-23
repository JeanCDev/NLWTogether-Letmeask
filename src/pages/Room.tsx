import { FormEvent, useEffect } from 'react';
import { useState } from 'react';
import {useParams} from 'react-router-dom';

import LogoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../contexts/Auth';
import { database } from '../services/firebase';
import '../styles/room.scss';

type RoomParams = {
  id: string;
}

type Questions = Record<string, {
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

export function Room(){
  const {user} = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  async function handleCreateNewQuestion(event: FormEvent){
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error("Você tem que estar logado para enviar perguntas");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${params.id}/questions`).push(question);

    setNewQuestion('');
  }

  useEffect(() => {
    const roomRef = database.ref(`rooms/${params.id}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const questions: Questions = databaseRoom.questions ?? {};
      const parsedQuestions = Object.entries(questions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      });

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [params.id]);

  return (
    <div id="page-room">
      <header className="content">
        <div className="content">
          <img src={LogoImg} alt="Letmeask" />
          <RoomCode code={params.id}/>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0
            && <span>{questions.length} pergunta(s)</span>
          }
        </div>

        <form onSubmit={handleCreateNewQuestion}>
          <textarea
            placeholder="O que deseja perguntar?"
            value={newQuestion}
            onChange={event => setNewQuestion(event.target.value)}
          />

          <div className="form-footer">

            {!user
              ? <span>Para enviar uma pergunta, <button>faça seu login</button></span>
              : <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            }
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
  )
}