export const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

export function validateAudioFile(
  file: File,
  maxBytes: number = MAX_AUDIO_BYTES,
): string | null {
  if (!file.type.startsWith("audio/")) {
    return "Please select a valid audio file";
  }

  if (file.size > maxBytes) {
    return "Size Limit Reached! You cannot attach an audio file larger than 5mb.";
  }

  return null;
}
