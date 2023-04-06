import React, { useState } from "react";
import { Col, Row, Button, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { OnlineContext } from "contexts/onlineContext";
import { profileActions } from "store/slices/profile";
import v1Api from "apis/v1";
import type { ProfileType } from "types/profile";
import ImageUploader from "components/common/ImageUploader";
import BasicInfoEditModal from "components/profile/BasicInfoEditModal";

interface Props {
  profileState: ProfileType;
  editable: boolean;
}

const ProfileHead: React.FC<Props> = ({ profileState, editable }) => {
  const isOnline = React.useContext(OnlineContext);

  const dispatch = useDispatch();
  
  const [basicInfoModalVisible, setBasicInfoModalVisible] = useState<boolean>(false);
  const onBasicInfoModalCancel = () => {
    setBasicInfoModalVisible(false);
  }

  const [messageApi, contextHolder] = message.useMessage();
  const key = "updateAvatarMessage";

  const [avatarUri, setAvatarUri] = useState(profileState.avatar?.uri);
  const handleAvatarError = (err: string) => {
    message.error(err);
    return
  }
  const handleAvatarUpdated = async (file: File) => {
    if (!isOnline) {
      message.error("The avatar cannot be updated until the network is restored");
      return
    }

    messageApi.open({
      key,
      type: "loading",
      content: "Uploading avatar",
      duration: 0
    });

    const oldFileId: number | null = profileState.avatar ? profileState.avatar.id : null;

    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      const response = await v1Api.file.insertOne(formData);
      await v1Api.profile.updateOne(profileState.id, {
        avatar: response?.data.data.id
      });
      dispatch(profileActions.updateData({
        avatar: response?.data.data
      }));
      setAvatarUri(response?.data.data.uri);

      messageApi.open({
        key,
        type: "success",
        content: "Avatar update success",
      });
    } catch (error) {
      console.error(error);
      messageApi.open({
        key,
        type: "error",
        content: "Avatar update failed",
      });
      return
    }

    if (oldFileId) {
      v1Api.file.deleteOne(oldFileId);
    }
  }

  return (
    <section className="body-head spotlight-card">
      {
        editable && (
          <div className="card-actions">
            <Button
              onClick={() => { setBasicInfoModalVisible(true) }}
              className="action__btn"
              type="text"
              color="primary"
              icon={<EditOutlined />}
            >
              Edit
            </Button>
          </div>
        )
      }

      <Row>
        <Col xs={24} sm={4}>
          <div className="head__avatar">
            {contextHolder}
            <ImageUploader
              imageUri={avatarUri ? avatarUri : null}
              editable={editable}
              errorCallback={handleAvatarError}
              updatedCallback={handleAvatarUpdated}
            />
          </div>
        </Col>
        <Col xs={24} sm={20}>
          <div style={{ padding: "12px 0" }}>
            <span className="head__name">{ profileState.name }</span>
            <span className="head__age">
              ({ profileState.age ? profileState.age?.toString() : "age" })
            </span>
          </div>
          <div className="head__description">
            { profileState.description ? profileState.description : "Breif introduce yourself!" }
          </div>
        </Col>
      </Row>

      <BasicInfoEditModal
        visible={basicInfoModalVisible}
        onCancel={onBasicInfoModalCancel}
      />
    </section>
  )
}

export default ProfileHead;