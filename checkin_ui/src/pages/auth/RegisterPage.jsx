import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/forms/RegisterForm.jsx';
import '../../assets/styles/pages/RegisterPage.css';
import EmailConfirmationForm from "../../components/forms/EmailConfirmationForm.jsx";

const RegisterPage = () => {
  return (
        <RegisterForm />
      /*<EmailConfirmationForm/>*/
  );
};

export default RegisterPage;
