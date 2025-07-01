const ChildService = require('../services/ChildService');

exports.getAllChildren = async (req, res) => {
  const response = await ChildService.findAllChildren();
  res.status(200).json({
    success: true,
    children: response,
  });
};

exports.getChildrenByLocation = async (req, res) => {
  const locationId = req.params.locationId;

  if (!locationId) {
    return res.status(400).json({
      success: false,
      message: 'Location ID is required',
    });
  }

  const response = await ChildService.findChildrenByLocation(locationId);
  res.status(200).json({
    success: true,
    children: response,
  });
};

exports.createChild = async (req, res) => {
  const { locationId, ...rest } = req.body;

  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: 'Request body cannot be empty',
    });
  }

  const response = await ChildService.createChild({ ...rest, location_id: locationId });
  res.status(201).json({
    success: true,
    child: response,
  });
};

exports.updateChild = async (req, res) => {
  const response = await ChildService.updateChild(req.params.id, req.body);
  res.status(200).json({
    success: true,
    child: response,
  });
};

exports.deleteChild = async (req, res) => {
  await ChildService.deleteChild(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Child deleted successfully',
  });
};

exports.sendInviteEmail = async (req, res) => {
  const { guardianEmail, childId, locationId } = req.body;
  await ChildService.sendInviteEmail(guardianEmail, childId, locationId);
  res.status(200).json({ success: true });
};

exports.showChildrenAndLocationList = async (req, res) => {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required as a query parameter',
    });
  }

  const response = await ChildService.showChildrenAndLocationList(userId);

  res.status(200).json({
    success: true,
    data: response,
  });
};

exports.forceCheckin = async (req, res) => {
  const { locationId, childId, userId, ...otherData } = req.body;

  if (!locationId || !childId || !userId) {
    return res.status(400).json({
      success: false,
      message: 'LocationId, childId, and userId are all required',
    });
  }

  const history = await ChildService.forceCheckin({
    locationId,
    childId,
    userId,
    ...otherData,
  });

  res.status(201).json({
    success: true,
    history,
  });
};

exports.updateGuardianSettings = async (req, res) => {
  const { childId } = req.params;
  const { userId, relationship, isSms } = req.body;

  const result = await ChildService.updateGuardianSettings(childId, userId, {
    relationship,
    isSms,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
};
