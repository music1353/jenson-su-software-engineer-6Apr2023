import React from "react";
import { GlobalOutlined, LockOutlined } from "@ant-design/icons";

interface PrivacyStatusIconProps {
  isPublic: boolean;
}

const PrivacyStatusIcon: React.FC<PrivacyStatusIconProps> = ({ isPublic }) => {
  return (
    isPublic ? <GlobalOutlined /> : <LockOutlined />
  )
}

export default PrivacyStatusIcon;