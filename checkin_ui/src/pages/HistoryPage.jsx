import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FaSort, FaSortUp, FaSortDown, FaCalendarAlt, FaSearch, FaMapMarkerAlt, FaFilter, FaChevronDown, FaChevronUp, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../assets/styles/pages/History.css';

const HistoryPage = () => {
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

  // 위치 목록 가져오기 (예시 데이터)
  useEffect(() => {
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      setLocations([
        { id: 1, name: 'Suwanee Center' },
        { id: 2, name: 'Duluth Center' },
        { id: 3, name: 'Buford Center' },
        { id: 4, name: 'Alpharetta Center' },
        { id: 5, name: 'Johns Creek Center' }
      ]);
    }, 300);
  }, []);

  // 초기 데이터 로드 (예시 데이터)
  useEffect(() => {
    setIsLoading(true);
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      const mockData = [
        { id: 1, childName: 'Haebin Noh', date: '2023-05-15', time: '09:30 AM', location: 'Suwanee Center', checkedInBy: 'Admin Lee' },
        { id: 2, childName: 'Jaeyull Noh', date: '2023-05-15', time: '09:35 AM', location: 'Suwanee Center', checkedInBy: 'Admin Lee' },
        { id: 3, childName: 'Sophia Johnson', date: '2023-05-14', time: '10:15 AM', location: 'Duluth Center', checkedInBy: 'Admin Kim' },
        { id: 4, childName: 'Ethan Smith', date: '2023-05-14', time: '09:45 AM', location: 'Buford Center', checkedInBy: 'Admin Park' },
        { id: 5, childName: 'Olivia Parker', date: '2023-05-13', time: '08:55 AM', location: 'Duluth Center', checkedInBy: 'Admin Lee' },
        { id: 6, childName: 'Haebin Noh', date: '2023-05-13', time: '09:10 AM', location: 'Suwanee Center', checkedInBy: 'Admin Kim' },
        { id: 7, childName: 'William Turner', date: '2023-05-12', time: '10:05 AM', location: 'Buford Center', checkedInBy: 'Admin Park' },
        { id: 8, childName: 'Emma Davis', date: '2023-05-12', time: '09:20 AM', location: 'Duluth Center', checkedInBy: 'Admin Lee' },
        { id: 9, childName: 'Jaeyull Noh', date: '2023-05-11', time: '08:50 AM', location: 'Suwanee Center', checkedInBy: 'Admin Park' },
        { id: 10, childName: 'Noah Wilson', date: '2023-05-11', time: '09:40 AM', location: 'Buford Center', checkedInBy: 'Admin Kim' },
        { id: 11, childName: 'Ava Brown', date: '2023-05-10', time: '08:45 AM', location: 'Alpharetta Center', checkedInBy: 'Admin Taylor' },
        { id: 12, childName: 'James Garcia', date: '2023-05-10', time: '09:15 AM', location: 'Johns Creek Center', checkedInBy: 'Admin Rodriguez' },
        { id: 13, childName: 'Isabella Martin', date: '2023-05-10', time: '10:30 AM', location: 'Suwanee Center', checkedInBy: 'Admin Lee' },
        { id: 14, childName: 'Lucas Adams', date: '2023-05-09', time: '08:30 AM', location: 'Duluth Center', checkedInBy: 'Admin Kim' },
        { id: 15, childName: 'Mia Campbell', date: '2023-05-09', time: '09:50 AM', location: 'Buford Center', checkedInBy: 'Admin Park' },
        { id: 16, childName: 'Haebin Noh', date: '2023-05-08', time: '09:05 AM', location: 'Suwanee Center', checkedInBy: 'Admin Lee' },
        { id: 17, childName: 'Benjamin Wright', date: '2023-05-08', time: '10:10 AM', location: 'Alpharetta Center', checkedInBy: 'Admin Taylor' },
        { id: 18, childName: 'Charlotte Evans', date: '2023-05-08', time: '08:40 AM', location: 'Johns Creek Center', checkedInBy: 'Admin Rodriguez' },
        { id: 19, childName: 'Henry Roberts', date: '2023-05-07', time: '09:25 AM', location: 'Duluth Center', checkedInBy: 'Admin Kim' },
        { id: 20, childName: 'Amelia Morgan', date: '2023-05-07', time: '10:20 AM', location: 'Buford Center', checkedInBy: 'Admin Park' },
        { id: 21, childName: 'Jaeyull Noh', date: '2023-05-06', time: '08:35 AM', location: 'Suwanee Center', checkedInBy: 'Admin Lee' },
        { id: 22, childName: 'Elijah Collins', date: '2023-05-06', time: '09:15 AM', location: 'Alpharetta Center', checkedInBy: 'Admin Taylor' },
        { id: 23, childName: 'Harper Murphy', date: '2023-05-06', time: '10:25 AM', location: 'Johns Creek Center', checkedInBy: 'Admin Rodriguez' },
        { id: 24, childName: 'Abigail Rivera', date: '2023-05-05', time: '08:50 AM', location: 'Duluth Center', checkedInBy: 'Admin Kim' },
        { id: 25, childName: 'Daniel Morris', date: '2023-05-05', time: '09:40 AM', location: 'Buford Center', checkedInBy: 'Admin Park' },
        { id: 26, childName: 'Haebin Noh', date: '2023-05-04', time: '10:15 AM', location: 'Suwanee Center', checkedInBy: 'Admin Lee' },
        { id: 27, childName: 'Sofia Gonzalez', date: '2023-05-04', time: '08:45 AM', location: 'Alpharetta Center', checkedInBy: 'Admin Taylor' },
        { id: 28, childName: 'Matthew Clark', date: '2023-05-04', time: '09:30 AM', location: 'Johns Creek Center', checkedInBy: 'Admin Rodriguez' },
        { id: 29, childName: 'Scarlett Lewis', date: '2023-05-03', time: '10:10 AM', location: 'Duluth Center', checkedInBy: 'Admin Kim' },
        { id: 30, childName: 'Jaeyull Noh', date: '2023-05-03', time: '08:55 AM', location: 'Buford Center', checkedInBy: 'Admin Park' },
      ];
      
      setRecords(mockData);
      setFilteredRecords(mockData);
      setIsLoading(false);
    }, 800);
  }, []);

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
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.name}>
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
                    {paginatedRecords.map(record => (
                      <tr key={record.id}>
                        <td>{record.childName}</td>
                        <td>{record.date}</td>
                        <td>{record.time}</td>
                        <td>{record.location}</td>
                        <td>{record.checkedInBy}</td>
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
              <button className="clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HistoryPage;