import { DashboardStats } from "./types";
import { PermissionGate } from "../shared";
import { getDashboardStats } from "./api/getDashboardStats";
import {
  ClearLocalStorage,
  DashboardAnalytics,
  EntryChart,
  PendingEntries,
  RecentUsers,
  RegistrationByPlatform,
  ScheduledWordOfTheDay,
  SetWordOfTheDay,
  TopUsers,
  TrendingWords,
  WordOfTheDay,
} from "./components";

const DashboardFeature = async ({ query }: { query: { page: string } }) => {
  const { data }: { data: DashboardStats | undefined } =
    await getDashboardStats();

  const { page = "home" } = query;

  if (page == "newWord") return <SetWordOfTheDay />;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <ClearLocalStorage />
      <div className="w-full mx-auto pb-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 flex flex-col gap-6 lg:gap-8">
            <DashboardAnalytics stats={data?.stats} />

            <EntryChart data={data?.wordGrowthStats} />

            <div className="flex max-md:flex-col w-full items-start gap-5">
              <WordOfTheDay data={data?.wordOfTheDay} />
              <ScheduledWordOfTheDay data={data?.scheduledWords} />
            </div>

            <PermissionGate permission="view_user">
              <div className="flex max-md:flex-col w-full items-start gap-5">
                <RecentUsers data={data?.recentUsers} />

                <TopUsers data={data?.topUsers} />
              </div>
            </PermissionGate>

            {data?.recentWords && data.recentWords.length > 0 && (
              <PendingEntries data={data.recentWords} />
            )}

            <div className="flex max-md:flex-col w-full items-start gap-5">
              {data?.trendingWords && data.trendingWords.length > 0 && (
                <TrendingWords data={data.trendingWords} />
              )}

              {data?.registrationByPlatform &&
                data.registrationByPlatform.length > 0 && (
                  <RegistrationByPlatform data={data.registrationByPlatform} />
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardFeature;
