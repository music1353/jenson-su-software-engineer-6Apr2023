import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Input, Button, Radio, Space, Tooltip, Switch, Row, Col, message } from "antd";
import type { RadioChangeEvent } from 'antd';
import { CopyOutlined } from "@ant-design/icons";
import { RootState } from "store";
import { profileActions } from "store/slices/profile";
import v1Api from "apis/v1";
import PrivacyStatusIcon from "components/ui/PrivacyStatusIcon";


interface Props {
  visible: boolean;
  onCancel: () => void;
}
const SettingModal: React.FC<Props> = ({ visible, onCancel }) => {
  const dispatch = useDispatch();

  const { id, setting } = useSelector((state: RootState) => state.profile);

  const [privacyIsPublicValue, setPrivacyIsPublicValue] = useState<boolean>(setting.isPublic);
  const onPrivacyIsPublicRadioChange = (e: RadioChangeEvent) => {
    setPrivacyIsPublicValue(e.target.value);
  }

  const [privacyIsPassValue, setPrivacyIsPassValue] = useState<boolean>(setting.isPass);
  const onPrivacyIsPassSwitchChange = (checked: boolean) => {
    setPrivacyIsPassValue(checked);
  }

  const [privacyPassCodeValue, setPrivacyPassCodeValue] = useState<string>(setting.passCode);
  const onPrivacyPassCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d+$/;
    if (regex.test(value) || value === "") {
      setPrivacyPassCodeValue(value);
    }
    
  }

  const { uid } = useSelector((state: RootState) => state.auth.user);
  const publicURL = `${window.location.origin}/view/${uid}`;

  const handleSettingUpdate = async () => {
    try {
      await v1Api.profile.updateOneSetting(id, {
        isPublic: privacyIsPublicValue,
        isPass: privacyIsPassValue,
        passCode: privacyPassCodeValue
      });
      dispatch(profileActions.updateSetting({
        isPublic: privacyIsPublicValue,
        isPass: privacyIsPassValue,
        passCode: privacyPassCodeValue
      }));
      message.success("Update profile setting success");
    } catch (error) {
      console.error(error);
      message.error("Update profile setting failed. Please wait a moment");
    }

    onCancel();
  }

  const handleCancel = () => {
    setPrivacyIsPublicValue(setting.isPublic);
    setPrivacyIsPassValue(setting.isPass);
    setPrivacyPassCodeValue(setting.passCode);

    onCancel();
  }

  const handleCopy = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        let textField = document.createElement('textarea')
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy')
        textField.remove();
      }

      message.success("Copied url success");
    } catch (err) {
      console.error("Error copying text: ", err);
      message.error("Copied url failed");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      onOk={handleSettingUpdate}
      className="profile-setting-modal"
      okText="Update"
      data-testid="settingModal"
    >
      <div className="modal-header">
        <div className="header__title">Profile Setting</div>
      </div>

      <div className="modal-body">
        <div className="body-item">
          <div className="item__title">Privacy</div>
          <div className="item__content">
            <Radio.Group
              value={privacyIsPublicValue}
              onChange={onPrivacyIsPublicRadioChange}
              className="content-radio"
            >
              <Space direction="vertical">
                <Radio
                  value={false}
                  className="radio-option"
                >
                  <Row gutter={12}>
                    <Col className="option-icon" span={3}>
                      <PrivacyStatusIcon isPublic={false} />
                    </Col>
                    <Col className="option-description" span={21}>
                      <div className="description__title">Private</div>
                      <div className="description__text">No one can see your profile, even if they are sign-in.</div>
                    </Col>
                  </Row>
                </Radio>

                <Radio
                  value={true}
                  className="radio-option"
                >
                  <Row gutter={12}>
                    <Col className="option-icon" span={3}>
                      <PrivacyStatusIcon isPublic={true} />
                    </Col>
                    <Col className="option-description" span={21}>
                      <div className="description__title">Public</div>
                      <div className="description__text">Anyone with the link can view your profile. No sign-in is required.</div>
                    </Col>
                  </Row>
                </Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>

        <hr className="body--divider" />

        <div className="body-item">
          <div className="item__title">Sharing URL</div>
          <div className="item__content">
            <div style={{ marginBottom: "16px" }}>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder="large size"
                  prefix={<PrivacyStatusIcon isPublic={privacyIsPublicValue} />}
                  value={publicURL}
                  readOnly
                />
                <Tooltip title="Copy url">
                  <Button
                    onClick={() => { handleCopy(publicURL) }}
                    icon={<CopyOutlined/>}
                  />
                </Tooltip>
              </Space.Compact>
            </div>
            
            <div>
              <Row>
                <Col xs={24} sm={10}>
                  <span style={{ marginRight: "12px", lineHeight: "32px", fontWeight: "500" }}>View Passcode</span>
                  <Switch
                    onChange={onPrivacyIsPassSwitchChange}
                    checked={privacyIsPassValue}
                    disabled={!privacyIsPublicValue}
                  />
                </Col>
                <Col xs={24} sm={14}>
                  {
                    privacyIsPassValue && (
                      <Input.Password
                        id="privacyPassCodeInput"
                        value={privacyPassCodeValue}
                        onChange={onPrivacyPassCodeInputChange}
                        disabled={!privacyIsPublicValue}
                        type="number"
                        placeholder="Up to 6 digits passcode"
                        showCount
                        maxLength={6}
                      />
                    )
                  }
                </Col>
              </Row>
              
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SettingModal;