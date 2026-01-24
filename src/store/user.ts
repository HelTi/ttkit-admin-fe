import { queryCurrentUserInfo, queryUpdateUserInfo } from "@/services/user";
import type { UserInfo } from "@/types/user";
import { UserRole } from "@/types/user";
import { create } from "zustand";

interface UserStoreState {
  userInfo: UserInfo;
  error: string;
  initUserInfo: () => Promise<UserInfo | void>;
  updateUserInfo: (values: Partial<UserInfo>) => Promise<UserInfo | void>;
}

const initialState: Pick<UserStoreState, "userInfo" | "error"> = {
  userInfo: {
    name: "admin",
    email: "",
    user_type: UserRole.USER,
    gender: "other",
  },
  error: "",
};

export const useUserStore = create<UserStoreState>((set) => ({
  ...initialState,
  initUserInfo: async () => {
    try {
      const res = await queryCurrentUserInfo({});
      const { data } = res;
      set({ userInfo: data });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      }
    }
  },
  updateUserInfo: async (values) => {
    try {
      const res = await queryUpdateUserInfo(values);
      const { data } = res;
      set({ userInfo: values as UserInfo });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      }
    }
  },
}));
