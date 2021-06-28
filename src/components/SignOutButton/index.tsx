import { ButtonHTMLAttributes } from 'react';
import { GoSignOut } from 'react-icons/go';
import './styles.scss';

type SignOutButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function SignOutButton(props: SignOutButtonProps) {
  return (
    <button {...props} className="signout-button">
      <GoSignOut size={24} />
      Sair
    </button>
  );
}
