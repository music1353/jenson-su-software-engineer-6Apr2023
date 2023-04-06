import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { profileActions } from "store/slices/profile";
import { OnlineContextProvider } from "contexts/onlineContext";
import v1Api from "apis/v1";
import SekeletonComponent from "components/ui/SkeletonComponent";
import ProfileToolbar from "./Toolbar";
import ProfileHead from "components/profile/Head";
import ProfileExperiences from "components/profile/Experiences";
import ProfileUtil from "utils/ProfileUtil";


const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const profileState = useSelector((state: RootState) => state.profile);
  const experiencesState = ProfileUtil.sortExperiences([ ...profileState.experiences ]);

  const getProfileMeData = async () => {
    setLoading(true);
    dispatch(profileActions.init());

    try {
      const response = await v1Api.profile.me();
      dispatch(profileActions.updateData(response?.data.data));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    dispatch(profileActions.init());

    const fetchData = async () => {
      await getProfileMeData();
    }
    fetchData();
  }, []);

  return (
    <main className="profile-page">
      <div className="page-wrapper">
        {
          !loading ? (
            <OnlineContextProvider>
              <article className="page-body">
                <ProfileToolbar />
                <ProfileHead
                  profileState={profileState}
                  editable={true}
                />
                <ProfileExperiences
                  experiencesState={experiencesState}
                  editable={true}
                />
              </article>
            </OnlineContextProvider>
          ) : (
            <SekeletonComponent />
          )
        }
      </div>
    </main>
  )
}

export default ProfilePage;