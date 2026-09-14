export type DashboardStats = {
  stats: {
    totalUsers: number;
    totalAdmins: number;
    totalWords: number;
    approvedWords: number;
    pendingWords: number;
    rejectedWords: number;
    inReviewWords: number;
    contributors: number;
    posts: number;
  };
  wordOfTheDay: {
    ota: string;
    metadata: {
      generatedAt: string;
      source: string;
    };
  };
  recentUsers: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    profilePictureUrl: string;
    gender: string;
    DOB: null;
    province: null;
    town: null;
    role: string;
    status: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
    activityStats: {
      totalLogins: number;
      lastLogin: string;
      totalActiveDays: number;
      activityMilestones: {};
    };
  }[];
  recentWords: WordRecord[];
  wordGrowthStats: {
    day: string;
    count: number;
  }[];
  trendingWords: {
    id: string;
    ota: string;
    directQueryCount: number;
    lastAccessed: string;
  }[];
  topUsers: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    active_days: string;
  }[];
  scheduledWords: {
    id: string;
    word: {
      id: string;
      ota: string;
    };
    wordId: string;
    culturalNote: string;
    scheduledDate: string;
    isPublished: boolean;
    publishedAt: null;
    createdAt: string;
  }[];
  registrationByPlatform: {
    platform: string | null;
    total: string;
  }[];
};

export type WordRecord = {
  id: string;
  ota: string;
  efaEng: {
    otaWord: string;
    details: { ekerota: string[]; idje: { sentence: string }[]; oto: string };
  }[];
  oho: {
    ekerota: string[];
    oma: { url: string }[];
    upho: string;
    uphoesio: string;
  }[];
  pos: string[];
  createdAt: string;
  status: string;
};

export type SimpleRecord = {
  id: string;
  ota: string;
  efaEng: string[];
  oho: {
    ekerota: string[];
    oma: { url: string }[];
    upho: string;
    uphoesio: string;
  }[];
  pos: string[];
  oto: string[];
  idje: string[];
  createdAt: string;
  status: string;
};
