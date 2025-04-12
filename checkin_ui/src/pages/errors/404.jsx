import { Link } from 'react-router-dom';
import '../../assets/styles/pages/NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-card">
                <div className="notfound-header">
                    <div className="notfound-icon">404</div>
                    <h1>Page Not Found</h1>
                    <p>Oops! The page you are looking for doesn't exist.</p>
                </div>
                
                <div className="notfound-message">
                    <p>The page might have been moved, deleted, or never existed.</p>
                    <p>Please check the URL or return to the homepage.</p>
                </div>
                
                <Link to="/" className="return-button">
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
