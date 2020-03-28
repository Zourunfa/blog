const crypto= require('crypto')

// 秘钥
const SECRET_KEY = 'WJio_8776#' //字符串自己设定的


// md5
function md5(content){
    let md5 =crypto.createHash('md5') //

    return md5.update(content).digest('hex') //把输出变成16进制
}


function genPassword(password){
    const str =`password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

const result = genPassword('123')

console.log(result)

module.exports ={
    genPassword
}