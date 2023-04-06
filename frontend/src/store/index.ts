import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/auth";
import profileReducer from "./slices/profile";
import offlineQueueReducer from "./slices/offlineQueue";

// persist reducer & store
const authPersistConfig = {
  key: "auth",
  storage
}
const profilePersistConfig = {
  key: "profile",
  storage
}
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedProfileReducer = persistReducer(profilePersistConfig, profileReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    profile: persistedProfileReducer,
    offlineQueue: offlineQueueReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});
persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export default store;