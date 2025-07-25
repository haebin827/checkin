import http from '../http-common.js';

const ChildService = {
  createChild(data) {
    return http.post(`/children/create`, data);
  },

  getChildrenByLocation(locationId) {
    return http.get(`/children/location/${locationId}`);
  },

  updateChild(id, data) {
    return http.put(`/children/${id}`, data);
  },

  deleteChild(id) {
    return http.delete(`/children/${id}`);
  },

  sendInviteEmail(data) {
    return http.post('/children/invite-email', data);
  },

  getChildrenAndLocationList(userId) {
    return http.get(`/children/list?id=${userId}`);
  },

  forceCheckin(data) {
    return http.post('/children/force-checkin', data);
  },

  updateGuardianSettings(childId, data) {
    return http.put(`/children/guardian-settings/${childId}`, { ...data });
  },
};

export default ChildService;
