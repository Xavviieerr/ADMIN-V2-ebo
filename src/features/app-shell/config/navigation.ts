import {
  Settings,
  Gamepad2,
  Volleyball,
  LanguagesIcon,
  HistoryIcon,
  BrainCog,
  Music,
  LayoutDashboardIcon,
  UserIcon,
  BookOpenIcon,
} from "lucide-react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { TreePalmIcon } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type NavItem = {
  translationKey: string;
  href: string;
  icon: LucideIcon;
  permission: string | null;
  superAdminOnly?: boolean;
  children?: NavItem[];
};

export const navigation: NavItem[] = [
  {
    translationKey: "sidebar.home",
    href: "/home",
    icon: LayoutDashboardIcon,
    permission: null,
  },
  {
    translationKey: "sidebar.users",
    href: "/users",
    icon: UserIcon,
    permission: "view_user",
  },
  {
    translationKey: "sidebar.guonopedia",
    href: "#",
    icon: GlobeAltIcon,
    permission: "view_word",
    children: [
      {
        translationKey: "sidebar.dictionary",
        href: "/guonopedia/dictionary",
        icon: BookOpenIcon,
        permission: "view_word",
      },
      {
        translationKey: "sidebar.names",
        href: "/guonopedia/names",
        icon: UserIcon,
        permission: null,
      },
      {
        translationKey: "sidebar.culture",
        href: "#",
        icon: LanguagesIcon,
        permission: "view_culture",
      },
      {
        translationKey: "sidebar.historicalFigures",
        href: "/guonopedia/figures",
        icon: HistoryIcon,
        permission: null,
      },
      {
        translationKey: "sidebar.proverbsAndIdioms",
        href: "#",
        icon: BrainCog,
        permission: "view_proverb",
      },
      {
        translationKey: "sidebar.traditionalMusic",
        href: "#",
        icon: Music,
        permission: "view_music",
      },
      {
        translationKey: "sidebar.folktales",
        href: "#",
        icon: BookOpenIcon,
        permission: "view_folktale",
      },
    ],
  },
  {
    translationKey: "sidebar.sports",
    href: "#",
    icon: Volleyball,
    permission: "view_sport",
  },
  {
    translationKey: "sidebar.quiz",
    href: "/games",
    icon: Gamepad2,
    permission: null,
  },
  {
    translationKey: "sidebar.province",
    href: "/province",
    icon: TreePalmIcon,
    permission: "view_province",
  },
  {
    translationKey: "sidebar.permissions",
    href: "/permissions",
    icon: Settings,
    permission: null,
    superAdminOnly: true,
  },
];
