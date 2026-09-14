import z from 'zod';

const omaSchema = z.object({
  type: z.string().min(1, "Media type is required"), // e.g., photo, illustration
  url: z.string().url("Must be a valid URL"), // media file URL
});

// Related word (OkpoDto)
const okpoSchema = z.object({
  ota: z.string().min(1, "Related word is required"), // synonym/related word
  egba: z.enum(["gan", "guo"], { message: "egba must be 'gan' or 'guo'" }),
});

// Translation (TranslationDto)
const translationSchema = z.object({
  headword: z.string().min(1, "Headword is required"),
  ekerota: z.array(z.string().min(1, "Part of speech required")),
  oto: z.array(z.string().min(1, "Definition required")),
  idje: z.array(z.string().min(1, "Example sentence required")),
  omra: z.array(z.string().url("Must be a valid audio URL")), // pronunciation audios
  oma: z.array(omaSchema), // media
  okpo: z.array(okpoSchema), // synonyms & related words
  orhan: z.array(z.string().min(1, "Root word required")), // word roots
  ibuebu: z.array(z.string().min(1, "Synonym required")), // synonyms
  okaeruo: z.array(z.string().min(1, "Antonym required")), // antonyms
  odeUfue: z.array(z.string().min(1, "Scientific name required")), // scientific names
});

// Sense (SenseDto)
const ohochema = z.object({
  kere: z.number().min(1, "Sense index required"), // index of sense
  erevwe: z.string().min(1, "Style/usage required"), // e.g., standard, informal
  otakpopko: z.string().min(1, "Primary pronunciation required"),
  upho: z.string().min(1, "Secondary pronunciation required"),
  ekerota: z.array(z.string().min(1, "Part of speech required")),
  oto: z.array(z.string().min(1, "Definition required")),
  idje: z.array(z.string().min(1, "Example sentence required")),
  omra: z.array(z.string().url("Must be a valid audio URL")), // audio files
  oma: z.array(omaSchema), // media
  okpo: z.array(z.string().min(1, "Related word required")), // related words
  orhan: z.array(z.string().min(1, "Root word required")),
  ibuebu: z.array(z.string().min(1, "Synonym required")),
  okaeruo: z.array(z.string().min(1, "Antonym required")),
  translations: translationSchema, // key: lang code, value: TranslationDto
});

// CreateWordDto
export const createWordSchema = z.object({
  ota: z.string().min(1, "Word is required"), // main Urhobo word
  oka: z.number().min(1, "Total number of oho required"),
  oho: z.array(ohochema),
});