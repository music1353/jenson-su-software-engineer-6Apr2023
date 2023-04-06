import React from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { Form, Input, Button, message } from "antd";
import v1Api from "apis/v1";

interface Props {
  onSuccess: () => void
}

interface FormType {
  passCode: string;
}

const PassBody: React.FC<Props> = ({ onSuccess }) => {
  const { uid } = useParams();
  const [form] = Form.useForm<FormType>();

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      await v1Api.profile.pass({
        ...values,
        uid
      });

      onSuccess();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          message.error("Pass failed. Please check the passcode is correct");
        }
      } else {
        message.error("Pass failed. It seems that some errors have occurred");
        console.error(error);
      }
    }
  }

  return (
    <article className="page-passcode">
      <div className="__wrapper">
        <div className="passcode__title">Please enter the passcode</div>
        <div className="passcode__body">
          <Form
            form={form}
            autoComplete="off"
          >
            <Form.Item
              name="passCode"
              rules={[
                {
                  required: true,
                  message: "Please input the passcode",
                }
              ]}
              style={{ marginBottom: "0" }}
            >
              <Input
                type="number"
                size="large"
              />
            </Form.Item>
          </Form>
          
          <Button
            onClick={onSubmit}
            size="large"
            type="primary"
          >Go</Button>
        </div>
      </div>
    </article>
  )
}

export default PassBody;