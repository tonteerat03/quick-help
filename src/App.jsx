import { useState } from "react";
import "./App.css";
import Feeds from "./pages/feeds";
import Home from "./pages/home";
import Login from "./pages/login";
import ManualDetail from "./pages/manualdetail";
import Dashboard from "./pages/dashboard";
import ProfileSettings from "./pages/profilesettings";
import CreateManual from "./pages/createmanual";
import EditManual from "./pages/editmanual";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/applayout";
import Feedback from "react-bootstrap/esm/Feedback";

const ForwardToHome = () => {
  return <Navigate to="/home" />;
};

function App() {
  return (
    <>
      <BrowserRouter basename="/quick-help/">
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="feeds" element={<Feeds />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="login" element={<Login />} />
            <Route path="manual/:id" element={<ManualDetail />} />
            <Route path="create-manual" element={<CreateManual />} />
            <Route path="edit-manual/:id" element={<EditManual />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="*" element={<ForwardToHome />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
