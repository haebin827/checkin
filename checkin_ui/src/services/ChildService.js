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

const getChildrenAndLocationList = (userId) => {
    return http.get(`/children/list?id=${userId}`);
};

const forceCheckin = (data) => {
    return http.post('/children/force-checkin', data);
};

const updateGuardianSettings = (childId, data) => {
    return http.put(`/children/guardian-settings/${childId}`, { ...data });
};

const ChildService = {
    createChild,
    getChildren,
    updateChild,
    deleteChild,
    getChildrenByLocation,
    sendInviteEmail,
    getChildrenAndLocationList,
    forceCheckin,
    updateGuardianSettings
};

export default ChildService;