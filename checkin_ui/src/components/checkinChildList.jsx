import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  FaCheckCircle,
  FaQrcode,
  FaChevronDown,
  FaChevronUp,
  FaPrint,
  FaEdit,
  FaSave,
} from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import '../assets/styles/components/CheckinChildList.css';
import { useAuth } from '../hooks/useAuth.jsx';
import ChildService from '../services/ChildService';
import { toast } from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

const CheckinChildList = forwardRef(({ onSelectChild }, ref) => {
  const { user } = useAuth();

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
    isSms: '0',
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedChildForCheckin, setSelectedChildForCheckin] = useState(null);

  useImperativeHandle(ref, () => ({
    updateCheckedInStatus: childId => {
      setFilteredChildren(prevChildren =>
        prevChildren.map(child => (child.id === childId ? { ...child, checkedIn: true } : child))
      );
    },
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await ChildService.getChildrenAndLocationList(user.id);
        setLocations(response.data.data.locations);
        setChildren(response.data.data.children);
        console.log(locations);

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

  // -----------------------------------------------------
  // Child Info
  // -----------------------------------------------------
  const handleChildNameClick = childId => {
    setExpandedChildId(expandedChildId === childId ? null : childId);
  };

  const formatBirthDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEditClick = child => {
    setEditingChildId(child.id);
    setEditData({
      relationship: child.user_child.relationship,
      isSms: child.user_child.isSms,
    });
  };

  const handleSaveClick = async childId => {
    try {
      const response = await ChildService.updateGuardianSettings(childId, user.id, {
        relationship: editData.relationship,
        isSms: editData.isSms,
      });

      if (response.data.success) {
        setFilteredChildren(prevChildren =>
          prevChildren.map(child =>
            child.id === childId
              ? {
                  ...child,
                  user_child: {
                    ...child.user_child,
                    relationship: editData.relationship,
                    isSms: editData.isSms,
                  },
                }
              : child
          )
        );

        setEditingChildId(null);
        toast.success('Settings updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update settings.');
      console.error('Error updating settings:', error);
    }
  };

  // -----------------------------------------------------
  // Filtering
  // -----------------------------------------------------
  useEffect(() => {
    let filtered = children;

    if (selectedLocation) {
      filtered = filtered.filter(
        child =>
          child.locationId === parseInt(selectedLocation) ||
          child.location?.id === parseInt(selectedLocation)
      );
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        child =>
          child.engName.toLowerCase().includes(searchLower) ||
          child.korName.toLowerCase().includes(searchLower)
      );
    }

    setFilteredChildren(filtered);
    setCurrentPage(1);
  }, [selectedLocation, children, searchTerm]);

  const handleLocationChange = e => {
    setSelectedLocation(e.target.value);
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  // -----------------------------------------------------
  // Pagination
  // -----------------------------------------------------
  const totalPages = Math.ceil(filteredChildren.length / ITEMS_PER_PAGE);
  const paginatedChildren = filteredChildren.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    setExpandedChildId(null); // Reset expanded state when page changes
  };

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
          {getPageNumbers().map((pageNum, index) =>
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="ellipsis">
                ...
              </span>
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
          )}
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

  // -----------------------------------------------------
  // Check-in related
  // -----------------------------------------------------
  const handleCheckInClick = child => {
    if (!tempDisabledButtons.has(child.id)) {
      if (user.role !== 'guardian') {
        setSelectedChildForCheckin(child);
        setShowConfirmModal(true);
      } else {
        // Checkin for User
        onSelectChild(child);
      }
    }
  };

  // Force checkin for Manager and Admin
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
        attemptMaker: user.role === 'manager' ? 'manager' : 'admin',
      });

      if (response.data.success) {
        setTempDisabledButtons(prev => new Set([...prev, child.id]));

        toast.success(`${child.engName} (${child.korName}) Check-in complete!`);

        if (expandedChildId === child.id) {
          setTimeout(() => {
            setExpandedChildId(null);
          }, 1000);
        }
      }
    } catch (error) {
      toast.error(`Check-in failed. Please contact to the system team.`);
    } finally {
      setShowConfirmModal(false);
      setSelectedChildForCheckin(null);
    }
  };

  // -----------------------------------------------------
  // Print label
  // -----------------------------------------------------
  const handlePrintLabel = child => {
    console.log('라벨 인쇄 요청:', child);
    alert(`${child.engName}'s label printing.`);
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
                      <div className="child-info" onClick={() => handleChildNameClick(child.id)}>
                        <span className="child-name">
                          {child.engName} ({child.korName})
                        </span>
                        <span className="expand-icon">
                          {expandedChildId === child.id ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      </div>
                      <div className="button-group">
                        {user.role !== 'guardian' && (
                          <button
                            className="print-label-button"
                            onClick={() => handlePrintLabel(child)}
                          >
                            <FaPrint /> Print Label
                          </button>
                        )}
                        <button
                          className={`checkin-button ${tempDisabledButtons.has(child.id) ? 'checked' : ''}`}
                          onClick={() => handleCheckInClick(child)}
                          disabled={tempDisabledButtons.has(child.id)}
                        >
                          {tempDisabledButtons.has(child.id) ? (
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
                                        onChange={e =>
                                          setEditData({ ...editData, relationship: e.target.value })
                                        }
                                        className="edit-input"
                                      />
                                    ) : (
                                      <span className="detail-value">
                                        {child.user_child.relationship}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="detail-item flex-1">
                                  <div className="detail-content">
                                    <span className="detail-label">SMS setting</span>
                                    <div className="sms-checkbox">
                                      <input
                                        type="checkbox"
                                        checked={
                                          editingChildId === child.id
                                            ? editData.isSms === '1'
                                            : child.user_child.isSms === '1'
                                        }
                                        onChange={e =>
                                          editingChildId === child.id &&
                                          setEditData({
                                            ...editData,
                                            isSms: e.target.checked ? '1' : '0',
                                          })
                                        }
                                        disabled={editingChildId !== child.id}
                                      />
                                      <span className="checkbox-label">
                                        {editingChildId === child.id
                                          ? editData.isSms === '1'
                                            ? 'Enabled'
                                            : 'Disabled'
                                          : child.user_child.isSms === '1'
                                            ? 'Enabled'
                                            : 'Disabled'}
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

      {/* Force-checkin Confirmation Modal */}
      {showConfirmModal && selectedChildForCheckin && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Check-in Confirmation</h3>
            <p>
              Are you sure you want to check in <strong>{selectedChildForCheckin.engName}</strong>?
            </p>
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
              <button className="confirm-button" onClick={handleConfirmCheckin}>
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
