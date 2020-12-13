const LinePay = require('line-pay-v3');
require('dotenv').config();
 
let linepay = new LinePay({
  channelId: process.env.LINE_PAY_CHANNALID,
  channelSecret: process.env.LINE_PAY_CHANNALSECRET,
  uri: 'https://sandbox-api-pay.line.me'
});

module.exports = linepay;