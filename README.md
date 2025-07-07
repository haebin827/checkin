# Check-In Service

A modern web application for managing child check-ins at educational facilities. Built with React and Node.js.

---

### Project Overview

The Check-In Service is designed to enhance child safety and security in educational facilities. In an era where child protection is paramount, this system provides a robust, digital solution to prevent unauthorized pick-ups and ensure children's safety from potential risks such as kidnapping or abduction.

### Key Safety Features
- Secure QR code-based verification system for authorized pick-ups
- Real-time notifications to guardians when their child is checked in/out
- Comprehensive tracking of all check-in/out activities

### Target Users
- Educational Facilities (Kindergartens, Schools, Academies)
- Parents and Legal Guardians
- Facility Administrators and Staff
- Child Safety Organizations

---

## Features

### Authentication & User Management
- Multi-role user system (Admin, Manager, Guardian)
- Social login support (Google, Kakao)
- Password recovery and account management

### Check-In System
- QR code-based check-in system
- Real-time check-in status updates
- Multiple camera support for QR scanning
- Instant notifications to guardians

### Location Management
- Multiple location support
- QR code generation for each location
- Location-specific check-in history

### Child Management
- Child registration and guardian assignment
- Check-in history tracking
- Email notifications for guardians

---

## Tech Stack

### Frontend
| Category | Technologies |
|----------|-------------|
| Core | React 19 |
| Build Tool | Vite |
| Routing | React Router v6 |
| Network | Axios |
| UI/UX | React Icons, React Hot Toast, React Toastify |
| Forms | Formik, Yup |
| QR Scanning | HTML5-QRCode |

### Backend
| Category | Technologies                           |
|----------|----------------------------------------|
| Runtime | Node.js                                |
| Framework | Express.js                             |
| Database | MySQL                                  |
| ORM | Sequelize                              |
| Authentication | Passport.js, JWT                       |
| Security | bcryptjs, helmet, express-rate-limit   |
| Session | express-session, express-mysql-session |
| Caching | node-cache                             |
| QR Code | QRCode                                 |
| Email | Nodemailer                             |
| Validation | express-validator                      |
| Development | nodemon                                |

---

## Getting Started

### Prerequisites
- Node.js
- MySQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install backend dependencies
```bash
cd checkin_api
npm install
```

3. Install frontend dependencies
```bash
cd checkin_ui
npm install
```

4. Configure environment variables
- Create `.env` files in both frontend and backend directories
- Set up necessary environment variables based on `.env.example`

5. Start the development servers

Backend:
```bash
cd checkin_api
npm run dev
```

Frontend:
```bash
cd checkin_ui
npm run dev
```

---

## Project Structure

### Frontend Structure
```
checkin_ui/
├── src/
│   ├── assets/         # Static assets and styles
│   ├── components/     # Reusable components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # API service layers
│   └── validations/   # Form validation schemas
```

### Backend Structure
```
checkin_api/
├── app/
│   ├── configs/       # Configuration files
│   ├── controllers/   # Request handlers
│   ├── middlewares/   # Custom middlewares
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   └── validations/   # Input validation
├── migrations/        # Database migrations
└── seeders/          # Database seeders
```

---

## Security Features
- Session-based authentication
- Rate limiting for login attempts
- Secure password hashing
- CORS protection
- Input validation and sanitization

---

## Data Migrations
Run each seed file in order:
```bash
npx sequelize-cli db:seed --seed 20250626220647-demo-location.js
npx sequelize-cli db:seed --seed 20250626220226-demo-user.js
npx sequelize-cli db:seed --seed 20250626220855-demo-child.js
npx sequelize-cli db:seed --seed 20250626221248-demo-userChild.js
```

---

## UX/UI Documentation (Updated on 07/05/2025)

### 1. Authentication & Registration
- **Login**
  - Landing page with login form
  ![Login Page](checkin_ui/src/assets/ui/auth/loginPage.png)
