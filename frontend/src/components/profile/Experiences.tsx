import React, { useState } from "react";
import { Col, Row, Button, Tooltip, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { profileActions } from "store/slices/profile";
import { offlineQueueActions, ActionNameTypes, ActionType } from "store/slices/offlineQueue";
import { OnlineContext } from "contexts/onlineContext";
import type { ExperienceType } from "types/experience";
import v1Api from "apis/v1";
import EditExperienceModal from "components/profile/EditExperienceModal";
import ImageUploader from "components/common/ImageUploader";
import TimelineText from "components/ui/TimelineText";


const EmptyComponent: React.FC = () => {
  return (
    <div className="empty__item">Hi, add your first experience to let the company know you better</div>
  )
}

interface Props {
  experiencesState: ExperienceType[];
  editable: boolean;
}

const ProfileExperiences: React.FC<Props> = ({ experiencesState, editable }) => {
  const isOnline = React.useContext(OnlineContext);

  const dispatch = useDispatch();

  type ModeType = "add" | "update";
  const [editExperienceModalMode, setEditExperienceModalMode] = useState<ModeType>("add");
  const [editExperienceModalInitialData, setEditExperienceModalInitialData] = useState<ExperienceType|undefined>();
  const [editExperienceModalVisible, setEditExperienceModalVisible] = useState<boolean>(false);
  const openEditExperienceModal = (mode: ModeType, data?: ExperienceType) => {
    if (mode === "update") {
      setEditExperienceModalInitialData(data);
    }
    setEditExperienceModalMode(mode);
    setEditExperienceModalVisible(true);
  }
  const onEditExperienceModalCancel = () => {
    setEditExperienceModalInitialData(undefined);
    setEditExperienceModalVisible(false);
  }

  const showDeleteComfirmModal = (id: string) => {
    Modal.confirm({
      title: "Are you sure delete this experience?",
      icon: <ExclamationCircleFilled />,
      content: "This information will be lost and unrecoverable. Do you want to proceed?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleExperienceDelete(id);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }
  
  const handleExperienceDelete = async (id: string) => {
    dispatch(profileActions.removeExperience(id));

    if (isOnline) {
      await v1Api.experience.deleteOne(id);
      message.success("Delete experience success");
    } else {
      const action: ActionType = {
        name: ActionNameTypes.DELETE_EXPERIENCE,
        data: {
          id: id
        }
      }
      dispatch(offlineQueueActions.push(action));
    }
  }

  /* Company Logo */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updateLogoMessage";

  const handleLogoError = (err: string) => {
    message.error(err);
    return
  }
  const handleLogoUpdated = async (expData: ExperienceType, file: File) => {
    if (!isOnline) {
      message.error("The logo cannot be updated until the network is restored");
      return
    }

    messageApi.open({
      key,
      type: "loading",
      content: "Uploading company logo",
      duration: 0
    });

    const oldFileId: number | null = expData.logo ? expData.logo.id : null;

    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      const response = await v1Api.file.insertOne(formData);
      const updatedData = {
        ...expData,
        logo: response?.data.data
      }
      dispatch(profileActions.updateExperience(updatedData));

      await v1Api.experience.updateOne(expData.id, {
        logo: response?.data.data.id
      });

      messageApi.open({
        key,
        type: "success",
        content: "Logo avatar success",
      });
    } catch (error) {
      console.error(error);
      messageApi.open({
        key,
        type: "error",
        content: "Company logo update failed",
      });
      return
    }

    if (oldFileId) {
      v1Api.file.deleteOne(oldFileId);
    }
  }

  return (
    <section className="body-content spotlight-card">
      {
        editable && (
          <div className="card-actions">
            <Button
              onClick={() => { openEditExperienceModal("add") }}
              className="action__btn"
              type="text"
              color="primary"
              icon={<PlusOutlined />}
            >
              Add
            </Button>
          </div>
        )
      }

      <div className="content__title">Work Experience</div>
      <div className="content-body body-list list-split">
        {
          experiencesState.length ? (
            experiencesState.map(expData =>
              <div
                key={expData.id}
                className="list__item"
              >
                <Row>
                  {
                    editable && (
                      <div className="item-actions">
                        <Tooltip title="Delete experience">
                          <Button
                            onClick={() => { showDeleteComfirmModal(expData.id) }}
                            className="action-btn"
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                          />
                        </Tooltip>

                        <Button
                          onClick={() => { openEditExperienceModal("update", expData) }}
                          className="action-btn"
                          type="text"
                          color="primary"
                          icon={<EditOutlined />}
                        >
                          Edit
                        </Button>
                      </div>
                    )
                  }

                  <Col xs={24} sm={4}>
                    <div className="item-logo">
                      {contextHolder}
                      <ImageUploader
                        imageUri={expData.logo ? expData.logo.uri : null}
                        editable={editable}
                        errorCallback={handleLogoError}
                        updatedCallback={file => {handleLogoUpdated(expData, file)}}
                      />
                    </div>
                  </Col>
                  
                  <Col xs={24} sm={20}>
                    <div className="item-main">
                      <div className="main__title">{expData.title}</div>
                      <div className="main__company">{expData.company}</div>
                      <div className="main__timeline">
                        <TimelineText
                          startMonth={expData.startMonth}
                          startYear={expData.startYear}
                          endMonth={expData.endMonth}
                          endYear={expData.endYear}
                          isPresent={expData.isPresent}
                        />
                      </div>
                      <div className="main__description">
                        { expData.description }
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            )
          ) : (
            <EmptyComponent />
          )
        }

        <EditExperienceModal
          visible={editExperienceModalVisible}
          mode={editExperienceModalMode}
          initialData={editExperienceModalInitialData}
          onCancel={onEditExperienceModalCancel}
        />
      </div>
    </section>
  )
}

export default ProfileExperiences;