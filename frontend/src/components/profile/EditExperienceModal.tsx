import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Checkbox, Row, Col, message } from "antd";
import { Rule } from 'rc-field-form/lib/interface';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';
import { RootState } from "store";
import { profileActions } from "store/slices/profile";
import { offlineQueueActions, ActionNameTypes, ActionType } from "store/slices/offlineQueue";
import type { ExperienceType, ExperienceCreateType } from "types/experience";
import { OnlineContext } from "contexts/onlineContext";
import v1Api from "apis/v1";
import DateUtil from "utils/DataUtil";


interface Props {
  visible: boolean;
  mode: "add" | "update";
  initialData?: ExperienceType;
  onCancel: () => void;
}

const EditExperienceModal: React.FC<Props> = ({ visible, mode, initialData, onCancel }) => {
  const isOnline = React.useContext(OnlineContext);

  const { id } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm<ExperienceType | undefined>();
  
  const watchFields = ["startYear", "startMonth", "endYear", "endMonth"];
  const handleSelectChange = () => {
    form.validateFields(watchFields);
  };
  
  useEffect(() => {
    if (mode === "update") {
      form.setFieldsValue(initialData);

      if (initialData?.isPresent) {
        setIsPresentCheckboxDisabled(true);
      }
    } else {
      form.setFieldsValue(undefined);
    }
  }, [mode, initialData]);
  

  /* Modal */
  const handleCancel = () => {
    form.resetFields();
    setIsPresentCheckboxDisabled(false);
    onCancel();
  }

  /* Is Present Checkbox */
  const [isPesentCheckboxDisabled, setIsPresentCheckboxDisabled] = useState<boolean>(false);
  const onIsPresentChange = (e: CheckboxChangeEvent) => {
    switch (e.target.checked) {
      case true:
        form.setFieldsValue({ endMonth: "", endYear: "" });
        setIsPresentCheckboxDisabled(true);
        break;
      case false:
        setIsPresentCheckboxDisabled(false);
        break;
      default:
    }
  }

  /* Submit */
  const onSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      console.error(error);
      return
    }

    setLoading(true);

    if (mode === "add" && values) {
      try {
        const data: ExperienceCreateType = {
          ...values,
          profileId: id
        }

        if (isOnline) {
          const response = await v1Api.experience.insertOne(data);

          dispatch(profileActions.addExperience(response?.data.data));
          message.success("Add experience success");
        } else {
          const temperoryData: ExperienceCreateType = {
            ...data,
            id: `temporary-${uuidv4()}`
          }
          dispatch(profileActions.addExperience(temperoryData));
          
          const action: ActionType = {
            name: ActionNameTypes.ADD_EXPERIENCE,
            data: data
          }
          dispatch(offlineQueueActions.push(action));
        }
        
        handleCancel();
      } catch (error) {
        console.error(error);
        message.error("Add experience failed. Please try it again later");
      } finally {
        setLoading(false);
      }
    }
    else if (mode === "update" && values && initialData) {
      try {
        const updatedData = {
          ...values,
          id: initialData.id
        }
        dispatch(profileActions.updateExperience({
          ...updatedData,
          logo: initialData.logo
        }));

        if (isOnline) {
          v1Api.experience.updateOne(updatedData.id, updatedData);
          message.success("Update experience success");
        } else {
          const action: ActionType = {
            name: ActionNameTypes.UPDATE_EXPERIENCE_INFO,
            data: updatedData
          }
          dispatch(offlineQueueActions.push(action));
        }
        
        handleCancel();
      } catch (error) {
        console.error(error);
        message.error("Update experience failed. Please try it again later");
      } finally {
        setLoading(false);
      }
    }
  }
  
  /* Rule Validator */
  const validateEndDateOrPresentValue: Rule = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!(getFieldValue("endYear") && getFieldValue("endMonth")) && !getFieldValue("isPresent")) {
        return Promise.reject("Please provide an end date or select Present.");
      }
      return Promise.resolve();
    }
  });

  const validateStartDate: Rule = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!getFieldValue("startYear") || !getFieldValue("startMonth")) return Promise.resolve();

      const now = dayjs();
      const startDate = dayjs(`${getFieldValue("startYear")}-${getFieldValue("startMonth")}-01`);
      
      if (startDate.isAfter(now)) {
        return Promise.reject("Start date cannot be later than today's date");
      }

      return Promise.resolve();
    }
  });

  const validateEndDate: Rule = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!getFieldValue("endYear") || !getFieldValue("endMonth")) return Promise.resolve();

      const now = dayjs();
      const endDate = dayjs(`${getFieldValue("endYear")}-${getFieldValue("endMonth")}-01`);
      
      if (endDate.isAfter(now)) {
        return Promise.reject("End date cannot be later than today's date");
      }

      return Promise.resolve();
    }
  });

  const validateDateRange: Rule = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!getFieldValue("endYear") || !getFieldValue("endMonth")) return Promise.resolve();

      const startDate = dayjs(`${getFieldValue("startYear")}-${getFieldValue("startMonth")}-01`);
      const endDate = dayjs(`${getFieldValue("endYear")}-${getFieldValue("endMonth")}-01`);
      
      if (endDate.isValid() && startDate.isAfter(endDate)) {
        return Promise.reject("End date must be after start date");
      }

      return Promise.resolve();
    }
  });

  
  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      onOk={onSubmit}
      confirmLoading={loading}
      forceRender
      title="Add work experience"
      okText="Confirm"
    >
      <Form
        form={form}
        className="form--dense"
        layout="vertical"
        style={{ padding: "12px 0 20px 0" }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="company"
              label="Company"
              rules={[
                {
                  required: true,
                  message: "Please input your Company Name",
                },
              ]}
            >
              <Input
                disabled={loading}
                size="large"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="title"
              label="Title"
              rules={[
                {
                  required: true,
                  message: "Please input your Job Title",
                },
              ]}
            >
              <Input
                disabled={loading}
                size="large"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
            >
              <Input.TextArea
                rows={2}
                showCount
                maxLength={130}
                disabled={loading}
                size="large"
                style={{ resize: 'none' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="startMonth"
              label="Start Month"
              rules={[
                {
                  required: true,
                  message: "Please input the Start Month",
                },
                validateStartDate
              ]}
            >
              <Select
                options={DateUtil.getMonthOptions()}
                onChange={handleSelectChange}
                disabled={loading}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="startYear"
              label="Start Year"
              rules={[
                {
                  required: true,
                  message: "Please input the Start Year",
                },
                validateDateRange
              ]}
            >
              <Select
                options={DateUtil.getYearOptions()}
                onChange={handleSelectChange}
                disabled={loading}
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="endMonth"
              label="End Month"
              rules={[
                validateEndDate
              ]}
            >
              <Select
                options={DateUtil.getMonthOptions()}
                onChange={handleSelectChange}
                disabled={isPesentCheckboxDisabled || loading}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="endYear"
              label="End Year"
              rules={[
                validateDateRange
              ]}
            >
              <Select
                options={DateUtil.getYearOptions()}
                onChange={handleSelectChange}
                disabled={isPesentCheckboxDisabled || loading}
                size="large"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="isPresent"
              valuePropName="checked"
              rules={[
                validateEndDateOrPresentValue
              ]}
            >
              <Checkbox
                onChange={onIsPresentChange}
                disabled={loading}
              >I'm currently working in this company</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default EditExperienceModal;