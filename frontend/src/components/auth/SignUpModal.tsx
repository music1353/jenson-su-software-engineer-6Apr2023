import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import { authActions } from 'store/slices/auth';
import { Modal, Button, Form, Input, message } from 'antd';
import type { AuthType } from 'types/auth';
import v1Api from "apis/v1";

interface Props {
  visible: boolean;
  onCancel: () => void;
}

interface FormType {
  identifier: string;
  credential: string;
  username: string;
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

      await v1Api.auth.register(values);

      const response = await v1Api.auth.login(values);
      const responseData: AuthType = response?.data.data;
      dispatch(authActions.login(responseData));
      
      message.success(`Hi, ${responseData.username}. Welcome to Spotlight!`);
      handleCancel();
      navigate('/profile');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          message.error(error.response.data.message);
        }
      } else {
        message.error('It seems that some errors have occurred.');
        console.error(error);
      }
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
        <div className="header__title">Sign Up</div>
        <div className="header__text">Creat an account with your email.</div>
      </div>

      <div className="modal-body">
        <Form
          className='body-form'
          form={form}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="identifier"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid Email',
              },
              {
                required: true,
                message: 'Please input your Email',
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
            rules={[{ required: true, message: 'Please input your password' }]}
          >
            <Input.Password
              placeholder="Password"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username', whitespace: true }]}
          >
            <Input
              placeholder="Username"
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
          Create account
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