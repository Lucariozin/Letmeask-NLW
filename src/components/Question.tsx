import { ReactNode } from 'react';

import cx from 'classnames';

import '../styles/question.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  children: ReactNode;
  isAnswered?: boolean;
  isHighlighted?:boolean;
};

export function Question({
  content,
  author,
  children,
  isAnswered,
  isHighlighted
}: QuestionProps) {
  return (
    <div
      className={cx(
        "question",
        {
          answered: isAnswered,
          highlighted: isHighlighted && !isAnswered,
        }
      )}
    >
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
