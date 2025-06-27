import http from "../http-common.js";

const getAllLocations = () => {
    return http.get(`/location`);
};

const createLocation = (data) => {
    return http.post(`/location/create`, data);
};

const updateLocation = (id, data) => {
    return http.put(`/location/${id}`, data);
};

const deleteLocation = (id) => {
    return http.delete(`/location/${id}`);
};

const getQr = (locationId) => {
    return http.get(`/location/create-qr?locationId=${locationId}`);
};

const LocationService = {
    getAllLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    getQr
};

export default LocationService;