import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { FormEvent, useEffect, useState } from 'react';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { Loading } from '../components/Loading';

import logoImg from '../assets/images/logo.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export function Room() {
  const { id } = useParams<RoomParams>();
  const history = useHistory();

  const { questions, title } = useRoom(id);

  const { user, signInWithGoogle } = useAuth();
  const [newQuestion, setNewQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function endedAt() {
      setIsLoading(true);

      try {
        const roomRef = await database.ref(`rooms/${id}`).get();
        if (roomRef.val().endedAt) {
          setIsLoading(false);
          return history.push('/');
        }
        setIsLoading(false);
      } catch {
        setIsLoading(false);
        return history.push('/');
      }
    }

    endedAt();
  }, [id, history]);

  async function handleSendQuestion(e: FormEvent) {
    e.preventDefault();

    if (newQuestion.trim() === '') return;

    if (!user) throw new Error('You must be logged in');

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${id}/questions`).push(question);

    setNewQuestion('');
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${id}/questions/${questionId}/likes/${likeId}`).remove();
    } else {
      await database.ref(`rooms/${id}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  function handleQuit() {
    return history.push('/');
  }

  async function handleSignIn() {
    await signInWithGoogle();
  }

  return (
    <div id="room-container">
      <Loading isLoading={isLoading} />
      <header>
        <div>
          <img src={logoImg} alt="Letmeask logo" />
          <div>
            <RoomCode code={id} />
            <button onClick={handleQuit} className="close-room-button">
              Sair da sala
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="main-content mt">
          <div className="questions-number">
            <h2>Sala {title}</h2>
            {questions.length > 0 && <span>{questions.length} pergunta{questions.length > 1 && 's'}</span>}
          </div>
          <form onSubmit={handleSendQuestion} className="ask-container">
            <textarea
              placeholder="O que você quer perguntar?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              disabled={!user}
            />
            <div>
              {user ? (
                <div className="user-info">
                  <img src={user.avatar} alt="Avatar do usuário" />
                  <span>{user.name}</span>
                </div>
              ) : (
                <p>Para enviar uma pergunta, <button onClick={handleSignIn}>faça seu login.</button></p>
              )}
              <Button type="submit" disabled={!user}>Enviar pergunta</Button>
            </div>
          </form>
          <div>
            {questions.length > 0 ? (
              <div className="questions-container">
                {questions.map((question) => {
                  return (
                    <Question
                      key={question.id}
                      content={question.content}
                      author={question.author}
                      isAnswered={question.isAnswered}
                    >
                      <div onClick={() => handleLikeQuestion(question.id, question.likeId)} className={question.likeId ? "like liked" : "like"}>
                        {question.likeCount > 0 && <span>{question.likeCount}</span>}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </Question>
                  );
                })}
              </div>
            ) : (
              <div className="not-questions mt">
                <img src={emptyQuestionsImg} alt="Imagem representando perguntas" />
                <h4>Nenhuma pergunta por aqui...</h4>
                <p>Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
