
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "admin" | "teacher" | "student" | string; // extend as needed
  isVerified: boolean;
  lastLogin: string; // ISO date string
  profilePictureUrl: string | null;
}


export type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean | null;
};