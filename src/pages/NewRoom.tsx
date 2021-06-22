import {Link} from 'react-router-dom';

import Illustration from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/Auth';

export function NewRoom() {
  const {user} = useAuth();

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

          <form action="">
            <input
              type="text"
              placeholder="Digite o código da sala"
            />

            <Button type="submit">Criar sala</Button>
          </form>

          <p>
            Quer entrar em uma sala existente
            <Link to="/"> Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}