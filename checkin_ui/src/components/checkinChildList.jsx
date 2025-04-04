import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FaCheckCircle, FaQrcode } from 'react-icons/fa';
import '../assets/styles/components/CheckinChildList.css';

const CheckinChildList = forwardRef(({ onSelectChild }, ref) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  // 외부에서 호출할 수 있는 메소드 노출
  useImperativeHandle(ref, () => ({
    updateCheckedInStatus: (childId) => {
      setChildren(children.map(child => 
        child.id === childId 
          ? { ...child, checkedIn: true } 
          : child
      ));
    }
  }));

  // 위치 목록 가져오기 (실제 구현 시 API 호출로 변경)
  useEffect(() => {
    // 예시 데이터
    setLocations([
      { id: 1, name: '강남 센터' },
      { id: 2, name: '송파 센터' },
      { id: 3, name: '서초 센터' }
    ]);
  }, []);

  // 위치가 선택되면 해당 위치의 아이들 목록 가져오기
  useEffect(() => {
    if (selectedLocation) {
      setLoading(true);
      // 실제 구현 시 API 호출로 변경
      // 예시: fetchChildrenByLocation(selectedLocation)
      setTimeout(() => {
        // 예시 데이터
        setChildren([
          { id: 1, name: '김민준', checkedIn: false },
          { id: 2, name: '이서연', checkedIn: false },
          { id: 3, name: '박지우', checkedIn: false },
          { id: 4, name: '최예은', checkedIn: false }
        ]);
        setLoading(false);
      }, 500);
    } else {
      setChildren([]);
    }
  }, [selectedLocation]);

  // 위치 선택 핸들러
  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  // 체크인 버튼 클릭 핸들러
  const handleCheckInClick = (child) => {
    if (!child.checkedIn) {
      console.log('체크인 버튼 클릭됨:', child);
      onSelectChild(child);
    }
  };

  return (
    <div className="checkin-child-list">
      <div className="location-selector">
        <label htmlFor="location">위치 선택:</label>
        <select 
          id="location" 
          value={selectedLocation} 
          onChange={handleLocationChange}
          className="location-select"
        >
          <option value="">위치를 선택하세요</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : selectedLocation ? (
        <div className="children-list">
          <h3>아이들 목록</h3>
          {children.length > 0 ? (
            <ul>
              {children.map(child => (
                <li key={child.id} className="child-item">
                  <span className="child-name">{child.name}</span>
                  <button 
                    className={`checkin-button ${child.checkedIn ? 'checked' : ''}`}
                    onClick={() => handleCheckInClick(child)}
                    disabled={child.checkedIn}
                  >
                    {child.checkedIn ? (
                      <>
                        <FaCheckCircle /> 완료
                      </>
                    ) : (
                      <>
                        <FaQrcode /> Check In
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>이 위치에 등록된 아이가 없습니다.</p>
          )}
        </div>
      ) : (
        <div className="no-location">
          <p>위치를 선택하면 아이들 목록이 표시됩니다.</p>
        </div>
      )}
    </div>
  );
});

export default CheckinChildList; 