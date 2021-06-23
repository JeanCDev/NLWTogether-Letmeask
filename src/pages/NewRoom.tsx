import {Link, useHistory} from 'react-router-dom';
import { FormEvent, useState } from 'react';

import Illustration from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/Auth';
import { database } from '../services/firebase';

export function NewRoom() {
  const {user} = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();

  async function handleCreateRoom(event: FormEvent){
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={Illustration} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={LogoImg} alt="Letmeask" />

          <h2>Criar uma nova sala</h2>

          <form action="" onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={newRoom}
              onChange={event => setNewRoom(event.target.value)}
            />

            <Button type="submit">Criar sala</Button>
          </form>

          <p>
            Quer entrar em uma sala existente <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}