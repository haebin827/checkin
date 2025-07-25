import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LocationService from '../services/LocationService';
import { useAuth } from '../hooks/useAuth';
import Toast from './common/Toast.jsx';
import Modal from './common/Modal.jsx';
import NewLocationForm from './forms/NewLocationForm.jsx';
import QrModal from './modals/QrModal.jsx';
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
  FaQrcode,
  FaPlus,
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { locationSchema } from '../validations/validations';

const ITEMS_PER_PAGE = 10;

const LocationsDataList = () => {
  const { user } = useAuth();

  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLocationId, setExpandedLocationId] = useState(null);

  const [loadingQr, setLoadingQr] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState('');

  const [editingLocationId, setEditingLocationId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLocationForDelete, setSelectedLocationForDelete] = useState(null);
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await LocationService.getAllLocations();

        const locationsData = response.data?.locations || [];
        const locationsArray = Array.isArray(locationsData) ? locationsData : [];

        setLocations(locationsArray);
        setFilteredLocations(locationsArray);
        setLoading(false);
      } catch (error) {
        setLocations([]);
        setFilteredLocations([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // -----------------------------------------------------
  // Filtering & Formatting address
  // -----------------------------------------------------
  useEffect(() => {
    let filtered = Array.isArray(locations) ? locations : [];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        location =>
          location?.name?.toLowerCase().includes(searchLower) ||
          location?.address?.toLowerCase().includes(searchLower),
      );
    }

    setFilteredLocations(filtered);
    setCurrentPage(1);
  }, [locations, searchTerm]);

  const handleSearchChange = e => setSearchTerm(e.target.value);
  const handleLocationClick = locationId =>
    setExpandedLocationId(expandedLocationId === locationId ? null : locationId);

  const parseAddress = address => {
    if (!address) return { streetAddress: '', city: '', state: '', postalCode: '' };

    const parts = address.split(',').map(part => part.trim());
    return {
      streetAddress: parts[0] || '',
      city: parts[1] || '',
      state: parts[2] || '',
      postalCode: parts[3] || '',
    };
  };

  const combineAddress = (streetAddress, city, state, postalCode) => {
    return [streetAddress, city, state, postalCode].filter(part => part && part.trim()).join(', ');
  };

  const formatAddress = location => {
    return location.address || '';
  };

  // -----------------------------------------------------
  // Edit-related
  // -----------------------------------------------------
  const handleEditClick = location => {
    setEditingLocationId(location.id);
    const addressParts = parseAddress(location.address);

    setEditData({
      name: location.name,
      phone: location.phone,
      ...addressParts,
    });
  };

  const handleSaveClick = async (values, { setSubmitting, setErrors }) => {
    try {
      const combinedAddress = combineAddress(
        values.streetAddress,
        values.city,
        values.state,
        values.postalCode,
      );

      const dataToSend = {
        name: values.name,
        phone: values.phone,
        address: combinedAddress,
      };

      const response = await LocationService.updateLocation(editingLocationId, dataToSend);

      if (response.data.success) {
        setLocations(prevLocations =>
          prevLocations.map(location =>
            location.id === editingLocationId ? { ...location, ...dataToSend } : location,
          ),
        );

        setEditingLocationId(null);
        toast.success('Location information updated successfully!');
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        toast.error('Failed to update location information.');
      }
      console.error('Error updating location:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingLocationId(null);
    setEditData({
      name: '',
      phone: '',
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
    });
  };

  // -----------------------------------------------------
  // Delete-related
  // -----------------------------------------------------
  const handleDeleteClick = location => {
    setSelectedLocationForDelete(location);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await LocationService.deleteLocation(selectedLocationForDelete.id);

      if (response.data.success) {
        // 로컬 상태에서 삭제
        setLocations(prevLocations =>
          prevLocations.filter(location => location.id !== selectedLocationForDelete.id),
        );

        toast.success('Location deleted successfully!');
        setExpandedLocationId(null); // 확장된 상태 초기화
      }
    } catch (error) {
      toast.error('Failed to delete location.');
      console.error('Error deleting location:', error);
    } finally {
      setShowDeleteModal(false);
      setSelectedLocationForDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedLocationForDelete(null);
  };

  // -----------------------------------------------------
  // QR-related
  // -----------------------------------------------------
  const handleQrClick = async (e, locationId) => {
    e.stopPropagation();
    setCurrentLocationId(locationId);
    setLoadingQr(true);
    setShowQrModal(true);
    setCurrentQrCode('');

    try {
      const result = await LocationService.getQr(locationId);

      if (result.success) {
        setCurrentQrCode(result.qrCode);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoadingQr(false);
    }
  };

  const handleDownload = () => {
    if (!currentQrCode) return;

    const link = document.createElement('a');
    link.href = currentQrCode;
    link.download = `location-qr-code.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [currentLocationId, setCurrentLocationId] = useState(null);

  const handleRegenerateQr = async () => {
    if (!currentLocationId) return;

    setLoadingQr(true);
    setCurrentQrCode('');

    try {
      const result = await LocationService.getQr(currentLocationId);

      if (result.success) {
        setCurrentQrCode(result.qrCode);
      }
    } catch (error) {
      console.error('Error regenerating QR code:', error);
      toast.error('Failed to regenerate QR code');
    } finally {
      setLoadingQr(false);
    }
  };

  // -----------------------------------------------------
  // New Location Modal
  // -----------------------------------------------------
  const handleAddNewLocation = () => {
    setShowNewLocationModal(true);
  };

  const handleNewLocationSuccess = newLocation => {
    setLocations(prevLocations => [...prevLocations, newLocation]);
    setShowNewLocationModal(false);
  };

  const handleNewLocationModalClose = () => {
    setShowNewLocationModal(false);
  };

  // -----------------------------------------------------
  // Paginations
  // -----------------------------------------------------
  const totalPages = Math.ceil((filteredLocations?.length || 0) / ITEMS_PER_PAGE);
  const paginatedLocations = Array.isArray(filteredLocations)
    ? filteredLocations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : [];

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    setExpandedLocationId(null);
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
          Locations List ({filteredLocations.length})
        </h2>
        <div className="admin-actions">
          <button className="admin-button add-child-button" onClick={handleAddNewLocation}>
            <FaPlus /> Add New Location
          </button>
        </div>
      </div>
      <div className="checkin-child-list">
        <Toast />

        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="search">Search location:</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Enter name or address..."
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading locations data...</div>
          </div>
        ) : (
          <div className="children-list">
            {filteredLocations.length > 0 ? (
              <table className="children-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLocations.map((location, index) => (
                    <React.Fragment key={location.id}>
                      <tr onClick={() => handleLocationClick(location.id)} className="child-row">
                        <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td>{location.name}</td>
                        <td>{formatAddress(location)}</td>
                        <td>
                          {expandedLocationId === location.id ? <FaChevronUp /> : <FaChevronDown />}
                        </td>
                      </tr>
                      {expandedLocationId === location.id && (
                        <tr className="child-details-row">
                          <td colSpan="4">
                            {editingLocationId === location.id ? (
                              <Formik
                                initialValues={editData}
                                validationSchema={locationSchema}
                                onSubmit={handleSaveClick}
                                enableReinitialize
                              >
                                {({ isSubmitting, values, errors, touched }) => (
                                  <Form>
                                    <div className="child-details-content">
                                      <div className="child-details-header">
                                        <h4>Edit Location Information</h4>
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
                                          <span className="detail-label">Name</span>
                                          <Field
                                            type="text"
                                            name="name"
                                            className={`edit-input ${errors.name && touched.name ? 'error' : ''}`}
                                          />
                                          <ErrorMessage
                                            name="name"
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
                                      <div className="detail-item">
                                        <div>
                                          <span className="detail-label">Address</span>
                                          <div className="address-row">
                                            <div className="address-field">
                                              <span className="address-field-label">
                                                Street Address
                                              </span>
                                              <Field
                                                type="text"
                                                name="streetAddress"
                                                placeholder="Enter street address"
                                                className={`edit-input ${errors.streetAddress && touched.streetAddress ? 'error' : ''}`}
                                              />
                                              <ErrorMessage
                                                name="streetAddress"
                                                component="div"
                                                className="error-text"
                                              />
                                            </div>
                                            <div className="address-field">
                                              <span className="address-field-label">City</span>
                                              <Field
                                                type="text"
                                                name="city"
                                                placeholder="Enter city"
                                                className={`edit-input ${errors.city && touched.city ? 'error' : ''}`}
                                              />
                                              <ErrorMessage
                                                name="city"
                                                component="div"
                                                className="error-text"
                                              />
                                            </div>
                                            <div className="address-field">
                                              <span className="address-field-label">State</span>
                                              <Field
                                                type="text"
                                                name="state"
                                                placeholder="Enter state"
                                                className={`edit-input ${errors.state && touched.state ? 'error' : ''}`}
                                              />
                                              <ErrorMessage
                                                name="state"
                                                component="div"
                                                className="error-text"
                                              />
                                            </div>
                                            <div className="address-field">
                                              <span className="address-field-label">
                                                Postal Code
                                              </span>
                                              <Field
                                                type="text"
                                                name="postalCode"
                                                placeholder="Enter postal code"
                                                className={`edit-input ${errors.postalCode && touched.postalCode ? 'error' : ''}`}
                                              />
                                              <ErrorMessage
                                                name="postalCode"
                                                component="div"
                                                className="error-text"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Form>
                                )}
                              </Formik>
                            ) : (
                              <div className="child-details-content">
                                <div className="child-details-header">
                                  <h4>Location Information</h4>
                                  <div className="child-details-actions">
                                    {user.role === 'admin' && (
                                      <button
                                        className="qr-btn"
                                        onClick={e => handleQrClick(e, location.id)}
                                      >
                                        <FaQrcode /> QR
                                      </button>
                                    )}
                                    <button
                                      className="edit-btn"
                                      onClick={() => handleEditClick(location)}
                                    >
                                      <FaEdit /> Edit
                                    </button>
                                    <button
                                      className="delete-btn"
                                      onClick={() => handleDeleteClick(location)}
                                    >
                                      <FaTrash /> Delete
                                    </button>
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div>
                                    <span className="detail-label">Name</span>
                                    <span className="detail-value">{location.name}</span>
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div>
                                    <span className="detail-label">Phone</span>
                                    <span className="detail-value">{location.phone}</span>
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div>
                                    <span className="detail-label">Address</span>
                                    <span className="detail-value">{formatAddress(location)}</span>
                                  </div>
                                </div>
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
              <p>No locations found.</p>
            )}
            <Pagination />
          </div>
        )}
      </div>
      <Footer />

      {/* Delete-confirmation Modal */}
      {showDeleteModal && selectedLocationForDelete && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Location</h3>
            <p>
              Are you sure you want to delete <strong>{selectedLocationForDelete.name}</strong>?
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

      {/* QR Modal */}
      <QrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        loadingQr={loadingQr}
        currentQrCode={currentQrCode}
        onDownload={handleDownload}
        onRegenerate={handleRegenerateQr}
      />

      {/* New Location Modal */}
      <Modal
        isOpen={showNewLocationModal}
        onClose={handleNewLocationModalClose}
        title="Add New Location"
      >
        <NewLocationForm
          onSuccess={handleNewLocationSuccess}
          onClose={handleNewLocationModalClose}
        />
      </Modal>
    </>
  );
};

export default LocationsDataList;
