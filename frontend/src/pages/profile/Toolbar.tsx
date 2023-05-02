import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { RootState } from "store";
import SettingModal from "components/profile/SettingModal";
import PrivacyStatusIcon from "components/ui/PrivacyStatusIcon";


const ProfileToolbar: React.FC = () => {
  const { setting } = useSelector((state: RootState) => state.profile);

  const [settingModalVisible, setSettingModalVisible] = useState<boolean>(false);
  const openSettingModal = () => {
    setSettingModalVisible(true);
  }
  const onSettingModalCancel = () => {
    setSettingModalVisible(false);
  }
  
  return (
    <section className="body-toolbar">
      <Button
        onClick={openSettingModal}
        className={`toolbar-btn ${ setting.isPublic ? "btn--public" : "" }`}
        type="text"
        icon={<PrivacyStatusIcon isPublic={setting.isPublic} />}
        data-testid="toolbarButton"
      >{ setting.isPublic ? "Public" : "Private" }</Button>

      <SettingModal
        visible={settingModalVisible}
        onCancel={onSettingModalCancel}
      />
    </section>
  )
}

export default ProfileToolbar;