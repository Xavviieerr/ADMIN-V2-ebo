import { redirect } from "next/navigation";

export const handleFetchErrors = ({
  error,
  redirectPath,
}: {
  error: unknown;
  redirectPath?: string;
}) => {
  const msg = (error as Error).message || "An unspecified error has occured!";

  if (msg.toLowerCase().includes("unauthorized")) {
    redirect(encodeURI(`/login${redirectPath ? `?from=${redirectPath}` : ""}`));
  } else {
    return msg;
  }
};
