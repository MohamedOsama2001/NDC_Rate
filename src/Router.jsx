import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UploadPage, { CuRaFilter, Login, Refund } from "./pages";
function AppRouter() {
  useEffect(() => {
    document.body.classList.add("bg-gray-200");

    return () => {
      document.body.classList.remove("bg-gray-200");
    };
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/current" element={<CuRaFilter />} />
        <Route path="/refund" element={<Refund />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;
