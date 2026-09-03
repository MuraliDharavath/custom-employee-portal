const express = require("express");
const axios = require("axios");

const router = express.Router();

const CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/api/zoho/callback";

router.get("/authorize", (req, res) => {
  if (!CLIENT_ID) {
    return res.status(500).send(`
      <h2>Zoho Configuration Error</h2>
      <p>ZOHO_CLIENT_ID is not configured.</p>
    `);
  }

  const scopes = [
    "ZOHOPEOPLE.employee.READ",
    "ZohoCRM.modules.READ",
    "Desk.basic.READ",
    "ZohoBooks.settings.READ",
  ].join(",");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: scopes,
    redirect_uri: REDIRECT_URI,
    access_type: "offline",
    prompt: "consent",
  });

  const authorizationUrl =
    `https://accounts.zoho.in/oauth/v2/auth?${params.toString()}`;

  res.redirect(authorizationUrl);
});


router.get("/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`
      <h2>Zoho Authorization Failed</h2>
      <p>${error}</p>
    `);
  }

  if (!code) {
    return res.status(400).send(`
      <h2>Authorization code missing</h2>
    `);
  }

  try {
    const response = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      null,
      {
        params: {
          code: code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        },
      }
    );

    const refreshToken = response.data.refresh_token;

    console.log("Zoho token exchange successful.");

    res.send(`
      <h2>Zoho OAuth Setup Successful</h2>
      <p>Refresh token generated successfully.</p>
      <p><strong>Copy the refresh token from your backend terminal.</strong></p>
      <p>Then add it to your backend .env file.</p>
    `);

    console.log("ZOHO_REFRESH_TOKEN:");
    console.log(refreshToken);

  } catch (error) {
    console.error(
      "Zoho token exchange failed:",
      error.response?.data || error.message
    );

    res.status(500).send(`
      <h2>Zoho Token Exchange Failed</h2>
      <p>Check your backend terminal for details.</p>
    `);
  }
});

module.exports = router;