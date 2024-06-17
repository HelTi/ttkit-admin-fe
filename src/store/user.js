import { queryCurrentUserInfo, queryUpdateUserInfo } from "@/services/user";
import { create } from "zustand";


const initialState = {
  userInfo: {
    name: 'admin',
    nick_name: '',
    user_type: 1,
    avatar_url: '',
    signature: '',
    gender: 'other'
  },
  error: ''
}
export const useUserStore = create((set) => ({
  ...initialState,
  initUserInfo: async () => {
    try {
      console.log('userStore')
      const res = await queryCurrentUserInfo();
      const { data } = res
      set({ userInfo: data });
      return data
    } catch (error) {
      set({ error: error.message });
    }
  },
  updateUserInfo: async (values) => {
    try {
      const res = await queryUpdateUserInfo(values);
      const { data } = res
      set({ userInfo: values });
      return data
    } catch (error) {
      set({ error: error.message });
    }
  },

}))