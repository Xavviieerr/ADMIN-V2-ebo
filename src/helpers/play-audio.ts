export const playAudio = ({
  url,
  audioPlayerRef,
  playing,
  setPlaying,
}: {
  url: string;
  audioPlayerRef: React.RefObject<HTMLAudioElement | null>;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (audioPlayerRef.current && playing) {
    audioPlayerRef.current.pause();
    audioPlayerRef.current = null;
    setPlaying(false);
    return;
  }

  const audio = new Audio(url);

  audio.onended = () => {
    setPlaying(false);
    audioPlayerRef.current = null;
    return;
  };
  audioPlayerRef.current = audio;

  audio.play();
  setPlaying(true);
};
