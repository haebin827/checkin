import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChildService from '../services/ChildService';
import { useAuth } from '../hooks/useAuth';
import Toast from './common/Toast.jsx';
import Modal from './common/Modal.jsx';
import NewChildForm from './forms/NewChildForm.jsx';
import '../assets/styles/pages/ChildrenDataList.css';
import {
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaSave,
  FaTrash,
  FaTimes,
  FaPlus,
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { childEditSchema } from '../validations/validations';

const ITEMS_PER_PAGE = 10;

const ChildrenDataList = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedChildId, setExpandedChildId] = useState(null);

  const [editingChildId, setEditingChildId] = useState(null);
  const [editData, setEditData] = useState({
    engName: '',
    korName: '',
    birth: '',
    phone: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChildForDelete, setSelectedChildForDelete] = useState(null);
  const [showNewChildModal, setShowNewChildModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await ChildService.getChildrenAndLocationList(user.id);
        setLocations(response.data.data.locations);
        setChildren(response.data.data.children);
        setFilteredChildren(response.data.data.children);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (user?.id) fetchData();
  }, [user]);

  // -----------------------------------------------------
  // Filtering
  // -----------------------------------------------------

  useEffect(() => {
    let filtered = children;
    if (selectedLocation) {
      filtered = filtered.filter(child => child.location_id === parseInt(selectedLocation));
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        child =>
          child.engName.toLowerCase().includes(searchLower) ||
          (child.korName && child.korName.toLowerCase().includes(searchLower)),
      );
    }

    setFilteredChildren(filtered);
    setCurrentPage(1);
  }, [selectedLocation, children, searchTerm]);

  const handleLocationChange = e => setSelectedLocation(e.target.value);
  const handleSearchChange = e => setSearchTerm(e.target.value);
  const handleChildClick = childId =>
    setExpandedChildId(expandedChildId === childId ? null : childId);

  const formatBirthDate = dateString => {
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-');
    const date = new Date(year, month - 1, day); // month는 0-based이므로 -1

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // -----------------------------------------------------
  // Edit-related
  // -----------------------------------------------------
  const handleEditClick = child => {
    setEditingChildId(child.id);

    setEditData({
      engName: child.engName,
      korName: child.korName,
      birth: child.birth.split('T')[0],
      phone: child.phone,
    });
  };

  const handleSaveClick = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await ChildService.updateChild(editingChildId, values);

      if (response.data.success) {
        setChildren(prevChildren =>
          prevChildren.map(child =>
            child.id === editingChildId ? { ...child, ...values } : child,
          ),
        );

        setEditingChildId(null);
        toast.success('Child information updated successfully!');
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        toast.error('Failed to update child information.');
      }
      console.error('Error updating child:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingChildId(null);
    setEditData({
      engName: '',
      korName: '',
      birth: '',
      phone: '',
    });
  };

  // -----------------------------------------------------
  // Delete-related
  // -----------------------------------------------------
  const handleDeleteClick = child => {
    setSelectedChildForDelete(child);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await ChildService.deleteChild(selectedChildForDelete.id);

      if (response.data.success) {
        setChildren(prevChildren =>
          prevChildren.filter(child => child.id !== selectedChildForDelete.id),
        );

        toast.success('Child deleted successfully!');
        setExpandedChildId(null); // 확장된 상태 초기화
      }
    } catch (error) {
      toast.error('Failed to delete child.');
    } finally {
      setShowDeleteModal(false);
      setSelectedChildForDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedChildForDelete(null);
  };

  // -----------------------------------------------------
  // New Child Modal
  // -----------------------------------------------------
  const handleAddNewChild = () => {
    setShowNewChildModal(true);
  };

  const handleNewChildSuccess = newChild => {
    setChildren(prevChildren => [...prevChildren, newChild]);
    setShowNewChildModal(false);
  };

  const handleNewChildModalClose = () => {
    setShowNewChildModal(false);
  };

  // -----------------------------------------------------
  // Paginations
  // -----------------------------------------------------
  const totalPages = Math.ceil(filteredChildren.length / ITEMS_PER_PAGE);
  const paginatedChildren = filteredChildren.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    setExpandedChildId(null);
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
          <FaChevronLeft />
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
            ),
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="page-button"
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="page-header">
        <h2 className="page-header-children-list" style={{ fontSize: '1.5rem' }}>
          Children List ({filteredChildren.length})
        </h2>
        <div className="admin-actions">
          <button className="admin-button add-child-button" onClick={handleAddNewChild}>
            <FaPlus /> Add New Child
          </button>
        </div>
      </div>
      <div className="checkin-child-list">
        <Toast />

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
            <div className="loading-text">Loading children data...</div>
          </div>
        ) : (
          <div className="children-list">
            {filteredChildren.length > 0 ? (
              <table className="children-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Child Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedChildren.map((child, index) => (
                    <React.Fragment key={child.id}>
                      <tr onClick={() => handleChildClick(child.id)} className="child-row">
                        <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td>
                          {child.engName} ({child.korName})
                        </td>
                        <td>
                          {expandedChildId === child.id ? <FaChevronUp /> : <FaChevronDown />}
                        </td>
                      </tr>
                      {expandedChildId === child.id && (
                        <tr className="child-details-row">
                          <td colSpan="3">
                            {editingChildId === child.id ? (
                              <Formik
                                initialValues={editData}
                                validationSchema={childEditSchema}
                                onSubmit={handleSaveClick}
                                enableReinitialize
                              >
                                {({ isSubmitting, values, errors, touched }) => (
                                  <Form>
                                    <div className="child-details-content">
                                      <div className="child-details-header">
                                        <h4>Edit Child Information</h4>
                                        <div className="child-details-actions">
                                          <button
                                            type="submit"
                                            className="save-btn"
                                            disabled={isSubmitting}
                                          >
                                            <FaSave /> {isSubmitting ? 'Saving...' : 'Save'}
                                          </button>
                                          <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={handleCancelEdit}
                                          >
                                            <FaTimes /> Cancel
                                          </button>
                                        </div>
                                      </div>
                                      <div className="detail-item">
                                        <div>
                                          <span className="detail-label">English Name</span>
                                          <Field
                                            type="text"
                                            name="engName"
                                            className={`edit-input ${errors.engName && touched.engName ? 'error' : ''}`}
                                          />
                                          <ErrorMessage
                                            name="engName"
                                            component="div"
                                            className="error-text"
                                          />
                                        </div>
                                      </div>
                                      <div className="detail-item">
                                        <div>
                                          <span className="detail-label">Korean Name</span>
                                          <Field
                                            type="text"
                                            name="korName"
                                            className={`edit-input ${errors.korName && touched.korName ? 'error' : ''}`}
                                          />
                                          <ErrorMessage
                                            name="korName"
                                            component="div"
                                            className="error-text"
                                          />
                                        </div>
                                      </div>
                                      <div className="detail-item">
                                        <div>
                                          <span className="detail-label">Birth Date</span>
                                          <Field
                                            type="date"
                                            name="birth"
                                            className={`edit-input ${errors.birth && touched.birth ? 'error' : ''}`}
                                          />
                                          <ErrorMessage
                                            name="birth"
                                            component="div"
                                            className="error-text"
                                          />
                                        </div>
                                      </div>
                                      <div className="detail-item">
                                        <div>
                                          <span className="detail-label">Phone</span>
                                          <Field
                                            type="text"
                                            name="phone"
                                            className={`edit-input ${errors.phone && touched.phone ? 'error' : ''}`}
                                          />
                                          <ErrorMessage
                                            name="phone"
                                            component="div"
                                            className="error-text"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Form>
                                )}
                              </Formik>
                            ) : (
                              <div className="child-details-content">
                                <div className="child-details-header">
                                  <h4>Child Information</h4>
                                  <div className="child-details-actions">
                                    <button
                                      className="edit-btn"
                                      onClick={() => handleEditClick(child)}
                                    >
                                      <FaEdit /> Edit
                                    </button>
                                    <button
                                      className="delete-btn"
                                      onClick={() => handleDeleteClick(child)}
                                    >
                                      <FaTrash /> Delete
                                    </button>
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div>
                                    <span className="detail-label">English Name</span>
                                    <span className="detail-value">{child.engName}</span>
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div>
                                    <span className="detail-label">Korean Name</span>
                                    <span className="detail-value">{child.korName}</span>
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div>
                                    <span className="detail-label">Birth Date</span>
                                    <span className="detail-value">
                                      {formatBirthDate(child.birth)}
                                    </span>
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div>
                                    <span className="detail-label">Phone</span>
                                    <span className="detail-value">{child.phone}</span>
                                  </div>
                                </div>
                                {user.role === 'admin' && (
                                  <div className="detail-item">
                                    <div>
                                      <span className="detail-label">Location</span>
                                      <span className="detail-value">{child.location?.name}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No children found.</p>
            )}
            <Pagination />
          </div>
        )}
      </div>
      <Footer />

      {/* 삭제 확인 모달 */}
      {showDeleteModal && selectedChildForDelete && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Child</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>
                {selectedChildForDelete.engName} ({selectedChildForDelete.korName})
              </strong>
              ?
              <br />
              This action cannot be undone.
            </p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="delete-button" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Child Modal */}
      <Modal isOpen={showNewChildModal} onClose={handleNewChildModalClose} title="Add New Child">
        <NewChildForm onSuccess={handleNewChildSuccess} onClose={handleNewChildModalClose} />
      </Modal>
    </>
  );
};

export default ChildrenDataList;
