"use client";

import { useEffect } from "react";

const STORAGE_KEY_USERS_PAGE = "users_page";
const STORAGE_KEY_USERS_SEARCH = "users_search";
const STORAGE_KEY_USERS_ROLE = "users_role_filter";
const STORAGE_KEY_USERS_STATUS = "users_status_filter";

const ClearLocalStorage = () => {
  const clearUsersLocal = () => {
    localStorage.removeItem(STORAGE_KEY_USERS_PAGE);
    localStorage.removeItem(STORAGE_KEY_USERS_SEARCH);
    localStorage.removeItem(STORAGE_KEY_USERS_ROLE);
    localStorage.removeItem(STORAGE_KEY_USERS_STATUS);
  };
  useEffect(() => {
    clearUsersLocal();
  }, []);
  return <></>;
};

export default ClearLocalStorage;
