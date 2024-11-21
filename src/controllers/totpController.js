// totpController.js
const TotpAuthenticator = require("../utils/TotpAuthenticator");
const { getUserSecret, MFAEnable } = require("../models/user");
const verifyTotpCode = async (req, res) => {
  const { userEmail, totpCode } = req.body;
  const totp = new TotpAuthenticator();

  // get user secretkey from the database
  const userSecret = await getUserSecret({ email: userEmail });

  // Define the TOTP parameters
  const digits = 6;
  const period = 30;

  // Generate the TOTP codes for the current, previous, and next time steps
  const currentCode = totp.generateTotp(userSecret.secret_key, digits, period);
  const previousCode = totp.generateTotp(
    userSecret.secret_key,
    digits,
    period,
    -1
  ); // Previous step
  const nextCode = totp.generateTotp(userSecret.secret_key, digits, period, +1); // Next step

  // Verify if the provided code matches any of the possible valid codes
  const isValid =
    totpCode === currentCode ||
    totpCode === previousCode ||
    totpCode === nextCode;

  if (isValid) {
    const response = await MFAEnable({ email: userEmail });

    if (response.statuscode == 1) {
      res.json({ success: true, message: "TOTP verified successfully!" });
    } else {
      res.json(response.response);
    }
  } else {
    res.json({ success: false, message: "Invalid TOTP code." });
  }
};

const verifyTotpCodeLogin = async (req, res) => {
  const { userEmail, totpCode } = req.body;
  const totp = new TotpAuthenticator();

  // get user secretkey from the database
  const userSecret = await getUserSecret({ email: userEmail });

  // Define the TOTP parameters
  const digits = 6;
  const period = 30;

  // Generate the TOTP codes for the current, previous, and next time steps
  const currentCode = totp.generateTotp(userSecret.secret_key, digits, period);
  const beforeCode = totp.generateTotp(
    userSecret.secret_key,
    digits,
    period,
    -1
  );
  // Verify if the provided code matches any of the possible valid codes
  const isValid = totpCode === currentCode || totpCode === beforeCode;

  if (isValid) {
    res.json({ success: true, message: "TOTP verified successfully!" });
  } else {
    res.json({ success: false, message: "Invalid TOTP code." });
  }
};

module.exports = { verifyTotpCode, verifyTotpCodeLogin };
