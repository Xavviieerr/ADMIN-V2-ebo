import { HomeStats } from "../types";

type TFunction = (key: string, defaultValue?: string) => string;

export function getStatCards(stats: HomeStats["stats"] | undefined, t: TFunction) {
  return [
    {
      label: t("home.totalUsersStat"),
      value: stats?.totalUsers?.toLocaleString() ?? "0",
      href: "/users",
      caption: t("home.totalUsersDesc"),
    },
    {
      label: t("home.totalWordsStat"),
      value: stats?.totalWords?.toLocaleString() ?? "0",
      href: "/guonopedia/dictionary",
      caption: t("home.totalWordsDesc"),
    },
    {
      label: t("home.totalPlacesStat"),
      value: stats?.totalPlaces?.toLocaleString() ?? "0",
      href: "/guonopedia/places",
      caption: t("home.totalPlacesDesc"),
    },
    {
      label: t("home.totalNamesStat"),
      value: stats?.totalNames?.toLocaleString() ?? "0",
      href: "/guonopedia/names",
      caption: t("home.totalNamesDesc"),
    },
    {
      label: t("home.totalCustomsStat"),
      value: stats?.totalCustoms?.toLocaleString() ?? "0",
      href: "/guonopedia/culture",
      caption: t("home.totalCustomsDesc"),
    },
    {
      label: t("home.totalFiguresStat"),
      value: stats?.totalFigures?.toLocaleString() ?? "0",
      href: "/guonopedia/figures",
      caption: t("home.totalFiguresDesc"),
    },
    {
      label: t("home.totalProverbsStat"),
      value: stats?.totalProverbs?.toLocaleString() ?? "0",
      href: "/guonopedia/proverbs",
      caption: t("home.totalProverbsDesc"),
    },
    {
      label: t("home.totalFolktalesStat"),
      value: stats?.totalFolktales?.toLocaleString() ?? "0",
      href: "/guonopedia/folktales",
      caption: t("home.totalFolktalesDesc"),
    },
  ];
}
