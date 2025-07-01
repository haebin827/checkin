import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FaCheckCircle, FaQrcode, FaChevronDown, FaChevronUp, FaBirthdayCake, FaPhone, FaPrint, FaEdit, FaSave } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import '../assets/styles/components/CheckinChildList.css';
import {useAuth} from "../hooks/useAuth.jsx";
import ChildService from "../services/ChildService";
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

const CheckinChildList = forwardRef(({ onSelectChild }, ref) => {
  const {user} = useAuth();

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedChildId, setExpandedChildId] = useState(null);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [tempDisabledButtons, setTempDisabledButtons] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingChildId, setEditingChildId] = useState(null);
  const [editData, setEditData] = useState({
    relationship: '',
    isSms: '0'
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedChildForCheckin, setSelectedChildForCheckin] = useState(null);

  // 외부에서 호출할 수 있는 메소드 노출
  useImperativeHandle(ref, () => ({
    updateCheckedInStatus: (childId) => {
      setFilteredChildren(prevChildren => prevChildren.map(child => 
        child.id === childId 
          ? { ...child, checkedIn: true } 
          : child
      ));
    }
  }));

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await ChildService.getChildrenAndLocationList(user.id);
        setLocations(response.data.data.locations);
        setChildren(response.data.data.children);
        
        // Set default location for manager role
        if (user.role === 'manager' && response.data.data.locations.length > 0) {
          setSelectedLocation(response.data.data.locations[0].id.toString());
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  // 선택된 위치와 검색어에 따라 아이들 필터링
  useEffect(() => {
    let filtered = children;
    
    // 위치 필터링
    if (selectedLocation) {
      filtered = filtered.filter(child => 
        child.locationId === parseInt(selectedLocation) || 
        child.location?.id === parseInt(selectedLocation)
      );
    }
    
    // 검색어 필터링
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(child =>
        child.engName.toLowerCase().includes(searchLower) ||
        child.korName.toLowerCase().includes(searchLower)
      );
    }

    setFilteredChildren(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedLocation, children, searchTerm]);

  // 페이지네이션 관련 계산
  const totalPages = Math.ceil(filteredChildren.length / ITEMS_PER_PAGE);
  const paginatedChildren = filteredChildren.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedChildId(null); // Reset expanded state when page changes
  };

  // 페이지네이션 컴포넌트
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxVisiblePages = window.innerWidth <= 768 ? 3 : 5;
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      let startPage = Math.max(currentPage - halfVisible, 1);
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }

      return pageNumbers;
    };

    return (
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="page-button"
          aria-label="Previous page"
        >
          <FaAngleLeft />
        </button>

        <div className="page-numbers">
          {getPageNumbers().map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="ellipsis">...</span>
            ) : (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>

        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="page-button"
          aria-label="Next page"
        >
          <FaAngleRight />
        </button>
      </div>
    );
  };

  // 위치 선택 핸들러
  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 체크인 버튼 클릭 핸들러
  const handleCheckInClick = (child) => {
    if (!child.checkedIn && !tempDisabledButtons.has(child.id)) {
      if(user.role !== 'guardian') {
        setSelectedChildForCheckin(child);
        setShowConfirmModal(true);
      } else {
        onSelectChild(child);
      }
    }
  };

  // 실제 체크인 처리
  const handleConfirmCheckin = async () => {
    
    const child = selectedChildForCheckin;
    try {
      const response = await ChildService.forceCheckin({
        userId: user.id, 
        locationId: selectedLocation || child.location_id,
        childId: child.id,
        childName: child.engName,
        name: user.engName,
        locationName: child.location?.name,
        attemptMaker: user.role === 'manager' ? 'manager' : 'admin'
      });
      
      if(response.data.success) {
        setTempDisabledButtons(prev => new Set([...prev, child.id]));
        
        toast.success(`${child.engName} (${child.korName}) Check-in complete!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        if (expandedChildId === child.id) {
          setTimeout(() => {
            setExpandedChildId(null);
          }, 1000);
        }
      }
    } catch (error) {
      toast.error(`Check-in failed: ${error.response?.data?.message || 'Unknown error occured'}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setShowConfirmModal(false);
      setSelectedChildForCheckin(null);
    }
  };

  // 아이 이름 클릭 핸들러
  const handleChildNameClick = (childId) => {
    setExpandedChildId(expandedChildId === childId ? null : childId);
  };

  // 프린트 라벨 버튼 클릭 핸들러
  const handlePrintLabel = (child) => {
    console.log('라벨 인쇄 요청:', child);
    alert(`${child.engName}의 라벨 인쇄가 요청되었습니다.`);
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

  // 수정 모드 시작
  const handleEditClick = (child) => {
    setEditingChildId(child.id);
    setEditData({
      relationship: child.user_child.relationship,
      isSms: child.user_child.isSms
    });
  };

  // 수정 저장
  const handleSaveClick = async (childId) => {
    try {
      const response = await ChildService.updateGuardianSettings(childId, user.id, {
        relationship: editData.relationship,
        isSms: editData.isSms
      });
      
      if (response.data.success) {
        // 성공 시 상태 업데이트
        setFilteredChildren(prevChildren => prevChildren.map(child => 
          child.id === childId 
            ? { 
                ...child, 
                user_child: { 
                  ...child.user_child, 
                  relationship: editData.relationship,
                  isSms: editData.isSms 
                } 
              } 
            : child
        ));
        
        setEditingChildId(null);
        toast.success('Settings updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="checkin-child-list">
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="location">Select location:</label>
          <select 
            id="location" 
            value={selectedLocation} 
            onChange={handleLocationChange}
            className="location-select"
          >
            <option value="">--- All Locations ---</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="search">Search child:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter name..."
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="children-list">
          <h3>List of children {filteredChildren.length > 0 && `(${filteredChildren.length})`}</h3>
          {filteredChildren.length > 0 ? (
            <>
              <ul>
                {paginatedChildren.map(child => (
                  <React.Fragment key={child.id}>
                    <li className="child-item">
                      <div 
                        className="child-info"
                        onClick={() => handleChildNameClick(child.id)}
                      >
                        <span className="child-name">{child.engName} ({child.korName})</span>
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
                            className={`checkin-button ${child.checkedIn || tempDisabledButtons.has(child.id) ? 'checked' : ''}`}
                          onClick={() => handleCheckInClick(child)}
                            disabled={child.checkedIn || tempDisabledButtons.has(child.id)}
                        >
                          {child.checkedIn ? (
                            <>
                              <FaCheckCircle /> 완료
                            </>
                            ) : tempDisabledButtons.has(child.id) ? (
                              <>
                                <FaCheckCircle /> Checked-in
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
                          {user.role === 'guardian' && (
                            <>
                              <div className="settings-header">
                                <h4>Guardian Settings</h4>
                                {editingChildId === child.id ? (
                                  <button 
                                    className="save-button"
                                    onClick={() => handleSaveClick(child.id)}
                                  >
                                    <FaSave /> Save
                                  </button>
                                ) : (
                                  <button 
                                    className="edit-button"
                                    onClick={() => handleEditClick(child)}
                                  >
                                    <FaEdit /> Edit
                                  </button>
                                )}
                              </div>
                              <div className="settings-row">
                                <div className="detail-item flex-1">
                                  <div className="detail-content">
                                    <span className="detail-label">Relationship</span>
                                    {editingChildId === child.id ? (
                                      <input
                                        type="text"
                                        value={editData.relationship}
                                        onChange={(e) => setEditData({...editData, relationship: e.target.value})}
                                        className="edit-input"
                                      />
                                    ) : (
                                      <span className="detail-value">{child.user_child.relationship}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="detail-item flex-1">
                                  <div className="detail-content">
                                    <span className="detail-label">SMS setting</span>
                                    <div className="sms-checkbox">
                                      <input
                                        type="checkbox"
                                        checked={editingChildId === child.id ? editData.isSms === '1' : child.user_child.isSms === '1'}
                                        onChange={(e) => editingChildId === child.id && setEditData({...editData, isSms: e.target.checked ? '1' : '0'})}
                                        disabled={editingChildId !== child.id}
                                      />
                                      <span className="checkbox-label">
                                        {editingChildId === child.id ? (editData.isSms === '1' ? 'Enabled' : 'Disabled') : (child.user_child.isSms === '1' ? 'Enabled' : 'Disabled')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          {user.role === 'admin' && (
                            <div className="detail-item">
                              <div>
                                <span className="detail-label">Location Name</span>
                                <span className="detail-value">{child.location?.name}</span>
                              </div>
                            </div>
                          )}
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
              <Pagination />
            </>
          ) : (
            <p>No children registered.</p>
          )}
        </div>
      )}

      {/* 확인 모달 */}
      {showConfirmModal && selectedChildForCheckin && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Check-in Confirmation</h3>
            <p>Are you sure you want to check in <strong>{selectedChildForCheckin.engName}</strong>?</p>
            <div className="modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedChildForCheckin(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="confirm-button"
                onClick={handleConfirmCheckin}
              >
                Confirm Check-in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default CheckinChildList; 