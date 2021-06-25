import copyImg from '../assets/images/copy.svg';

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
  }

  return (
    <div className="copy-code-button">
      <div onClick={copyRoomCodeToClipboard}>
        <img src={copyImg} alt="Icône para copiar o código da sala" />
      </div>
      <span>Sala #{props.code}</span>
    </div>
  );
}
