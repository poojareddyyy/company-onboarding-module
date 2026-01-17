const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { saveCompanyProfile } = require("../controllers/company.controller");
router.post("/profile", authMiddleware, saveCompanyProfile);
module.exports = router;