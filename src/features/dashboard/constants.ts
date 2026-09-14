export const DASHBOARD_API = {
  STATS: "/admin/dashboard",
  WORD_OF_THE_DAY: "/admin/word-of-the-day",
  SEARCH: "/search",
} as const;

export const WORD_SEARCH_PARAMS = {
  MODE: "partial",
  LANG: "urhobo",
  LIMIT: 5,
} as const;

export const CHART_COLORS = {
  STROKE: "#02474F",
  FILL: "#39BCCB3D",
} as const;

export const CHART_MARGIN = {
  top: 20,
  right: 0,
  left: 0,
  bottom: 0,
} as const;

export const SCHEDULE_MAX_DAYS = 30;
