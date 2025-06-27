import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FaCheckCircle, FaQrcode, FaChevronDown, FaChevronUp, FaBirthdayCake, FaPhone, FaPrint } from 'react-icons/fa';
import '../assets/styles/components/CheckinChildList.css';
import {useAuth} from "../hooks/useAuth.jsx";

const CheckinChildList = forwardRef(({ onSelectChild }, ref) => {
  const {user} = useAuth();

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedChildId, setExpandedChildId] = useState(null);

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
        // 예시 데이터 - birth와 phone 정보 추가
        setChildren([
          { 
            id: 1, 
            name: 'Haebin Noh', 
            birth: '2016-05-12', 
            phone: '010-1234-5678',
            checkedIn: false 
          },
          { 
            id: 2, 
            name: 'Jaeyull Noh', 
            birth: '2018-08-25', 
            phone: '010-2345-6789',
            checkedIn: false 
          },
          { 
            id: 3, 
            name: 'test name', 
            birth: '2019-03-15', 
            phone: '010-3456-7890',
            checkedIn: false 
          },
          { 
            id: 4, 
            name: 'test name2', 
            birth: '2020-11-30', 
            phone: '010-4567-8901',
            checkedIn: false 
          }
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

  // 아이 이름 클릭 핸들러
  const handleChildNameClick = (childId) => {
    setExpandedChildId(expandedChildId === childId ? null : childId);
  };

  // 프린트 라벨 버튼 클릭 핸들러
  const handlePrintLabel = (child) => {
    console.log('라벨 인쇄 요청:', child);
    // 여기에 라벨 인쇄 로직 추가
    alert(`${child.name}의 라벨 인쇄가 요청되었습니다.`);
  };

  // 생년월일 포맷팅 함수
  const formatBirthDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
        <div className="loading">Loading...</div>
      ) : selectedLocation ? (
        <div className="children-list">
          <h3>List of children</h3>
          {children.length > 0 ? (
            <ul>
              {children.map(child => (
                <React.Fragment key={child.id}>
                  <li className="child-item">
                    <div 
                      className="child-info"
                      onClick={() => handleChildNameClick(child.id)}
                    >
                      <span className="child-name">{child.name}</span>
                      <span className="expand-icon">
                        {expandedChildId === child.id ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </div>
                    <div className="button-group">
                        {user.role !== 'guardian' &&
                        <button
                          className="print-label-button"
                          onClick={() => handlePrintLabel(child)}
                        >
                          <FaPrint /> Print Label
                        </button>
                      }
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
                    </div>
                  </li>
                  {expandedChildId === child.id && (
                    <div className="child-details">
                      <div className="child-details-content">
                        <div className="detail-item">
                          <div>
                            <span className="detail-label">Birth Date</span>
                            <span className="detail-value">{formatBirthDate(child.birth)}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <div>
                            <span className="detail-label">Phone</span>
                            <span className="detail-value">{child.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
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