export function createAudioPlayer(src: string) {
  let audio: HTMLAudioElement | null = new Audio(src);

  return {
    play: async (cb?: () => void) => {
      if (audio !== null) {
        audio.currentTime = 0;
        await audio.play();
        if (cb) audio.onended = cb;
      }
    },
    drop: () => {
      if (audio) {
        audio.onended = null; // Remove event listener
        audio = null;
      }
    },
  };
}
