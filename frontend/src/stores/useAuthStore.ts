import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { persist } from "zustand/middleware";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  signup: (data: { username: string; email: string; password: string }) => Promise<boolean>;
  login: (data: { email: string; password: string }) => Promise<any>;
  userdetails:(data: {course: string; branch: string; year: string, learning_goals: string}) => Promise<any>;
  logout: () => void;
}

const getToken = (): string | null => {
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;

    // zustand/persist stores JSON with { state: {...} }
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
};


const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      signup: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post<{ user: User; token: string }>(
            `${BASE_URL}/api/v1/user/register`,
            data
          );
          set({ user: res.data.user, token: res.data.token, loading: false });
          return true;
        } catch (err: any) {
          let message = "Something went wrong. Please try again.";

          if (axios.isAxiosError(err)) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            message = axiosErr.response?.data?.message || axiosErr.message || message;
          }

          set({ error: message, loading: false });
          return false;
        }
      },

      login: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post<{ user: User; token: string }>(
            `${BASE_URL}/api/v1/user/login`,
             data
          );
          set({ user: res.data.user, token: res.data.token, loading: false });
          return res;
        } catch (err: any) {
          let message = "Invalid credentials or server error.";

          if (axios.isAxiosError(err)) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            message = axiosErr.response?.data?.message || axiosErr.message || message;
          }

          set({ error: message, loading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem("auth-storage");
      },

      userdetails: async (data) =>{
        set({ loading: true, error: null });
        const token = getToken();
        console.log("Token in userdetails:", token);
        try {
          const res = await axios.post(
            `${BASE_URL}/api/v1/user/details`,
             data,
             {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            }
          );
          set({loading: false });
          return res.data.frame;  
        } catch (err: any) {
          let message = "Invalid credentials or server error.";

          if (axios.isAxiosError(err)) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            message = axiosErr.response?.data?.message || axiosErr.message || message;
          }

          set({ error: message, loading: false });
          return false;
        }
      }
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;
