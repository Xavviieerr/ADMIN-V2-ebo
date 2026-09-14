import React from "react";
import { FiguresPagination, MiniFigures } from "../lib";
import {
  LocaleWrapper,
  MobileTable,
  PaginationWidget,
} from "@/features/shared";
import TableRow from "./table-row";

const FiguresTable: React.FC<{
  figures: Promise<FiguresPagination & { items: MiniFigures[] }>;
  page: string;
}> = async ({ figures, page = "1" }) => {
  const data = await figures;
  return (
    <div className="w-full">
      <div className=" flex flex-col p-3 bg-gray-txt-100 rounded-md w-full mt-8">
        <table className="w-full min-w-[640px] max-md:hidden">
          <thead className="bg-base-bg-50  border-b border-white/10 text-sm sm:text-base ">
            <tr>
              <th className="p-5 text-left text-white rounded-l-md">
                <LocaleWrapper item="common.name" />
              </th>
              <th className="p-5  text-left text-white">
                <LocaleWrapper item="figures.occupation" />
              </th>
              <th className="p-5 text-center text-white rounded-r-md">
                <LocaleWrapper item="common.dob" />
              </th>
              <th className="p-5 text-center text-white rounded-r-md">
                <LocaleWrapper item="common.status" />
              </th>
            </tr>
          </thead>

          {data?.items && data.items.length > 0 ? (
            <tbody className="divide-y divide-white/10">
              {data.items.map((item, index) => (
                <TableRow key={index} item={item} />
              ))}
            </tbody>
          ) : (
            <tbody className="divide-y divide-white/10">
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-white/90">
                  <LocaleWrapper item="figures.noFiguresFound" />
                </td>
              </tr>
            </tbody>
          )}
        </table>

        <div className="flex flex-col gap-4 md:hidden">
          {data?.items && data.items.length > 0 ? (
            data.items.map((item, index) => (
              <MobileTable
                key={index}
                link={`/guonopedia/figures/${item.id}`}
                items={[
                  { title: "common.name", body: item.fullName },
                  { title: "common.occupation", body: item.occupation },
                  // { title: "common.dob", body: item.dob },
                ]}
                status={item.status}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <LocaleWrapper item="figures.noFiguresFound" />
            </div>
          )}
        </div>
      </div>

      {data?.totalPages && data.totalPages > 1 && (
        <PaginationWidget
          totalPages={data.totalPages}
          currentPage={Number(page) ?? data.page}
        />
      )}
    </div>
  );
};

export default FiguresTable;
