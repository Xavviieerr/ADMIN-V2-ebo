export { NamesApiError, getNamesErrorMessage } from "./errors";
export {
  fetchNamesStats,
  fetchNames,
  fetchSingleName,
  createName,
  updateName,
  approveName,
  rejectName,
  deleteName,
  buildNamesQuery,
} from "./names";
export type { ListNamesParams, CreateNameInput, UpdateNameInput, CreateTranslationInput } from "./names";
export { addTranslation, updateTranslation, removeTranslationUnavailable } from "./translations";
export { fetchDialects } from "./provinces";
export type { Dialect } from "./provinces";
export { hasNameCapability, canCreateName, canEditName, canModerateName, canDeleteName } from "./capabilities";
export type { NameCapability } from "./capabilities";
