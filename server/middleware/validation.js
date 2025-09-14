// Middleware để kiểm tra dữ liệu đầu vào cho drug
const validateDrugData = (req, res, next) => {
    const { name, dosage, card, pack, perDay } = req.body;
    const errors = [];

    // a. Kiểm tra Name có độ dài hơn 5 ký tự
    if (!name || name.length <= 5) {
        errors.push("Tên thuốc phải có độ dài hơn 5 ký tự");
    }

    // b. Kiểm tra Dosage theo format: XX-morning,XX-afternoon,XX-night (X là số)
    const dosagePattern = /^\d+-morning,\d+-afternoon,\d+-night$/;
    if (!dosage || !dosagePattern.test(dosage)) {
        errors.push("Dosage phải theo format: XX-morning,XX-afternoon,XX-night (X là số)");
    }

    // c. Kiểm tra Card phải lớn hơn 1000
    if (!card || isNaN(card) || parseInt(card) <= 1000) {
        errors.push("Số viên thuốc mỗi card phải lớn hơn 1000");
    }

    // d. Kiểm tra Pack phải lớn hơn 0
    if (!pack || isNaN(pack) || parseInt(pack) <= 0) {
        errors.push("Số viên thuốc mỗi pack phải lớn hơn 0");
    }

    // e. Kiểm tra PerDay phải lớn hơn 0 và nhỏ hơn 90
    if (!perDay || isNaN(perDay) || parseInt(perDay) <= 0 || parseInt(perDay) >= 90) {
        errors.push("Số viên uống mỗi ngày phải lớn hơn 0 và nhỏ hơn 90");
    }

    // Nếu có lỗi, trả về response lỗi
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors: errors
        });
    }

    // Nếu không có lỗi, tiếp tục xử lý
    next();
};

// Middleware để kiểm tra dữ liệu update (cho phép một số trường không bắt buộc)
const validateDrugUpdateData = (req, res, next) => {
    const { name, dosage, card, pack, perDay } = req.body;
    const errors = [];

    // a. Kiểm tra Name có độ dài hơn 5 ký tự (nếu có)
    if (name && name.length <= 5) {
        errors.push("Tên thuốc phải có độ dài hơn 5 ký tự");
    }

    // b. Kiểm tra Dosage theo format (nếu có)
    if (dosage) {
        const dosagePattern = /^\d+-morning,\d+-afternoon,\d+-night$/;
        if (!dosagePattern.test(dosage)) {
            errors.push("Dosage phải theo format: XX-morning,XX-afternoon,XX-night (X là số)");
        }
    }

    // c. Kiểm tra Card phải lớn hơn 1000 (nếu có)
    if (card && (isNaN(card) || parseInt(card) <= 1000)) {
        errors.push("Số viên thuốc mỗi card phải lớn hơn 1000");
    }

    // d. Kiểm tra Pack phải lớn hơn 0 (nếu có)
    if (pack && (isNaN(pack) || parseInt(pack) <= 0)) {
        errors.push("Số viên thuốc mỗi pack phải lớn hơn 0");
    }

    // e. Kiểm tra PerDay phải lớn hơn 0 và nhỏ hơn 90 (nếu có)
    if (perDay && (isNaN(perDay) || parseInt(perDay) <= 0 || parseInt(perDay) >= 90)) {
        errors.push("Số viên uống mỗi ngày phải lớn hơn 0 và nhỏ hơn 90");
    }

    // Nếu có lỗi, trả về response lỗi
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors: errors
        });
    }

    // Nếu không có lỗi, tiếp tục xử lý
    next();
};

module.exports = {
    validateDrugData,
    validateDrugUpdateData
};
