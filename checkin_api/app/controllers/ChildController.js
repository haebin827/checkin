const ChildService = require("../services/ChildService");

exports.getAllChildren = async(req, res) => {
    try {
        const response = await ChildService.findAllChildren();
        res.status(200).json({
            success: true,
            children: response
        });
    } catch(err) {
        console.error("ChildController/getAllChildren: ", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch children"
        });
    }
};

exports.getChildrenByLocation = async(req, res) => {
    try {
        const locationId = req.params.locationId;
        
        if (!locationId) {
            return res.status(400).json({
                success: false,
                message: "Location ID is required"
            });
        }

        const response = await ChildService.findChildrenByLocation(locationId);
        res.status(200).json({
            success: true,
            children: response
        });
    } catch(err) {
        console.error("ChildController/findChildrenByLocation: ", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch children"
        });
    }
};

exports.createChild = async(req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body cannot be empty"
            });
        }

        const response = await ChildService.createChild(req.body);
        res.status(201).json({
            success: true,
            child: response
        });
    } catch(err) {
        console.error("ChildController/createChild: ", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to create child"
        });
    }
};

exports.updateChild = async(req, res) => {
    try {
        const response = await ChildService.updateChild(req.params.id, req.body);
        res.status(200).json({
            success: true,
            child: response
        });
    } catch(err) {
        console.error("ChildController/updateChild: ", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to update child"
        });
    }
};

exports.deleteChild = async(req, res) => {
    try {
        await ChildService.deleteChild(req.params.id);
        res.status(200).json({
            success: true,
            message: "Child deleted successfully"
        });
    } catch(err) {
        console.error("ChildController/deleteChild: ", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to delete child"
        });
    }
};

exports.sendInviteEmail = async(req, res) => {
    const {guardianEmail, childId, locationId} = req.body;
    try {
        await ChildService.sendInviteEmail(guardianEmail, childId, locationId);
        res.status(200).json({success: true})
    } catch(err) {
        console.error("ChildController/sendInviteEmail: ", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to send an invitation"
        });
    }
}