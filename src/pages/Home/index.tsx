import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FormEvent, useState } from 'react';

import { database } from '../../services/firebase';

import { CgLogIn } from 'react-icons/cg';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { SignOutButton } from '../../components/SignOutButton';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';

import '../../styles/auth.scss';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(e: FormEvent) {
    setIsLoading(true);

    e.preventDefault();

    if (roomCode.trim() === '') return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return setIsLoading(false);
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed.');
      return setIsLoading(false);
    }

    setIsLoading(false);

    return history.push(`/rooms/${roomCode}`);
  }

  async function handleSignOut() {
    await signOut();
    document.location.reload();
  }

  return (
    <div id="page-auth">
      <Loading isLoading={isLoading} />
      <SignOutButton onClick={handleSignOut} />
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <Button type="submit">
              <CgLogIn className="login-icon" size={24} />
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
