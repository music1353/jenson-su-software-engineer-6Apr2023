import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from 'lodash';
import { validate } from "uuid";
import type { ProfileType } from 'types/profile';
import type { ExperienceType } from 'types/experience';
import type { SettingType } from "types/setting";


const initialProfileState: ProfileType = {
  id: 0,
  avatar: null,
  name: "",
  description: "",
  age: null,
  experiences: [],
  setting: {
    id: 0,
    isPublic: false,
    isPass: false,
    passCode: ""
  },
  createdAt: null,
  updatedAt: null
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialProfileState,
  reducers: {
    init(state: ProfileType) {
      state = cloneDeep(initialProfileState);
    },
    updateData(state: ProfileType, action: PayloadAction<Partial<ProfileType>>) {
      Object.assign(state, action.payload);
    },
    addExperience(state: ProfileType, action: PayloadAction<ExperienceType>) {
      const cleanExperiences = state.experiences.filter(item => validate(item.id));
      const newExperiences = [...cleanExperiences, action.payload];
      state.experiences = newExperiences;
    },
    updateExperience(state: ProfileType, action: PayloadAction<ExperienceType>) {
      const index = state.experiences.findIndex(experience => experience.id === action.payload.id);
      if (index !== -1) {
        state.experiences[index] = action.payload;
      }
    },
    removeExperience(state: ProfileType, action: PayloadAction<string>) {
      state.experiences = state.experiences.filter(exp => exp.id !== action.payload);
    },
    updateSetting(state: ProfileType, action: PayloadAction<Partial<SettingType>>) {
      state.setting = {
        ...state.setting,
        ...action.payload
      }
    },
  }
});
export const profileActions = profileSlice.actions;
export default profileSlice.reducer;