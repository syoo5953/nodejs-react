const { sql, pool } = require('../dbo/db');    
const e = require("express");

const xPaths = [
    {div : 4, tr : 1},  // USD_KRW
    {div : 6, tr : 1},  // USD_JPY
    {div : 6, tr : 14}, // USD_IDR
    {div : 6, tr : 17}, // USD_VND
    {div : 6, tr : 2},  // EUR_USD
    {div : 6, tr : 19}  // USD_INR
   ]
var smbs = [];
module.exports = function(app)
{
    
    const pt = require('puppeteer');
    pt.launch().then(async browser => {
    //browser new page
    const p = await browser.newPage();
    //set viewpoint of browser page
    await p.setViewport({ width: 1000, height: 500 })
    //launch URL
    await p.goto('http://www.smbs.biz/ExRate/TodayExRate.jsp')
    //capture screenshot
    var xPath;
    var evalData;
    var data;
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

        try{
            await p.goto('https://www.bloomberg.com/quote/USDCRC:CUR')
            data = await p.eval$$('#root > div > div > section > section.quotePageSnapshot > div > div.snapshot__4a99d1b9de.snapshot > section.snapshotOverview__ffb4a63bcd.loading__5f1d37f09c > section > section > section > div:nth-child(1) > span.priceText__06f600fa3e', e=>e.map((a)=>a.textContent))
            evalData = data[0]
        } catch {
            evalData = null;
        }
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
    console.log(smbs)
    })
}