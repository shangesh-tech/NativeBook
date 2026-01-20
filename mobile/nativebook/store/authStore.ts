import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  createdAt?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;

  login: (email: string, password: string) => Promise<AuthResult>;

  checkAuth: () => Promise<void>;

  logout: () => Promise<void>;
}


const API_URL = process.env.EXPO_PUBLIC_API_URL;


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  /* ---------- REGISTER ---------- */
  register: async (username, email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      await SecureStore.setItemAsync("token", data.token);

      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      set({
        token: data.token,
        user: data.user,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      };
    }
  },

  /* ---------- LOGIN ---------- */
  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      await SecureStore.setItemAsync("token", data.token);

      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      set({
        token: data.token,
        user: data.user,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      };
    }
  },

  /* ---------- CHECK AUTH (APP START) ---------- */
  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const userJson = await AsyncStorage.getItem("user");

      set({
        token,
        user: userJson ? JSON.parse(userJson) : null,
      });
    } catch (error) {
      console.log("Auth check failed", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  /* ---------- LOGOUT ---------- */
  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    await AsyncStorage.removeItem("user");

    set({
      token: null,
      user: null,
    });
  },
}));
