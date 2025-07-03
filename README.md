# Check-In Service

A modern web application for managing child check-ins at educational facilities. Built with React and Node.js.

## Features

### Authentication & User Management
- Multi-role user system (Admin, Staff, Guardian)
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
- Child registration and profile management
- Guardian assignment
- Check-in history tracking
- Email notifications for guardians

## Tech Stack

### Frontend
| Category | Technologies |
|----------|-------------|
| Core | React 19 |
| Routing | React Router v6 |
| Network | Axios |
| UI/UX | React Icons, React Hot Toast |
| Forms | Formik, Yup |
| QR Scanning | HTML5-QRCode |

### Backend
| Category | Technologies |
|----------|-------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL |
| ORM | Sequelize |
| Authentication | JWT, Passport.js |
| QR Code | QRCode |
| Email | Nodemailer |

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
- Set up necessary environment variables (database, JWT secret, social login credentials)

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

## Security Features
- Session-based authentication
- Rate limiting for login attempts
- Secure password hashing
- CORS protection
- HTTP-only cookies
- Input validation and sanitization

## Data Migrations
### Run each seed file in order:
```bash
npx sequelize-cli db:seed --seed 20250626220647-demo-location.js
npx sequelize-cli db:seed --seed 20250626220226-demo-user.js
npx sequelize-cli db:seed --seed 20250626220855-demo-child.js
npx sequelize-cli db:seed --seed 20250626221248-demo-userChild.js
```
