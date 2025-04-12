import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaTimes } from 'react-icons/fa';
import '../../assets/styles/components/modals/InviteModal.css';

const InviteModal = ({ isOpen, onClose, onSend }) => {
  const [email, setEmail] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setSelectedChild('');
    }
  }, [isOpen]);

  // 아이 목록 가져오기 (예시 데이터)
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      
      // 실제 구현 시 API 호출로 변경
      setTimeout(() => {
        setChildren([
          { id: 1, name: 'Haebin Noh' },
          { id: 2, name: 'Jaeyull Noh' },
          { id: 3, name: 'Olivia Parker' },
          { id: 4, name: 'Ethan Smith' },
          { id: 5, name: 'Sophia Johnson' },
        ]);
        setIsLoading(false);
      }, 500);
    }
  }, [isOpen]);

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !selectedChild) {
      alert('Please fill in all required fields');
      return;
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // 부모 컴포넌트에 데이터 전달
    onSend({
      email,
      childId: selectedChild,
      childName: children.find(child => child.id === parseInt(selectedChild))?.name
    });
    
    // 모달 닫기
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="invite-modal">
        <div className="modal-header">
          <h2><FaEnvelope /> Send Child Invite Email</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Parent Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter parent's email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="child">Select Child</label>
            {isLoading ? (
              <div className="loading-indicator">Loading children...</div>
            ) : (
              <select 
                id="child" 
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                required
              >
                <option value="">-- Select a child --</option>
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="send-button"
            >
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal; 