import React from "react";
import { Home } from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { File } from "./pages/File";

const App = () => {
  return (
    <Router>
      <h1>File Renderer</h1>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/file/:fileId' element={<File />} />
      </Routes>
    </Router>
  );
};

export default App;
