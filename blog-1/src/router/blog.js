// 第三次层只管路由


const { getList, getDetail, newBlog, updataBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')


// 统一的登录验证函数

const loginCheck=(req)=>{
    if(!req.session.username){
        return Promise.resolve(
            new ErrorModel('尚未登录')
            
        )
    }
}


const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // const lsitData = getList(author, keyword)
        // return new SuccessModel(lsitData)
        // if(req.query.isadmin){
        //     const loginCheckResult=loginCheck(req)
        //     if(loginCheckResult){
        //         // 未登录
        //         return  loginCheckResult
        //     }
        //     author=req.session.username
        // }
        if (req.query.isadmin) {
            // 管理员界面
            const loginCheckResult = loginCheck(req)
            if (loginCheckResult) {
                // 未登录
                return loginCheckResult
            }
            // 强制查询自己的博客
            console.log(req.session.username)
            author = req.session.username
            console.log(author)
        }

        const result=getList(author,keyword)
        return result.then(listData=>{
            return new SuccessModel(listData)
        })

    }

    // 获取博客详情
    if (method === 'GET' && req.path === "/api/blog/detail") {
        // const data = getDetail()
        // return new SuccessModel(data)
        const result=getDetail(id)
        return  result.then(data=>{
            return new SuccessModel(data)
        })

    }

    // 新建一片博客
    if (method === "POST" && req.path === '/api/blog/new') {
        // const data = newBlog(req.body)
        // return new SuccessModel(data)
        const  loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            return loginCheckResult
        }
       
        req.body.author=req.session.username
        const result =newBlog(req.body)
        return result.then(data=>{
            return new SuccessModel(data)
        })
    }

    // 更新一片博客
    if (method === "POST" && req.path === '/api/blog/update') {

        const  loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            return loginCheckResult
        }
       

        const result = updataBlog(id, req.body)
        console.log(id)
  console.log(req.body)

        return result.then(val=>{
            console.log(val)
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel('更新博客失败')
            }
        })
    }

    // 删除一片博客
    if (method === "POST" && req.path === '/api/blog/del') {

        const  loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            return loginCheckResult
        }
       
        const author =req.session.name
        const result = delBlog(id,author)
        return result.then(val=>{
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel('删除失败')
            }
        })
      
    }
}

module.exports = handleBlogRouter