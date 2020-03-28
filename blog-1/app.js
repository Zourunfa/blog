/**
 * 第二层
 * 主要设置处理系统的基本功能，没有业务代码的处理
 * 
 */

const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring')
const { get, set } = require('./src/db/redis')
const {access}=require('./src/utils/log')





// const getCookieExpires = () => {
//     const d = new Date()
//     d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
//     console.log('d.toString() is', d.toString())
//     return d.toGMTString()
// }
// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toGMTString() is ', d.toGMTString())
    return d.toGMTString()
}
// console.log(getCookieExpires())

// session数据 
// const SESSION_DATA = {}

// 用于处理postData
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })

    })
    return promise
}


const serverHandle = (req, res) => {

    // 记录access log
    access(`${req.method}--${req.url}--${req.headers['user-agent']}--${Date.now()}`)


    //设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')


    // 获取path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析query
    req.query = querystring.parse(url.split('?')[1])


    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    });



    // 解析 session
    // let needSetCookie = false
    // let userId = req.cookie.userid


    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}

    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]


    // console.log('req.cookie is',req.cookie)
    // console.log(userId) 
    // 使用redis解析session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if (!userId) {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     // 初始化redis 中的session的值
    //     set(userId, {})

    // }
    // // 获取session 
    // req.sessionId = userId
    // get(req.sessionId).then(sessionData => {
    //     if (sessionData = null) {
    //         // 初始化redis 中的session的值
    //         set(req.sessionId, {})
    //         // 设置session
    //         req.session = {}
    //     } else {
    //         req.session = sessionData
    //     }
    //     console.log('req.session', req.session)
    //     // 处理postData
    //    return  getPostData(req)
    // })
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            // req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }
        console.log('req.session ', req.session)

        // 处理 post data
        return getPostData(req)
    })
    .then(postData => {
        req.body = postData

        // 处理blog的路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid = ${userId} ;path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }


        // // 处理user的路由
        // const userData=handleUserRouter(req,res)
        // if(userData){
        //     res.end(
        //         JSON.stringify(userData)
        //     )
        //     return
        // }

        const userResult = handleUserRouter(req, res)

        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid = ${userId} ;path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }



        // 未命中返回404
        res.writeHead(404, { 'Content-type': 'text/plain' })
        res.end('404 Not Found\n')
    })



}
module.exports = serverHandle

//   env:process.env.NODE_ENV