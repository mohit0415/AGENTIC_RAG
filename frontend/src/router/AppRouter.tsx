import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "../pages/ChatPage";
import SQLToolPage from "../pages/SQLToolPage";
import VectorToolPage from "../pages/VectorToolPage";

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/"        element={<ChatPage />} />
      <Route path="/sql"     element={<SQLToolPage />} />
      <Route path="/vector"  element={<VectorToolPage />} />
      <Route path="*"        element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