- **Registration Flow**
  - Initial registration form
  ![Registration Page](checkin_ui/src/assets/ui/auth/registerPage.png)
  - Form with validation
  ![Registration Validation](checkin_ui/src/assets/ui/auth/registerPage_validation.png)
  - Email verification
  ![Email Verification](checkin_ui/src/assets/ui/auth/registerPage_email_validation.png)
- **Account Recovery**
  - ID/Password recovery page
  ![Account Recovery](checkin_ui/src/assets/ui/auth/forgotIdPwPage.png)

### 2. Main Dashboard
- **User Dashboard**
  - Basic view
  ![User Dashboard](checkin_ui/src/assets/ui/mainPage_user.png)
  - With child information and SMS settings
  ![User Dashboard with Child Info](checkin_ui/src/assets/ui/mainPage_user_childInfo.png)
- **Manager Dashboard**
  - Basic view
  ![Manager Dashboard](checkin_ui/src/assets/ui/mainPage_manager.png)
  - With child information
  ![Manager Dashboard with Child Info](checkin_ui/src/assets/ui/mainPage_manager_childInfo.png)
  - Pull up QR code for each location (for user checkin)
  ![Location QR Code](checkin_ui/src/assets/ui/locationQr.png)
- **Admin Dashboard**
  - Overview page
  ![Admin Dashboard](checkin_ui/src/assets/ui/mainPage_admin.png)

### 3. Guardian Invitation System
- **Manager Interface**
  - Send invitation email
  ![Manager Invitation](checkin_ui/src/assets/ui/sendInviteEmail_manager.png)
- **Admin Interface**
  - Send invitation email with location selection
  ![Admin Invitation](checkin_ui/src/assets/ui/sendInviteEmail_admin.png)

### 4. Check-in System
- **User Check-in**
  - QR Scanner interface
  ![QR Scanner](checkin_ui/src/assets/ui/qrScanner.png)
  - Successful check-in confirmation
  ![Check-in Confirmation](checkin_ui/src/assets/ui/checkin_verified.png)
- **Manager/Admin Check-in**
  - Manual check-in interface
  ![Force Check-in](checkin_ui/src/assets/ui/forceCheckin.png)
- **Check-in notification to guardians**
- ![Check-in Notification](checkin_ui/src/assets/ui/checkin_notification.png)

### 5. Child Registration System
- **Manager Interface**
  - Basic registration form
  ![Manager Registration](checkin_ui/src/assets/ui/register/registerationPage_manager.png)
  - Form with validation
  ![Manager Registration Validation](checkin_ui/src/assets/ui/register/registrationPage_manager_validation.png)
- **Admin Interface**
  - Child registration
  ![Admin Child Registration](checkin_ui/src/assets/ui/register/registrationPage_admin_child.png)
  - Child registration with validation
  ![Admin Child Registration Validation](checkin_ui/src/assets/ui/register/registrationPage_admin_child_validation.png)
  - Location registration
  ![Admin Location Registration](checkin_ui/src/assets/ui/register/registrationPage_admin_location.png)
  - Location registration with validation
  ![Admin Location Registration Validation](checkin_ui/src/assets/ui/register/registrationPage_admin_location_validation.png)

### 6. History Tracking
- Universal history page (access levels vary by role)
  - User: Access to their children's records only
  - Manager: Access to facility children's records
  - Admin: Access to all records across locations
  ![History Page](checkin_ui/src/assets/ui/history/historyPage.png)

### 7. Profile Management
- **Role-specific Profile Pages**
  - User profile
  ![User Profile](checkin_ui/src/assets/ui/profile/profilePage_user.png)
  - Manager profile
  ![Manager Profile](checkin_ui/src/assets/ui/profile/profilePage_manager.png)
  - Admin profile
  ![Admin Profile](checkin_ui/src/assets/ui/profile/profilePage_admin.png)
- **Profile Actions**
  - Password change interface
  ![Change Password](checkin_ui/src/assets/ui/profile/changePassword.png)
  - Profile update interface
  ![Update Profile](checkin_ui/src/assets/ui/profile/updateProfile.png)