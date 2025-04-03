import './App.css'
import LoginPage from "./pages/LoginPage.jsx";
import {Route, Routes} from "react-router-dom";

function App() {

  return (
    <Routes>
        <Route path={'/'} element={<LoginPage/>} />
    </Routes>
  )
}

export default App
