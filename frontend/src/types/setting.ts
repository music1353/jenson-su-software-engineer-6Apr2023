interface SettingType {
  id: number;
  isPublic: boolean;
  isPass: boolean;
  passCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type { SettingType };