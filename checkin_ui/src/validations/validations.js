import * as Yup from 'yup';

export const userSchema = Yup.object({
    engName: Yup.string()
        .required('English Name: This field is required.')
        .matches(/^[A-Za-z\s]+$/, 'English Name: Must contain only English letters'),
    username: Yup.string()
        .required('Username: Username is required.'),
    password: Yup.string()
        .required('Password: Password is required.'),
    confirmPassword: Yup.string()
        .required('Confirm password: Password is required')
        .oneOf([Yup.ref('password')], 'Password doesn\'t match'),
    email: Yup.string()
        .required('Email: Email is required.'),
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone: Must be exactly 10 digits.')
        .required('Phone: Phone is required.'),
});

export const locationSchema = Yup.object({
    name: Yup.string()
        .required('Name: Name is required.'),
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone: Must be exactly 10 digits.')
        .required('Phone: Phone is required.'),
    streetAddress: Yup.string()
        .required('Street address: Street address is required.'),
    city: Yup.string()
        .required('City: City is required.'),
    state: Yup.string()
        .required('State: State is required.'),
    postalCode: Yup.string()
        .matches(/^\d+$/, 'Postal code: Must contain digits only.')
        .required('Postal code: Postal code is required.'),
});

export const childSchema = Yup.object({
    engName: Yup.string()
        .required('English Name: This field is required.')
        .matches(/^[A-Za-z\s]+$/, 'English Name: Must contain only English letters'),
    korName: Yup.string()
        .matches(/^[가-힣\s]+$/, 'Korean Name: Must contain only Korean characters')
        .notRequired(),
    birth: Yup.date()
        .required('Birthday: This field is required.')
        .max(new Date(), 'Birthday cannot be in the future'),
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone: Must be exactly 10 digits.')
        .notRequired(),
    locationId: Yup.string()
        .required('Location: Please select a location.')
});

export const profileEditSchema = Yup.object({
    engName: Yup.string()
        .required('English Name: This field is required.')
        .matches(/^[A-Za-z\s]+$/, 'English Name: Must contain only English letters'),
    username: Yup.string()
        .required('Username: Username is required.'),
    korName: Yup.string()
        .matches(/^[가-힣\s]*$/, 'Korean Name: Must contain only Korean characters')
        .notRequired(),
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone: Must be exactly 10 digits.')
        .required('Phone: Phone is required.'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email: Email is required.')
});

export const additionalInfoSchema = Yup.object({
    engName: Yup.string()
        .required('English Name: This field is required.')
        .matches(/^[A-Za-z\s]+$/, 'English Name: Must contain only English letters'),
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone: Must be exactly 10 digits.')
        .required('Phone: Phone is required.'),
});
