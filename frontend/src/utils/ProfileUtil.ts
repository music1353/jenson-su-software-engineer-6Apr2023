import type { ExperienceType } from "types/experience";

export default class ProfileUtil {
  static sortExperiences = (experiences: ExperienceType[]): ExperienceType[] => {
    const sortedExperiences = experiences.slice().sort((a: ExperienceType, b: ExperienceType) => {
      if (a.startYear === b.startYear) {
        return parseInt(b.startMonth) - parseInt(a.startMonth);
      }
      return parseInt(b.startYear) - parseInt(a.startYear);
    });
  
    const presentExperiences = sortedExperiences.filter(
      (experience) => experience.isPresent
    );
    const pastExperiences = sortedExperiences.filter(
      (experience) => !experience.isPresent
    );
  
    return [...presentExperiences, ...pastExperiences]
  }
}