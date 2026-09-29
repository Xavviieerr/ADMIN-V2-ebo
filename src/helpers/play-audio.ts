type ActiveAudio = {
  audio: HTMLAudioElement;
  stop: () => void;
};

let active: ActiveAudio | null = null;

const clearActive = (audio: HTMLAudioElement) => {
  if (active?.audio === audio) active = null;
};

export const stopActiveAudio = () => {
  if (active) {
    const prev = active;
    active = null;
    prev.audio.pause();
    prev.stop();
  }
};

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
    if (active?.audio === audioPlayerRef.current) active = null;
    audioPlayerRef.current.pause();
    audioPlayerRef.current = null;
    setPlaying(false);
    return;
  }

  // Exclusive playback: stop whatever else is playing first so audios
  // never overlap and play() promises never race pause().
  stopActiveAudio();

  const audio = new Audio(url);
  const stop = () => setPlaying(false);
  active = { audio, stop };

  audio.onended = () => {
    clearActive(audio);
    audioPlayerRef.current = null;
    setPlaying(false);
    return;
  };
  audioPlayerRef.current = audio;

  audio
    .play()
    .then(() => setPlaying(true))
    .catch(() => {
      clearActive(audio);
      audioPlayerRef.current = null;
      setPlaying(false);
    });
};
