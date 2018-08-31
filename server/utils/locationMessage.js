const locationMessage = (from, lat, lon) => ({
  from,
  link: `https://www.google.com/maps?q=${lat},${lon}`,
  createdAt: new Date().getTime()
});

module.exports = locationMessage;
