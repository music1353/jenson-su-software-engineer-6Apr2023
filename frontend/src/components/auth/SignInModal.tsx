import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "store/slices/auth";
import { Modal, Button, Form, Input, message } from "antd";
import v1Api from "apis/v1";

interface Props {
  visible: boolean;
  onCancel: () => void;
}

interface FormType {
  identifier: string;
  credential: string;
}

const SignUpModal: React.FC<Props> = ({ visible, onCancel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm<FormType>();
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  }

  const onSubmit = async () => {
    setLoading(true);
    
    try {
      const values = await form.validateFields();
      
      const response = await v1Api.auth.login(values);
      dispatch(authActions.login(response?.data.data));

      message.success(`Hi, ${response?.data.data.username}. Welcome back to Spotlight!`);
      handleCancel();
      navigate("/profile");
    } catch (error) {
      console.error(error);
      message.error("Sign in failed. Please check your email and password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      className="auth-modal"
      footer={null}
    >
      <div className="modal-header">
        <div className="header__title">Sign In</div>
        <div className="header__text">Sign in with your email here.</div>
      </div>

      <div className="modal-body">
        <Form
          className="body-form"
          form={form}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="identifier"
            rules={[
              {
                type: "email",
                message: "The input is not valid Email",
              },
              {
                required: true,
                message: "Please input your Email",
              },
            ]}
          >
            <Input
              placeholder="Email"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="credential"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password
              placeholder="Password"
              disabled={loading}
            />
          </Form.Item>
        </Form>
        
        <Button
          onClick={onSubmit}
          loading={loading}
          className="body__btn"
          type="primary"
        >
          Sign in
        </Button>
      </div>

      <div className="modal-footer">
        By continuing, you agree to our <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a>.<br />
        Read our <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>.
      </div>
    </Modal>
  )
}

export default SignUpModal;