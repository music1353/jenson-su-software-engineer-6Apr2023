import type { FileType } from './file';

interface ExperienceType {
  id: string;
  title: string;
  logo: FileType | null;
  company: string;
  description: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  isPresent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExperienceCreateType {
  profileId: number;
  id: string;
  title: string;
  logo: FileType | null;
  company: string;
  description: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  isPresent: boolean;
}

export type { ExperienceType, ExperienceCreateType };