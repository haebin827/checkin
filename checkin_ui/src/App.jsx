import './App.css'
import LoginPage from "./pages/auth/LoginPage.jsx";
import NotFoundPage from "./pages/auth/NotFoundPage.jsx";
import ForgotIdOrPw from "./pages/auth/ForgotIdOrPw.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import {Route, Routes} from "react-router-dom";

function App() {

  return (
    <Routes>
        <Route path={'/'} element={<LoginPage/>} />
        <Route path={'/forgot'} element={<ForgotIdOrPw/>} />
        <Route path={'/register'} element={<RegisterPage/>} />
        <Route path={'/main'} element={<MainPage/>} />
        <Route path={'*'} element={<NotFoundPage/>} />
    </Routes>
  )
}

export default App
