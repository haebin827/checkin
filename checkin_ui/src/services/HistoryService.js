import http from "../http-common.js";

const showHistoriesAndLocationList = (userId) => {
    return http.get(`/history/list?id=${userId}`);
};

const HistoryService = {
    showHistoriesAndLocationList
};

export default HistoryService;