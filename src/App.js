const cron = require('node-cron');

cron.schedule('*/2 * * * *', function () {
    require('./routes/ExchangeCrawling.js');
  });