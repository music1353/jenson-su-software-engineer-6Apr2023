import type { FileType } from "./file";
import type { ExperienceType } from "./experience";
import type { SettingType } from "./setting";

interface BasicInfoType {
  name: string;
  age: number | null;
  description: string;
}

interface ProfileType {
  id: number;
  avatar: FileType | null;
  name: string;
  description: string;
  age: number | null;
  experiences: Array<ExperienceType> | [];
  setting: SettingType;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type { ProfileType, BasicInfoType };