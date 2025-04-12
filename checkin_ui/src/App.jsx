import './App.css'
import LoginPage from "./pages/auth/LoginPage.jsx";
import Error404 from "./pages/errors/404.jsx";
import ForgotIdOrPwPage from "./pages/auth/ForgotIdOrPwPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import {Route, Routes} from "react-router-dom";
import ProfilePage from "./pages/ProfilePage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import NewPage from "./pages/NewPage.jsx";
import Error500 from "./pages/errors/500.jsx";
import Error401 from "./pages/errors/401.jsx";
import Error403 from "./pages/errors/403.jsx";
import React from "react";
import {AuthProvider} from "./hooks/useAuth.jsx";
import AdditionalInfoPage from './pages/auth/AdditionalInfoPage';

function App() {

  return (
      <>
          <AuthProvider>
                <Routes>
                    <Route path={'/'} element={<LoginPage/>} />
                    <Route path={'/login'} element={<LoginPage/>} />
                    <Route path={'/forgot'} element={<ForgotIdOrPwPage/>} />
                    <Route path={'/register'} element={<RegisterPage/>} />
                    <Route path={'/additional-info'} element={<AdditionalInfoPage/>} />

                    <Route path={'/main'} element={<MainPage/>} />
                    <Route path={'/history'} element={<HistoryPage/>} />
                    <Route path={'/new'} element={<NewPage/>} />
                    <Route path={'/profile'} element={<ProfilePage/>} />

                    {/* Error Pages */}
                    <Route path={'/error/500'} element={<Error500/>} />
                    <Route path={'/error/401'} element={<Error401/>} />
                    <Route path={'/error/403'} element={<Error403/>} />

                    {/* Not Found Page - Must be the last route */}
                    <Route path={'*'} element={<Error404/>} />
                </Routes>
              </AuthProvider>
      </>
  )
}

export default App
