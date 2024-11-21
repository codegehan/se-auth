// totpService.js
const crypto = require("crypto");
const { authenticator } = require("otplib");

function parseOtpauthUri(uri) {
  if (!uri.startsWith("otpauth://totp/")) {
    throw new Error("Invalid otpauth URI");
  }
  const uriParts = uri.slice("otpauth://totp/".length).split("?");
  const accountName = uriParts[0];
  const params = new URLSearchParams(uriParts[1]);

  const secret = params.get("secret");
  const issuer = params.get("issuer") || "";
  const digits = parseInt(params.get("digits"), 10) || 6;
  const period = parseInt(params.get("period"), 10) || 30;

  return { accountName, secret, issuer, digits, period };
}

function generateTotp(secret, digits = 6, period = 30, stepOffset = 0) {
  const decodedSecret = Buffer.from(authenticator.decode(secret), "binary");
  const currentTimeStep = Math.floor(Date.now() / 1000 / period);

  // Adjust time step based on the offset
  const adjustedTimeStep = currentTimeStep + stepOffset;

  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(adjustedTimeStep), 0);

  const hmac = crypto.createHmac("sha1", decodedSecret);
  hmac.update(timeBuffer);
  const hmacResult = hmac.digest();

  const offset = hmacResult[hmacResult.length - 1] & 0x0f;
  const binaryCode =
    ((hmacResult[offset] & 0x7f) << 24) |
    ((hmacResult[offset + 1] & 0xff) << 16) |
    ((hmacResult[offset + 2] & 0xff) << 8) |
    (hmacResult[offset + 3] & 0xff);

  const totpCode = binaryCode % 10 ** digits;
  return totpCode.toString().padStart(digits, "0");
}

module.exports = { parseOtpauthUri, generateTotp };
