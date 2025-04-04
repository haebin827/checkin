import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import '../../assets/styles/pages/RegisterPage.css';
import EmailConfirmationPage from "../../components/auth/EmailConfirmationPage.jsx";

const RegisterPage = () => {
  return (
        <RegisterForm />
      /*<EmailConfirmationPage/>*/
  );
};

export default RegisterPage;
