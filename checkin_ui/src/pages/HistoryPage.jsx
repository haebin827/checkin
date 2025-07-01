import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FaSort, FaSortUp, FaSortDown, FaCalendarAlt, FaSearch, FaMapMarkerAlt, FaFilter, FaChevronDown, FaChevronUp, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../assets/styles/pages/History.css';
import {useAuth} from "../hooks/useAuth.jsx";
import HistoryService from "../services/HistoryService.js";

const HistoryPage = () => {

  const {user} = useAuth();

  // 필터 상태
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  
  // 정렬 상태
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // 데이터 상태
  const [locations, setLocations] = useState([]);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [paginatedRecords, setPaginatedRecords] = useState([]);

  // 필터 토글 핸들러
  const toggleFilter = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        setIsLoading(true);
        if (!user?.id) return;

        const response = await HistoryService.showHistoriesAndLocationList(user.id);
        console.log("DATA", response.data)

        if(response.data.success) {
          // locations 설정
          const locationsList = response.data.response.locations;
          setLocations(locationsList);  // 이미 배열 형태로 오는 locations 데이터를 그대로 설정

          console.log("LOCATIONS: ", locationsList)
          // histories 데이터 변환
          const transformedHistories = response.data.response.histories.map(history => {
            const date = new Date(history.createdAt);
            return {
              ...history,
              date: date.toLocaleDateString(),
              time: date.toLocaleTimeString(),
              location: history.location?.name,
              childName: history.child?.engName,
              checkedInBy: history.checkedInBy?.engName,
              checkedInByRole: history.checkedInBy?.role
            };
          });

          setRecords(transformedHistories);
          setFilteredRecords(transformedHistories);
        }
      } catch (error) {
        console.error('Error fetching history data:', error);
        // 에러 처리를 위한 상태 추가가 필요하다면 추가
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatas();
    console.log(records)
    console.log(locations)
  }, [user]);

  // 날짜 변환 유틸리티 함수
  const formatDateToString = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 필터 적용
  useEffect(() => {
    let result = [...records];
    
    // 위치 필터
    if (locationFilter) {
      result = result.filter(record => record.location === locationFilter);
    }
    
    // 날짜 필터
    if (dateFilter) {
      const dateString = formatDateToString(dateFilter);
      result = result.filter(record => record.date === dateString);
    }
    
    // 이름 필터
    if (nameFilter) {
      const lowerCaseName = nameFilter.toLowerCase();
      result = result.filter(record => 
        record.childName.toLowerCase().includes(lowerCaseName)
      );
    }
    
    // 정렬 적용
    result = sortRecords(result, sortField, sortDirection);
    
    setFilteredRecords(result);
  }, [records, locationFilter, dateFilter, nameFilter, sortField, sortDirection]);

  // 정렬 핸들러
  const handleSort = (field) => {
    if (sortField === field) {
      // 같은 필드를 다시 클릭하면 방향 전환
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 새 필드 선택
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 정렬 함수
  const sortRecords = (data, field, direction) => {
    return [...data].sort((a, b) => {
      if (field === 'date') {
        // 날짜와 시간을 함께 고려하여 정렬
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // 문자열 정렬
        const valueA = a[field].toLowerCase();
        const valueB = b[field].toLowerCase();
        
        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
  };

  // 정렬 아이콘 렌더링
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <FaSort className="sort-icon" />;
    }
    return sortDirection === 'asc' ? 
      <FaSortUp className="sort-icon active" /> : 
      <FaSortDown className="sort-icon active" />;
  };

  // 필터 초기화
  const clearFilters = () => {
    setLocationFilter('');
    setDateFilter(null);
    setNameFilter('');
  };

  // 페이지네이션 적용
  useEffect(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    setPaginatedRecords(filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord));
  }, [filteredRecords, currentPage, recordsPerPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 레코드 수 변경 핸들러
  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // 페이지 당 레코드 수 변경 시 첫 페이지로 이동
  };

  // 페이지네이션 컨트롤 렌더링
  const renderPagination = () => {
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // 이전 페이지 버튼
    const prevButton = (
      <button 
        key="prev" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        <FaChevronLeft />
      </button>
    );
    
    // 다음 페이지 버튼
    const nextButton = (
      <button 
        key="next" 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        <FaChevronRight />
      </button>
    );
    
    // 첫 페이지 버튼 (생략 표시가 필요한 경우에만)
    const firstPageButton = startPage > 1 ? (
      <button 
        key="first" 
        onClick={() => handlePageChange(1)}
        className="pagination-button"
      >
        1
      </button>
    ) : null;
    
    // 첫 페이지 생략 표시
    const firstEllipsis = startPage > 2 ? (
      <span key="firstEllipsis" className="pagination-ellipsis">...</span>
    ) : null;
    
    // 마지막 페이지 버튼 (생략 표시가 필요한 경우에만)
    const lastPageButton = endPage < totalPages ? (
      <button 
        key="last" 
        onClick={() => handlePageChange(totalPages)}
        className="pagination-button"
      >
        {totalPages}
      </button>
    ) : null;
    
    // 마지막 페이지 생략 표시
    const lastEllipsis = endPage < totalPages - 1 ? (
      <span key="lastEllipsis" className="pagination-ellipsis">...</span>
    ) : null;
    
    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button 
          key={i} 
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="pagination">
        {prevButton}
        {firstPageButton}
        {firstEllipsis}
        {pageNumbers}
        {lastEllipsis}
        {lastPageButton}
        {nextButton}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="history-page">
        <div className="history-container">
        
          <div className="filter-header">
            <button className="filter-toggle" onClick={toggleFilter}>
              <FaFilter /> Filters {isFilterExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {!isFilterExpanded && (locationFilter || dateFilter || nameFilter) && (
              <div className="active-filters">
                <span>Active filters: </span>
                {locationFilter && <span className="filter-badge">{locationFilter}</span>}
                {dateFilter && <span className="filter-badge">{dateFilter.toDateString()}</span>}
                {nameFilter && <span className="filter-badge">Name: {nameFilter}</span>}
                <button className="clear-filters-small" onClick={clearFilters}>Clear</button>
              </div>
            )}
          </div>
          
          {isFilterExpanded && (
            <div className="filters-section">
              <div className="filter-group">
                <div className="filter-icon">
                  <FaMapMarkerAlt />
                </div>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="filter-select"
                >
                  <option key="all" value="">All Locations</option>
                  {Array.isArray(locations) && locations.map((location) => (
                    <option key={location.id || 'default'} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <div className="filter-icon">
                  <FaCalendarAlt />
                </div>
                <DatePicker
                  selected={dateFilter}
                  onChange={(date) => setDateFilter(date)}
                  className="filter-input"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select date"
                  isClearable
                />
              </div>
              
              <div className="filter-group">
                <div className="filter-icon">
                  <FaSearch />
                </div>
                <input 
                  type="text" 
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="Search by name"
                  className="filter-input"
                />
              </div>
              
              <button className="clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading check-in records...</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <>
              <div className="table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>
                        <span>No</span>
                      </th>
                      <th onClick={() => handleSort('childName')}>
                        <span>Child Name</span>
                        {renderSortIcon('childName')}
                      </th>
                      <th onClick={() => handleSort('date')}>
                        <span>Date</span>
                        {renderSortIcon('date')}
                      </th>
                      <th onClick={() => handleSort('time')}>
                        <span>Time</span>
                        {renderSortIcon('time')}
                      </th>
                      <th onClick={() => handleSort('location')}>
                        <span>Location</span>
                        {renderSortIcon('location')}
                      </th>
                      <th onClick={() => handleSort('checkedInBy')}>
                        <span>Checked in by</span>
                        {renderSortIcon('checkedInBy')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.map((record, index) => (
                      <tr key={record.id}>
                        <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                        <td>{record.childName}</td>
                        <td>{record.date}</td>
                        <td>{record.time}</td>
                        <td>{record.location}</td>
                        <td>
                          {record.checkedInBy}
                          {record.checkedInByRole === 'admin' && <span style={{ color: 'red', marginLeft: '4px', fontSize: '12px' }}>(Admin)</span>}
                          {record.checkedInByRole === 'manager' && <span style={{ color: 'red', marginLeft: '4px', fontSize: '12px' }}>(Manager)</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="pagination-container">
                <div className="records-per-page">
                  <label htmlFor="recordsPerPage">Show:</label>
                  <select 
                    id="recordsPerPage"
                    value={recordsPerPage}
                    onChange={handleRecordsPerPageChange}
                    className="records-per-page-select"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                
                {renderPagination()}
                
                <div className="records-summary">
                  Showing {Math.min(filteredRecords.length, (currentPage - 1) * recordsPerPage + 1)} - {Math.min(currentPage * recordsPerPage, filteredRecords.length)} of {filteredRecords.length} records
                </div>
              </div>
            </>
          ) : (
            <div className="no-records">
              <p>No check-in records found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HistoryPage;