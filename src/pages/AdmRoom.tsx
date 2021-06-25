import logoImg from '../assets/images/logo.svg';
import copyImg from '../assets/images/copy.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';

import '../styles/room.scss';

export function Room() {
  return (
    <div id="room-container">
      <header>
        <div>
          <img src={logoImg} alt="Letmeask logo" />
          <div>
            <div className="copy-code-button">
              <div>
                <img src={copyImg} alt="Icône para copiar o código da sala" />
              </div>
              <span>Sala #3233434</span>
            </div>
            <button className="close-room-button">
              Encerrar sala
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="main-content">
          <h2>Sala React Q&amp;A</h2>
          <div>
            <div className="not-questions">
              <img src={emptyQuestionsImg} alt="Imagem representando perguntas" />
              <h4>Nenhuma pergunta por aqui...</h4>
              <p>Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
