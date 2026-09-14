import { redirect } from "next/navigation";

export const handleFetchError = (error: Error, redirectPath?: string) => {
  const msg = error.message || "An unspecified error has occured!";

  if (msg.toLowerCase().includes("unauthorized")) {
    redirect(encodeURI(`/login${redirectPath ? `?from=${redirectPath}` : ""}`));
  }
};
