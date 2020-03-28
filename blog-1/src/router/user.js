const { SuccessModel, ErrorModel } = require('../model/resModel')
const { login } = require('../controller/user')
const {set} =require('../db/redis')


const handlerUserRouter = (req, res) => {

    const method = req.method

    // console.log(method)
    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {

        const { username, password } = req.body
        // const{username, password }=req.query
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 设置cookie
                // res.setHeader('Set-Cookie',`username = ${data.username} ;path=/;httpOnly;expires=${getCookieExpires()}`)
                // 设置session
                req.session.username=data.username
                req.session.realname=data.realname
                // 同步到redis中
                set(req.sessionId,req.session)

                console.log('req.seeion is',req.session)

                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }
    // 登录验证的测试
    // if (method === 'GET' && req.path === '/api/user/login-test') {
    //     if (req.session.username) {
    //         return Promise.resolve(
    //             new SuccessModel({
    //                session:req.session
    //             })
    //             )
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登录'))
    // }
}



module.exports = handlerUserRouter