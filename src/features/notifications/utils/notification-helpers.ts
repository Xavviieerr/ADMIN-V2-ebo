import moment from "moment";

export function getRelativeTime(dateString: string, t: (key: string) => string): string {
  const date = moment(dateString);
  const now = moment();
  const diffMinutes = now.diff(date, "minutes");
  const diffHours = now.diff(date, "hours");
  const diffDays = now.diff(date, "days");

  if (diffMinutes < 1) return t("notifications.justNow");
  if (diffMinutes < 60) return t("notifications.minutesAgo").replace("{n}", String(diffMinutes));
  if (diffHours < 24) return t("notifications.hoursAgo").replace("{n}", String(diffHours));
  if (diffDays === 1) return t("notifications.yesterday");
  return t("notifications.daysAgo").replace("{n}", String(diffDays));
}

export function getNotificationTypeLabel(type: string, t: (key: string) => string): string {
  const key = `notificationTypes.${type}`;
  try {
    const translated = t(key);
    return translated === key ? type.charAt(0).toUpperCase() + type.slice(1) : translated;
  } catch {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

export function formatNotificationDate(dateString: string): string {
  return moment(dateString).format("DD/MM/YYYY");
}
