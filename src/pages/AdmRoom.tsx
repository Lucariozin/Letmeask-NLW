import { database } from '../services/firebase';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { useParams, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

import { Question } from '../components/Question'
import { Loading } from '../components/Loading';
import { RoomCode } from '../components/RoomCode';

import deleteImg from '../assets/images/delete.svg';
import answerImg from '../assets/images/answer.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';
import checkImg from '../assets/images/check.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export function AdmRoom() {
  const { id } = useParams<RoomParams>();
  const history = useHistory();
  const [authorId, SetAuthorId] = useState('' || undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { questions, title } = useRoom(id);
  const { user } = useAuth();

  useEffect(() => {
    async function endedAt() {
      setIsLoading(true);

      try {
        const roomRef = await database.ref(`rooms/${id}`).get();
        SetAuthorId(roomRef.val().authorId);

        if (authorId && user?.id) {
          if (authorId !== user.id) {
            setIsLoading(false);
            return history.push('/');
          }
        }

        if (roomRef.val().endedAt) {
          setIsLoading(false);
          return history.push('/');
        };

        setIsLoading(false);
      } catch {
        setIsLoading(false);
        return history.push('/');
      }
    }

    endedAt();
  }, [id, history, user?.id, authorId]);

  async function handleDeleteQuestion(questionId: string) {
    const deleteQuestion = window.confirm('Tem certeza que você deseja excluir esta pergunta?');

    if (deleteQuestion) {
      await database.ref(`rooms/${id}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    const endRoom = window.confirm('Tem certeza que você deseja encerrar esta sala?');

    if (endRoom) {
      await database.ref(`rooms/${id}`).update({
        endedAt: new Date(),
      });

      history.push('/');
    }
  }

  return (
    <div id="room-container">
      <Loading isLoading={isLoading} />

      <header>
        <div>
          <img src={logoImg} alt="Letmeask logo" />
          <div>
            <RoomCode code={id} />
            <button onClick={handleEndRoom} className="close-room-button">
              Encerrar sala
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="main-content">
          <div className="questions-number">
            <h2>Sala {title}</h2>
            {questions.length > 0 && <span>{questions.length} pergunta{questions.length > 1 && 's'}</span>}
          </div>
          <div>
            {questions.length > 0 ? (
              <div className="questions-container">
                {questions.map((question) => {
                  return (
                    <Question
                      key={question.id}
                      content={question.content}
                      author={question.author}
                    >
                      <div className="adm-icons">
                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                        <img src={answerImg} alt="Destacar pergunta" />
                        <img onClick={() => handleDeleteQuestion(question.id)} src={deleteImg} alt="Remover pergunta" />
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
