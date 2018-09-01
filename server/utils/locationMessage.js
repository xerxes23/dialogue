const moment = require("moment");

const locationMessage = (from, lat, lon) => ({
  from,
  link: `https://www.google.com/maps?q=${lat},${lon}`,
  createdAt: moment().valueOf()
});

module.exports = locationMessage;
