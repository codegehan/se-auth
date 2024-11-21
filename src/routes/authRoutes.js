const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");
const {
  verifyTotpCode,
  verifyTotpCodeLogin,
} = require("../controllers/totpController");
const { generateTotpCode } = require("../controllers/generateTotpController");

const authController = require("../controllers/authController");

router.post("/checkMFA", authController.MFAEnable);
router.post("/login", authController.login);
router.post("/register", authController.signup);
router.post("/resend-otp", authController.resendOtp);
router.post("/verify-email", authController.verifyEmail);
router.post("/logout", authController.logoutUser);
router.post("/generateSecret", authController.generateSecretKey);
router.post("/storeSecret", authController.storeSecretKey);
router.post("/getSecret", authController.getSecretForLogin);
router.post("/markSuccess", authController.markScannedSuccess);
router.post("/checkScanStatus", authController.checkScanStatus);

router.post("/verify-totp", verifyTotpCode);
router.post("/verify-totp-login", verifyTotpCodeLogin);

router.post("/generateTotp", generateTotpCode);

router.post("/storePublicKey", authController.storePublicKeyForEncryption);

router.get("/protected", authenticate, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user.decoded });
});

router.get("/check-token", (req, res) => {
  const token = req.cookies.accessToken;

  if (token) {
    res.json({ message: `Token Found: ${token}` });
    `Token Found: ${token}`;
  } else {
    res.json({ message: "Token Not Found" });
  }
});

module.exports = router;
