import React from "react";
import { Button, Result } from 'antd';
import { useNavigate } from "react-router-dom";

const Error404Page: React.FC = () => {
  const navigate = useNavigate();
  const toHomePage = () => {
    navigate("/");
  }

  return (
    <div className="error-page">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={toHomePage}>Back Home</Button>}
      />  
    </div>
  )
}

export default Error404Page;