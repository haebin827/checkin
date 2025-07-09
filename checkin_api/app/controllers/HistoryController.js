const HistoryService = require('../services/HistoryService');

exports.showHistoriesAndLocationList = async (req, res) => {
  const userId = req.query.id;

  if (!userId) {
    res.status(400).json({
      success: false,
    });
  }

  const response = await HistoryService.showHistoriesAndLocationList(userId);

  res.status(200).json({
    success: true,
    response,
  });
};
