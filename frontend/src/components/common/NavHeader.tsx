import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Col, Row, Button, Dropdown, message } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { authActions } from "store/slices/auth";
import v1Api from "apis/v1";
import AuthModal from "components/auth/AuthModal";
import SignUpModal from "components/auth/SignUpModal";
import SignInModal from "components/auth/SignInModal";

const UserGreetingComponent: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const logout = async () => {
    await v1Api.auth.logout();
    dispatch(authActions.logout());
    message.success("See ya");
    navigate("/");
  }

  const items: MenuProps["items"] = [
    {
      label: (
        <div onClick={() => { navigate("/profile") }}>My Profile</div>
      ),
      key: "0"
    },
    {
      label: (
        <div onClick={logout}>Logout</div>
      ),
      key: "1"
    }
  ];

  return (
    <nav>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button type="text" onClick={(e) => e.preventDefault()}>
          <span style={{ fontSize: "1rem", fontWeight: "500" }}>{user?.username}</span>
          <DownOutlined />
        </Button>
      </Dropdown> 
    </nav>
  )
}

const SignInComponent: React.FC = () => {
  type ModeType = "signup" | "signin";
  const [mode, setMode] = useState<ModeType>("signup");
  
  const [authModalVisible, setAuthModalVisible] = useState<boolean>(false);
  const onAuthModalCancel = () => {
    setAuthModalVisible(false);
  }

  const [signUpModalVisible, setSignUpModalVisible] = useState<boolean>(false);
  const onSignUpModalCancel = () => {
    setSignUpModalVisible(false);
  }

  const [signInModalVisible, setSignInModalVisible] = useState<boolean>(false);
  const onSignInModalCancel = () => {
    setSignInModalVisible(false);
  }

  const onSignInUpModalOpen = () => {
    setAuthModalVisible(false);

    if (mode === "signin") {
      setSignInModalVisible(true);
    }
    else if (mode === "signup") {
      setSignUpModalVisible(true);
    }
  }

  const handleSignIn = () => {
    setMode("signin");
    setAuthModalVisible(true);
  }
  const handleSinUp = () => {
    setMode("signup");
    setAuthModalVisible(true);
  }

  return (
    <nav>
      <Button
        onClick={handleSignIn}
        className="action__btn"
        type="text"
        size="large"
      >Sign in</Button>
      <Button
        onClick={handleSinUp}
        className="action__btn"
        type="primary"
        size="large"
      >Sign up</Button>

      <AuthModal
        visible={authModalVisible}
        mode={mode}
        onCancel={onAuthModalCancel}
        onSignInUpModalOpen={onSignInUpModalOpen}
      />
      <SignUpModal
        visible={signUpModalVisible}
        onCancel={onSignUpModalCancel}
      />
      <SignInModal
        visible={signInModalVisible}
        onCancel={onSignInModalCancel}
      />
    </nav>
  )
}


const NavHeader: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <header className="portal-navheader">
      <Row className="portal-navheader-wrapper">
        <Col className="header-logo" span={9}>
          <Link to="/">
            <img src={require("assets/images/logo/logo.png")} alt="logo-img" /> 
          </Link>
        </Col>
        <Col className="header-actions" span={15}>
          {
            isAuthenticated ? (
              <UserGreetingComponent />
            ) : (
              <SignInComponent />
            )
          }
        </Col>
      </Row>
    </header>
  )
}

export default NavHeader;