import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "antd/dist/reset.css";
import AppLayout from "layouts/AppLayout";
import Portal from "pages/portal";
import ProfilePage from "pages/profile";
import ViewPage from "pages/view";
import Error404Page from "pages/error/404";

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="" element={<Portal/>} />
            <Route path="profile" element={<ProfilePage/>} />
            <Route path="view/:uid" element={<ViewPage/>} />
            
            <Route path="error/404" element={<Error404Page/>} />
            <Route path="*" element={<Error404Page/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
