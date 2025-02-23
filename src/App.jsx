import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Upload } from "./pages"
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/upload" element={<Upload/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
