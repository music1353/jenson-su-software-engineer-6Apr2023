import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import type { BasicInfoType } from "types/profile";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { profileActions } from "store/slices/profile";
import { offlineQueueActions, ActionNameTypes, ActionType } from "store/slices/offlineQueue";
import { OnlineContext } from "contexts/onlineContext";
import v1Api from "apis/v1";

interface Props {
  visible: boolean;
  onCancel: () => void;
}

const BasicInfoEditModal: React.FC<Props> = ({ visible, onCancel }) => {
  const isOnline = React.useContext(OnlineContext);

  const { id, name, age, description } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm<BasicInfoType>();
  const initialValues: Partial<BasicInfoType> = {
    name: name,
    age: age,
    description: description
  }
  
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  }

  const onSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      console.error(error);
      return
    }

    setLoading(true);

    if (values) {
      try {
        dispatch(profileActions.updateData(values));
        
        if (isOnline) {
          await v1Api.profile.updateOne(id, values);
          message.success("Update basic info success");
        } else {
          const action: ActionType = {
            name: ActionNameTypes.UPDATE_BASIC_INFO,
            data: {
              ...values,
              id
            }
          }
          dispatch(offlineQueueActions.push(action));
        }
        
        handleCancel();
      } catch (error) {
        console.error(error);
        message.error("Update basic info failed. Please try it again later");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      onOk={onSubmit}
      confirmLoading={loading}
      title="Edit your basic Info"
      okText="Confirm"
    >
      <Form
        form={form}
        initialValues={initialValues}
        className="form--dense"
        layout="vertical"
        style={{ padding: "12px 0 20px 0" }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input your Name",
            },
          ]}
        >
          <Input
            disabled={loading}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="age"
          label="Age"
          rules={[
            {
              required: true,
              message: "Please input your Age",
            },
            {
              type: "number",
              min: 1, max: 99
            }
          ]}
        >
          <InputNumber
            disabled={loading}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Brief introduction"
          rules={[
            {
              required: true,
              message: "Please input your brief introduction",
            }
          ]}
        >
          <Input
            disabled={loading}
            size="large"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BasicInfoEditModal;