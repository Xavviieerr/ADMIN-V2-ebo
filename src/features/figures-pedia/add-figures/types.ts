import { FigurePayload } from "../lib";

export type BasicInfo = Omit<
  FigurePayload,
  "biography" | "externalLinks" | "timeline" | "family" | "relatedFigures" | ""
>;
