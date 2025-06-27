import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/forms/RegisterForm.jsx';
import '../../assets/styles/pages/RegisterPage.css';
import EmailConfirmationForm from "../../components/forms/EmailConfirmationForm.jsx";

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

    const handleRegistrationSuccess = (values) => {
        console.log(values)
        setUserData(values);
        setIsValidated(true);
    };

    return (
        <>
            {!isValidated ? (
                <RegisterForm
                    initialValues={userData}
                    handleRegistrationSuccess={handleRegistrationSuccess}
                />
            ) : (
                <EmailConfirmationForm
                    user={userData}
                />
            )}
            );
        </>
    );
};

export default RegisterPage;
