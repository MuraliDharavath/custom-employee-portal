const axios = require("axios");

const ZOHO_APPS = {
  VIEW_ZOHO_PEOPLE: {
    name: "Zoho People",
    url: "https://people.zoho.com"
  },

  VIEW_ZOHO_CRM: {
    name: "Zoho CRM",
    url: "https://crm.zoho.com"
  },

  VIEW_ZOHO_DESK: {
    name: "Zoho Desk",
    url: "https://desk.zoho.com"
  },

  VIEW_ZOHO_BOOKS: {
    name: "Zoho Books",
    url: "https://books.zoho.com"
  }
};

async function getZohoAccessToken() {
  if (
    !process.env.ZOHO_CLIENT_ID ||
    !process.env.ZOHO_CLIENT_SECRET ||
    !process.env.ZOHO_REFRESH_TOKEN
  ) {
    throw new Error("Zoho credentials are not configured");
  }

  const response = await axios.post(
    "https://accounts.zoho.com/oauth/v2/token",
    null,
    {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token"
      }
    }
  );

  return response.data.access_token;
}

function getAuthorizedApps(permissions) {
  return permissions
    .filter(permission => ZOHO_APPS[permission])
    .map(permission => ({
      permission,
      ...ZOHO_APPS[permission]
    }));
}

module.exports = {
  getZohoAccessToken,
  getAuthorizedApps
};