import jwt from "jsonwebtoken";

//admin authentication middleware

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    // Token is signed as email + password, so verify it matches
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const expectedTokenData = adminEmail + adminPassword;

    if (token_decode !== expectedTokenData) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    next();
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message || "Authentication failed" });
  }
};

export default authAdmin;
