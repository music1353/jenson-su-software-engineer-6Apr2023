import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { message } from "antd";
import { validate } from "uuid";
import v1Api from "apis/v1";
import type { ProfileType } from "types/profile";
import type { ExperienceType } from "types/experience";
import PageBody from "./PageBody";
import PrivatePage from "./PrivateBody";
import PassBody from "./PassBody";
import SekeletonComponent from "components/ui/SkeletonComponent";
import ProfileUtil from "utils/ProfileUtil";


const ViewPage: React.FC = () => {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isPass, setIsPass] = useState<boolean>(false);

  const [passSuccess, setPassSuccess] = useState<boolean>(false);

  const [profileState, setProfileState] = useState<ProfileType>();
  const [experiencesState, setExperienceState] = useState<ExperienceType[]>([]);

  useEffect(() => {
    if (!uid) {
      navigate("/error/404");
      return
    }
    if (uid && !validate(uid)) {
      navigate("/error/404");
      return
    }

    const fetchData = async () => {
      try {
        const response = await v1Api.profile.findOneByUid(uid);
        const data = response?.data.data;
        
        setIsPublic(data.setting.isPublic);
        setIsPass(data.setting.isPass);

        setProfileState(data);
        setExperienceState(ProfileUtil.sortExperiences([ ...data.experiences ]));
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            navigate("/error/404");
            return
          }
        } else {
          message.error("Get profile failed. It seems that some errors have occurred");
          console.error(error);
        }
      }
    }
    fetchData();
  }, []);
  
  const PageContent = isPublic ? (
    isPass ? (
      passSuccess ? (
        <PageBody
          profileState={profileState!}
          experiencesState={experiencesState}
        />
      ) : (
        <PassBody onSuccess={() => setPassSuccess(true)} />
      )
    ) : (
      <PageBody
        profileState={profileState!}
        experiencesState={experiencesState}
      />
    )
  ) : (
    <PrivatePage />
  );

  return (
    <main className="profile-page">
      <div className="page-wrapper">
        {
          !loading ? (
            PageContent
          ) : (
            <SekeletonComponent />
          )
        }
      </div>
    </main>
  )
}

export default ViewPage;