const LocationService = require('../services/LocationService');
const AppError = require('../middlewares/AppError');
const ChildService = require('../services/ChildService');

exports.getAllLocations = async (req, res) => {
  const response = await LocationService.findAllLocations();
  res.status(200).json({ success: true, locations: response });
};

exports.createLocation = async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      success: false,
    });
  }

  const response = await LocationService.createLocation(req.body);
  res.status(201).json({
    success: true,
    location: response,
  });
};

exports.updateLocation = async (req, res) => {
  const locationId = req.params.id;
  const { name, phone, address } = req.body;

  if (!locationId || !name || !phone || !address) {
    res.status(400).json({
      success: false,
    });
  }

  const locationData = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
  };

  const response = await LocationService.updateLocation(locationId, locationData);
  res.status(200).json({
    success: true,
    location: response,
  });
};

exports.deleteLocation = async (req, res) => {
  const locationId = req.params.id;
  await LocationService.deleteLocation(locationId);
  res.status(200).json({
    success: true,
  });
};

exports.generateQr = async (req, res) => {
  const locationId = req.query.locationId;

  if (!locationId) {
    return res.status(400).json({
      success: false,
    });
  }

  const location = await LocationService.findLocationById(locationId);
  const result = await LocationService.generateQR(location);

  return res.status(200).json({
    success: true,
    qrCode: result.qrCode,
    url: result.url,
  });
};

exports.verifyQR = async (req, res) => {
  const { uuid } = req.params;
  const { token } = req.query;
  const { userId, childId } = req.body;

  if (!token || !uuid || !userId || !childId) {
    res.status(400).json({
      success: false,
    });
  }

  const verifiedQr = await LocationService.verifyQR(uuid, token, userId, childId);

  res.status(200).json({
    success: true,
    history: verifiedQr,
  });
};

exports.sendManagerInviteEmail = async (req, res) => {
  const { managerEmail, locationId } = req.body;
  console.log(managerEmail, locationId);
  const result = await LocationService.sendManagerInviteEmail(managerEmail, locationId);
  res.status(200).json({ success: true, locationName: result });
};

exports.retrieveManagerEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    res.status(400).json({
      success: false,
    });
  }
  const data = await LocationService.retrieveManagerEmail(token);
  res.status(200).json({ success: true, ...data });
};
