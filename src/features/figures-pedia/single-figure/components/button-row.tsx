import { PenBox } from "lucide-react";
import { Figure } from "../../lib";
import DeleteBtn from "./delete-btn";
import ApproveRejectBtn from "./approve-reject-btn";
import Link from "next/link";

const ButtonRow = ({ data }: { data: Figure }) => {
  return (
    <div className="flex max-md:flex-col w-full md:items-center justify-between">
      <h3 className="text-white text-2xl capitalize">{data.fullName}</h3>

      <div className="flex items-center justify-end md:gap-4 gap-2 max-md:w-full">
        <Link
          href={`/guonopedia/figures/edit?id=${data.id}`}
          className="flex items-center justify-center gap-2 secondary-btn"
        >
          <PenBox size={18} className="max-md:hidden" />
          Edit
        </Link>

        <ApproveRejectBtn data={data} />

        <DeleteBtn data={data} />
      </div>
    </div>
  );
};

export default ButtonRow;
