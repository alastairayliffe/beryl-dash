const CryptoJS = require("crypto-js");

const hash64Func = urlParam => {
    let hash = CryptoJS.HmacSHA256(urlParam, 'l2gzz7ybZPoXwHzJ7vS1H6RHk9Uo3pCy6ZIIIUZI1H8sCe0FLeobhZ1J5L2TtpkrobWUGKOPT7Dd7CENrO2w==');
    // That hash generated has to be set into base64
    return CryptoJS.enc.Base64.stringify(hash);

}

module.exports = {
    hash64Func
}