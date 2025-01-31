import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      console.log("user====>",action.payload);
      state.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData',JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem("userData");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

