import CopyImg from '../assets/images/copy.svg';
import "../styles/roomCode.scss";

type RoomCodeProps = {
  code: string;
}

export function RoomCode({code}: RoomCodeProps){
  function copyRoomCodeToClipboard(){
    navigator.clipboard.writeText(code);
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={CopyImg} alt="Copiar código da sala" />
      </div>
      <span>Sala #{code}</span>
    </button>
  );
}