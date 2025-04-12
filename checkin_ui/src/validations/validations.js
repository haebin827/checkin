import * as Yup from 'yup';

export const userSchema = Yup.object({
    name: Yup.string()
        .required('Name: Name is required.'),
    username: Yup.string()
        .required('Username: Username is required.'),
    password: Yup.string()
        .required('Password: Password is required.'),
    confirmPassword: Yup.string()
        .required('Confirm password: Password is required')
        .oneOf([Yup.ref('password')], 'Password doesn\'t match'),
    email: Yup.string()
        .required('Email: Email is required.')
});