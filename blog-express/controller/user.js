
const{exec,escape}=require('../db/mysql')
const {genPassword}=require('../utils/cryp')

const login =(username,password)=>{
    // const sql=`
    // select username,realname from users where username='${username}' and  password='${password}'
    // `
    username = escape(username)
    password =genPassword(password)
    password = escape(password) //有escape函数下面的申请完了语句的变量要去掉单引号

    

    const sql = `
    select username, realname from users where username=${username} and password=${password}
`
console.log('sql is',sql)
    // console.log(exec(sql));
    // console.log(exec())

    return exec(sql).then(rows=>{
        console.log(rows[0])

        return rows[0]||{}
    })
}

module.exports={
    login
}