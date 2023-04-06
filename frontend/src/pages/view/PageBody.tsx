import React from "react";
import type { ProfileType } from "types/profile";
import type { ExperienceType } from "types/experience";
import ProfileHead from "components/profile/Head";
import ProfileExperiences from "components/profile/Experiences";

interface Props {
  profileState: ProfileType;
  experiencesState: ExperienceType[];
}

const PageBody: React.FC<Props> = ({ profileState, experiencesState }) => {
  return (
    <article className="page-body">
      <ProfileHead
        profileState={profileState}
        editable={false}
      />
      <ProfileExperiences
        experiencesState={experiencesState}
        editable={false}
      />
    </article>
  )
}

export default PageBody;