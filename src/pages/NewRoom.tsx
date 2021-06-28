import { FormEvent } from 'react';
import { database } from '../services/firebase';
import { useHistory } from 'react-router-dom';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';

export function NewRoom() {
  const history = useHistory();
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateRoom(e: FormEvent) {
    setIsLoading(true);

    e.preventDefault();

    if (newRoom.trim() === '') return setIsLoading(false);

    const roomRef = database.ref('rooms');
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    setIsLoading(false);
    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <Loading isLoading={isLoading} />
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala já existente? <Link to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  );
}
