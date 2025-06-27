import http from "../http-common.js";

const createChild = (data) => {
    return http.post(`/children/create`, data);
};

const getChildren = () => {
    return http.get(`/children`);
};

const getChildrenByLocation = (locationId) => {
    return http.get(`/children/location/${locationId}`);
};

const updateChild = (id, data) => {
    return http.put(`/children/${id}`, data);
};

const deleteChild = (id) => {
    return http.delete(`/children/${id}`);
};

const sendInviteEmail = (data) => {
    return http.post('/children/invite-email', data);
};

const ChildService = {
    createChild,
    getChildren,
    updateChild,
    deleteChild,
    getChildrenByLocation,
    sendInviteEmail
};

export default ChildService;