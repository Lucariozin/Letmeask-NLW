import { ReactNode } from 'react';
import '../styles/question.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  children: ReactNode;
};

export function Question({
  content,
  author,
  children
}: QuestionProps) {
  return (
    <div className="question">
      <p>{content}</p>
      <div>
        <div className="user-question">
          <img src={author.avatar} alt="Avatar da pessoa que fez a pergunta" />
          <span>{author.name}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
