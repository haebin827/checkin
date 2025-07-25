import http from '../http-common.js';

const HistoryService = {
  showHistoriesAndLocationList(userId) {
    return http.get(`/history/list?id=${userId}`);
  },
};

export default HistoryService;
