import React from 'react';
import { Modal, Button, message } from 'antd';

interface Props {
  visible: boolean;
  mode: "signin" | "signup";
  onCancel: () => void;
  onSignInUpModalOpen: () => void;
}

const AuthModal: React.FC<Props> = ({ visible, mode, onCancel, onSignInUpModalOpen }) => {
  const handleProviderGoogle = () => {
    message.info("Google sign-in is under development, stay tuned! Please continue with your email on Spotlight first");
  }

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      className="auth-modal"
      footer={null}
    >
      <div className="modal-header">
        <div className="header__title">
          { mode === "signin" ? "Sign In" : "Welcome!" }
        </div>
        <div className="header__text">Use your email our another service to continue with Spotlight.</div>
      </div>

      <div className="modal-body">
        <Button onClick={handleProviderGoogle} className="body__btn">
          <img
            className="btn-icon"
            src={require("assets/images/icons/google.png")}
            alt="google-icon"
          />
          Google
        </Button>
        <Button onClick={onSignInUpModalOpen} className="body__btn">
          Contiune with email
        </Button>
      </div>

      <div className="modal-footer">
        By continuing, you agree to our <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a>.<br />
        Read our <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>.
      </div>
    </Modal>
  )
}

export default AuthModal;