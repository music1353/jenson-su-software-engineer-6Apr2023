import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";

const PrivatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <article className="page-private">
      <Result
        icon={<LockOutlined />}
        title="Hey, this is a Private Profile"
        extra={<Button type="primary" onClick={() => { navigate("/") }}>Back Home</Button>}
      />
    </article>
  )
}

export default PrivatePage;