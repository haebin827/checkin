import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/forms/RegisterForm.jsx';
import '../../assets/styles/pages/auth/RegisterPage.css';
import EmailConfirmationForm from "../../components/forms/EmailConfirmationForm.jsx";
import RegisterCompleted from "../../components/forms/RegisterCompleted.jsx";

const RegisterPage = () => {

    const [userData, setUserData] = useState({
        engName: "",
        korName: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        role: "guardian"
    });

    const [isValidated, setIsValidated] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleRegistrationSuccess = (values) => {
        setUserData(values);
        setIsValidated(true);
    };

    const handleRegistrationCompleted = () => {
        setIsCompleted(true);
    };

    return (
        <>
            {isCompleted ? (
                <RegisterCompleted engName={userData.engName} />
            ) : !isValidated ? (
                <RegisterForm
                    initialValues={userData}
                    handleRegistrationSuccess={handleRegistrationSuccess}
                />
            ) : (
                <EmailConfirmationForm
                    user={userData}
                    onRegistrationComplete={handleRegistrationCompleted}
                />
            )}
        </>
    );
};

export default RegisterPage;
