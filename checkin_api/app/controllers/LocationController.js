const LocationService = require("../services/LocationService");

exports.getAllLocations = async(req, res) => {
    try {
        const response = await LocationService.findAllLocations();
        res.status(200).json({success: true, locations: response });
    } catch(err) {
        console.error("LocationController/getAllLocations: ", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch locations"
        });
    }
};

exports.createLocation = async(req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body cannot be empty"
            });
        }

        const response = await LocationService.createLocation(req.body);
        res.status(201).json({
            success: true,
            location: response
        });
    } catch(err) {
        console.error("LocationController/createLocation: ", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to create location"
        });
    }
};

exports.updateLocation = async(req, res) => {
    try {
        const locationId = req.params.id;
        const locationData = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address
        };
        
        const response = await LocationService.updateLocation(locationId, locationData);
        res.status(200).json({
            success: true,
            location: response
        });
    } catch(err) {
        console.error("LocationController/updateLocation: ", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to update location"
        });
    }
};

exports.deleteLocation = async(req, res) => {
    try {
        const locationId = req.params.id;
        await LocationService.deleteLocation(locationId);
        res.status(200).json({
            success: true,
            message: "Location deleted successfully"
        });
    } catch(err) {
        console.error("LocationController/deleteLocation: ", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to delete location"
        });
    }
};

exports.generateQr = async (req, res) => {
    try {
        const locationId = req.query.locationId;

        if (!locationId) {
            return res.status(400).json({
                success: false,
                message: 'locationId is required.'
            });
        }

        const location = await LocationService.findLocationById(locationId);

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found.'
            });
        }

        const result = await LocationService.generateQR(location);

        return res.status(200).json({
            success: true,
            qrCode: result.qrCode,
            url: result.url
        });
    } catch (err) {
        console.error('LocationController/generateQr:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to generate QR code'
        });
    }
};