import * as Yup from 'yup';

export const userSchema = Yup.object({
  engName: Yup.string()
    .required('English Name is required.')
    .matches(/^[A-Za-z\s]+$/, 'Must contain only English letters'),
  username: Yup.string().required('Username is required.'),
  password: Yup.string().required('Password is required.'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], "Password doesn't match"),
  email: Yup.string().required('Email is required.'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Must be exactly 10 digits.')
    .required('Phone is required.'),
});

export const locationSchema = Yup.object({
  name: Yup.string().required('Name is required.'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Must be exactly 10 digits.')
    .required('Phone is required.'),
  streetAddress: Yup.string().required('Street address is required.'),
  city: Yup.string().required('City is required.'),
  state: Yup.string().required('State is required.'),
  postalCode: Yup.string()
    .matches(/^\d{5}$/, 'Must contain 5 digits only.')
    .required('Postal code is required.'),
});

export const childSchema = Yup.object({
  engName: Yup.string()
    .required('English Name is required.')
    .matches(/^[A-Za-z\s]+$/, 'Must contain only English letters'),
  korName: Yup.string()
    .matches(/^[가-힣\s]+$/, 'Must contain only Korean characters')
    .notRequired(),
  birth: Yup.date()
    .required('Birthday is required.')
    .max(new Date(), 'Birthday cannot be in the future'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Must be exactly 10 digits.')
    .notRequired(),
  locationId: Yup.string().required('Please select a location.'),
});

export const childEditSchema = Yup.object({
  engName: Yup.string()
    .required('English Name is required.')
    .matches(/^[A-Za-z\s]+$/, 'Must contain only English letters'),
  korName: Yup.string()
    .matches(/^[가-힣\s]*$/, 'Must contain only Korean characters')
    .notRequired(),
  birth: Yup.date()
    .required('Birthday is required.')
    .max(new Date(), 'Birthday cannot be in the future'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Must be exactly 10 digits.')
    .notRequired(),
});

export const profileEditSchema = Yup.object({
  engName: Yup.string()
    .required('English Name is required.')
    .matches(/^[A-Za-z\s]+$/, 'Must contain only English letters'),
  username: Yup.string().required('Username is required.'),
  korName: Yup.string()
    .matches(/^[가-힣\s]*$/, 'Must contain only Korean characters')
    .notRequired(),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Must be exactly 10 digits.')
    .required('Phone is required.'),
  email: Yup.string().email('Invalid email format').required('Email is required.'),
});

export const additionalInfoSchema = Yup.object({
  engName: Yup.string()
    .required('English Name is required.')
    .matches(/^[A-Za-z\s]+$/, 'Must contain only English letters'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Must be exactly 10 digits.')
    .required('Phone is required.'),
});
