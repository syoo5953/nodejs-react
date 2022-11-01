const { sql, pool } = require('../dbo/db'); 
const result = require('../utils/CommonUtils.jsx');

const mybatisMapper = require('mybatis-mapper');
mybatisMapper.createMapper(['./src/mapper/ExchangeSQL.xml']); // 환율
const format    = { language:'sql', indent:'    '};

const fmtDate = (date, format) => {
    const year  = date.getFullYear();
    const mon   = (date.getMonth() + 1) > 9 ? ''+(date.getMonth() + 1) : '0'+(date.getMonth()+1);
    const day   = date.getDate() > 9 ? ''+date.getDate() : '0'+date.getDate();

    if(format === 'yyyymmdd'){
        return `${year}${mon}${day}`;
    }else{
        return `${year}-${mon}-${day}`;
    }
}

const convertValue = (res) => {
    for(var i = 0; i < res.length; i++) {
        var tempVal = res[i].split(' ')
        res[i] = parseFloat(tempVal[0].replace(/,/g, '')).toFixed(2)
    }
    return res;
}

async function executeQuery(param, method) {
    const sPool     = await pool;
    if(method.toLowerCase() == 'insert') { method = 'insertIntoTemp' } 
    else if(method.toLowerCase() == 'select') { method = 'selectTemp' }

    var query = mybatisMapper.getStatement('ExchangeSQL', method, param, format);
    return await sPool.request().query(query);
}

(async() => {
    const date = fmtDate(new Date(), '')
    var res = await result.crawling();
    res = convertValue(res)

    var param = {
          'XCHG_DATE' : date
        , 'USD_KRW'   : res[0]
        , 'USD_JPY'   : res[1]
        , 'USD_CNY'   : res[2]
        , 'USD_IDR'   : res[3]
        , 'USD_VND'   : res[4]
        , 'EUR_USD'   : res[5]
        , 'USD_EUR'   : res[6]
        , 'USD_GTQ'   : res[7]
        , 'USD_NIO'   : res[8]
        , 'USD_CRC'   : res[9]
        , 'USD_HTG'   : res[10]
        , 'MSG'       : null
        , 'USD_DOP'   : res[11]
        , 'USD_INR'   : null    
    }
    
    await executeQuery(param, 'insert')

    var queryRes = await executeQuery(null, 'select')
    console.log(queryRes)
})();