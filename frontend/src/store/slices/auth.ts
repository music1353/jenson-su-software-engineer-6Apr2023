import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthType } from 'types/auth';

interface AuthStateType {
  isAuthenticated: boolean;
  user: AuthType;
}

const initialUser = {
  id: 0,
  uid: "",
  identifier: "",
  auth_type: "",
  username: ""
}
const initialAuthState: AuthStateType = {
  isAuthenticated: false,
  user: { ...initialUser }
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state: AuthStateType, action: PayloadAction<AuthType>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state: AuthStateType) {
      state.isAuthenticated = false;
      state.user = { ...initialUser };
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;