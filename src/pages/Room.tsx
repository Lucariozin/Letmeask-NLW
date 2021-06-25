import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState, useEffect } from 'react';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';
import likeImg from '../assets/images/like.svg';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

export function Room() {
  const { id } = useParams<RoomParams>();

  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

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

  useEffect(() => {
    const roomRef = database.ref(`rooms/${id}`);

    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        };
      });

      setQuestions(parsedQuestions);
      setTitle(databaseRoom.title);
    });
  }, [id]);

  return (
    <div id="room-container">
      <header>
        <div>
          <img src={logoImg} alt="Letmeask logo" />
          <div>
            <RoomCode code={id} />
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
            />
            <div>
              {user ? (
                <div className="user-info">
                  <img src={user.avatar} alt="Avatar do usuário" />
                  <span>{user.name}</span>
                </div>
              ) : (
                <p>Para enviar uma pergunta, <button>faça seu login.</button></p>
              )}
              <Button type="submit" disabled={!user}>Enviar pergunta</Button>
            </div>
          </form>
          <div>
            {questions.length > 0 ? (
              <div className="questions-container">
                {questions.map((question) => {
                  return (
                    <div className="question">
                      <p>{question.content}</p>
                      <div>
                        <div className="user-question">
                          <img src={question.author.avatar} alt="Avatar da pessoa que fez a pergunta" />
                          <span>{question.author.name}</span>
                        </div>
                        <div className="like">
                          <span>16</span>
                          <img src={likeImg} alt="Simbolo de gostei" />
                        </div>
                      </div>
                    </div>
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
