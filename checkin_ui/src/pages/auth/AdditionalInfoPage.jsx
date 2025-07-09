import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/pages/auth/AdditionalInfoPage.css';
import AuthService from '../../services/AuthService';
import { useAuth } from '../../hooks/useAuth.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { additionalInfoSchema } from '../../validations/validations';
import { toast } from 'react-hot-toast';
import Toast from '../../components/common/Toast.jsx';
import RegisterCompleted from '../../components/forms/RegisterCompleted.jsx';

const AdditionalInfoPage = () => {
  const nav = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [registeredName, setRegisteredName] = useState('');

  useEffect(() => {
    // 이미 완전히 등록된 사용자는 메인 페이지로 리다이렉트
    if (isAuthenticated && !user.isTemporary) {
      nav('/main');
    }
  }, [isAuthenticated, user, nav]);

  const initialValues = {
    engName: '',
    korName: '',
    phone: '',
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setSubmitting(true);
      const response = await AuthService.updateAdditionalInfo({
        engName: values.engName,
        korName: values.korName,
        phone: values.phone,
      });

      if (response.data.success) {
        await AuthService.getCurrentSession();
        setRegisteredName(values.engName);
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach(field => {
          // Convert backend field names to frontend field names if needed
          const frontendField =
            field === 'eng_name'
              ? 'engName'
              : field === 'kor_name'
                ? 'korName'
                : field === 'phone'
                  ? 'phone'
                  : field;
          setFieldError(frontendField, backendErrors[field]);
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isCompleted) {
    return <RegisterCompleted engName={registeredName} />;
  }

  return (
    <div className="additional-info-container">
      <Toast />
      <div className="additional-info-card">
        <div className="card-header">
          <h2>Additional Information</h2>
          <p>Please provide your information to complete registration</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={additionalInfoSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="engName">
                  English Name <span className="required">*</span>
                </label>
                <Field
                  type="text"
                  id="engName"
                  name="engName"
                  placeholder="Enter your English name"
                  className={`form-input ${errors.engName && touched.engName ? 'error' : ''}`}
                />
                <ErrorMessage name="engName" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="korName">Korean Name (Optional)</label>
                <Field
                  type="text"
                  id="korName"
                  name="korName"
                  placeholder="Enter your Korean name"
                  className={`form-input ${errors.korName && touched.korName ? 'error' : ''}`}
                />
                <ErrorMessage name="korName" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <Field
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  className={`form-input ${errors.phone && touched.phone ? 'error' : ''}`}
                />
                <ErrorMessage name="phone" component="div" className="error-text" />
              </div>

              <button type="submit" className="register-button" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AdditionalInfoPage;
