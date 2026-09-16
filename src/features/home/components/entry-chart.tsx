"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { HomeStats } from "../types";
import { CHART_COLORS, CHART_MARGIN } from "../constants";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

const EntryChart = ({
  data,
}: {
  data: HomeStats["wordGrowthStats"] | undefined;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <div className="rounded-[20px] bg-secondary-bg py-6 md:py-8 px-3 md:px-5 shadow w-full text-primary-bg">
      <div className="flex items-center justify-between pb-4">
        <h2 className="max-md:text-lg max-md:font-medium text-xl font-semibold text-white">
          {t("common.dictionaryOverview")}
        </h2>
      </div>

      <div className="px-5 md:h-74">
        <AreaChart
          style={{
            width: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            aspectRatio: 1.618,
          }}
          responsive
          data={data}
          margin={CHART_MARGIN}
          onContextMenu={(_, e) => e.preventDefault()}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" niceTicks="snap125" />
          <YAxis width="auto" niceTicks="snap125" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke={CHART_COLORS.STROKE}
            fill={CHART_COLORS.FILL}
          />
        </AreaChart>
      </div>
    </div>
  );
};

export default EntryChart;
