import RoosterSound from '../assets/audio/hahn_kikeriki.mp3';

const audio = new Audio(RoosterSound); // Load the audio file

// Function to play the audio from the start
export async function playAudio() {
  audio.currentTime = 0; // Reset to the beginning
  await audio.play(); // Play the audio
}
