const xPaths = [
    {div : 4, tr : 1},  // USD_KRW
    {div : 6, tr : 1},  // USD_JPY
    {div : 6, tr : 14}, // USD_IDR
    {div : 6, tr : 17}, // USD_VND
    {div : 6, tr : 2},  // EUR_USD
    {div : 6, tr : 19}  // USD_INR
   ]
var smbs = [];

const pt = require('puppeteer');
module.exports.crawling = async () => {
        var xPath;
        var evalData;
        var data;
        const browser = await pt.launch({headless : false})
        //browser new page
        const p = await browser.newPage();
        //launch URL
        await p.goto('http://www.smbs.biz/ExRate/TodayExRate.jsp')
        for(var i = 0; i < xPaths.length; i++) {
            if(i == 0) { xPath = '//\*[@id="content"]/div[' + xPaths[i].div + ']/table/tbody/tr[' + xPaths[i].tr + ']/td[2]/text()';  }
            else { xPath = '//\*[@id="content"]/div[' + xPaths[i].div + ']/table/tbody/tr[' + xPaths[i].tr + ']/td[2]/span/text()'; }

            data = await p.$x(xPath);
            evalData = await p.evaluate(element => {
                return element.textContent;
            }, data[0]);
            smbs.push(evalData);
        }

        await p.goto('https://usd.fxexchangerate.com/cny-exchange-rates-history.html')
        data = await p.waitForSelector('#tbodyhis > tr:nth-child(2) > td:nth-child(3)')
        evalData = await p.evaluate(data => data.textContent, data);
        smbs.push(evalData)

        await p.goto('https://www.banguat.gob.gt/cambio/default.asp')
        data = await p.waitForSelector('body > div.table-responsive > div > div > div > table:nth-child(1) > tbody > tr.detalle_banguat > td')
        evalData = await p.evaluate(data => data.textContent, data);
        smbs.push(evalData)
        
        await p.goto('https://usd.fxexchangerate.com/nio-exchange-rates-history.html')
        data = await p.waitForSelector('#tbodyhis > tr:nth-child(2) > td:nth-child(3)')
        evalData = await p.evaluate(data => data.textContent, data);
        smbs.push(evalData)

        await p.goto('https://www.bloomberg.com/quote/USDCRC:CUR')
        const key = '#root > div > div > section > section.quotePageSnapshot > div > div.snapshot__4a99d1b9de.snapshot > section.snapshotOverview__ffb4a63bcd.loading__5f1d37f09c > section > section > section > div:nth-child(1) > span.priceText__06f600fa3e'
        data = await p.$$eval(key, e=>e.map((a)=>a.textContent))
        evalData = data[0]
        smbs.push(evalData)

        await p.goto('https://usd.fxexchangerate.com/htg-exchange-rates-history.html')
        data = await p.waitForSelector('#tbodyhis > tr:nth-child(2) > td:nth-child(3)')
        evalData = await p.evaluate(data => data.textContent, data);
        smbs.push(evalData)

        await p.goto('https://usd.fxexchangerate.com/dop-exchange-rates-history.html')
        data = await p.waitForSelector('#tbodyhis > tr:nth-child(2) > td:nth-child(3)')
        evalData = await p.evaluate(data => data.textContent, data);
        smbs.push(evalData)
        //browser close
        await browser.close()
        return smbs;
};