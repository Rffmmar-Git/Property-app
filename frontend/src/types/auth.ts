export type UserRole = "CUSTOMER" | "TENANT";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  id: string;
  fullName: string;
  email: string;
  isVerified: boolean;
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  setAuth: (
    accessToken: string,
    user: AuthUser,
  ) => void;

  clearAuth: () => void;
}