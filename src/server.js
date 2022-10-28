const express       = require('express');
const app           = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

require('./routes/ExchangeCrawling.js')(app);      // 환율 크롤링

const port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log('listening on ' + port)
});