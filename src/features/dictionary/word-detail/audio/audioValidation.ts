export const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

export type AudioValidationError = "invalid-type" | "too-large";

export function validateAudioFile(
  file: File,
  maxBytes: number = MAX_AUDIO_BYTES,
): AudioValidationError | null {
  if (!file.type.startsWith("audio/")) {
    return "invalid-type";
  }

  if (file.size > maxBytes) {
    return "too-large";
  }

  return null;
}
