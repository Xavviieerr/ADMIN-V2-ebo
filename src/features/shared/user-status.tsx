const UserStatus = ({ status }: { status: string }) => {
  const statusColor: Record<string, string> = {
    active: "text-green border border-green",
    inactive: "text-red-500 border border-red-500",
    pending: "text-yellow border border-yellow",
    suspended: "text-red-500 border border-red-500",
  };
  return (
    <span
      className={`capitalize px-5 py-3 text-sm rounded ${statusColor[status]}`}
    >
      {status}
    </span>
  );
};

export default UserStatus;
