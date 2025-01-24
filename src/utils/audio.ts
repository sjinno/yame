export function createAudioPlayer(src: string) {
  const audio = new Audio(src);
  return {
    play: async (cb?: () => void) => {
      audio.currentTime = 0;
      await audio.play();
      if (cb) audio.onended = cb;
    },
  };
}
