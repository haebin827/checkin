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
      { id: 1, name: 'Suwanee Center' },
      { id: 2, name: 'Duluth Center' },
      { id: 3, name: 'Buford Center' }
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
          { id: 1, name: 'Haebin Noh', checkedIn: false },
          { id: 2, name: 'Jaeyull Noh', checkedIn: false },
          { id: 3, name: 'test name', checkedIn: false },
          { id: 4, name: 'test name2', checkedIn: false }
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
        <label htmlFor="location">Select location:</label>
        <select 
          id="location" 
          value={selectedLocation} 
          onChange={handleLocationChange}
          className="location-select"
        >
          <option value="">--- Select ---</option>
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
          <h3>List of children</h3>
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
            <p>No children registered at this location.</p>
          )}
        </div>
      ) : (
        <div className="no-location">
          <p>Select a location to view children.</p>
        </div>
      )}
    </div>
  );
});

export default CheckinChildList; 