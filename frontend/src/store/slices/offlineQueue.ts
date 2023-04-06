import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ProfileType } from 'types/profile';
import type { ExperienceType } from 'types/experience';


enum ActionNameTypes {
  UPDATE_BASIC_INFO = "UPDATE_BASIC_INFO",
  ADD_EXPERIENCE = "ADD_EXPERIENCE",
  UPDATE_EXPERIENCE_INFO = "UPDATE_EXPERIENCE_INFO",
  DELETE_EXPERIENCE = "DELETE_EXPERIENCE"
}
type ActionType =
  | { name: ActionNameTypes.UPDATE_BASIC_INFO; data: Partial<ProfileType> }
  | { name: ActionNameTypes.ADD_EXPERIENCE; data: { title: string } }
  | { name: ActionNameTypes.UPDATE_EXPERIENCE_INFO; data: Partial<ExperienceType> }
  | { name: ActionNameTypes.DELETE_EXPERIENCE; data: { id: string } }

interface OfflineQueueStateType {
  actions: ActionType[];
}


const initialState: OfflineQueueStateType = {
  actions: []
};

const offlineQueueSlice = createSlice({
  name: "offlineQueue",
  initialState: initialState,
  reducers: {
    push: (state, action: PayloadAction<ActionType>) => {
      state.actions.push(action.payload);
    },
    clear: (state) => {
      state.actions = [];
    }
  }
});

export const offlineQueueActions = offlineQueueSlice.actions;
export default offlineQueueSlice.reducer;
export { ActionNameTypes };
export type { ActionType };