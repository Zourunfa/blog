const mysql = require('mysql')

const { MYSQL_CONF } = require('../conf/db')

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONF)
// console.log(con)

// 开始连接
con.connect()

//
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}

// 保持连接状态
// con.end()

module.exports={
    exec,
    escape:mysql.escape
}