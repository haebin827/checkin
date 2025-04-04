import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../assets/styles/pages/MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <Navbar />
      <main className="main-content">
        {/* 메인 컨텐츠 영역 */}
        <div className="content-container">
          <h1>체크인 서비스에 오신 것을 환영합니다</h1>
          <p>이곳에 주요 컨텐츠 컴포넌트들이 배치됩니다.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainPage; 