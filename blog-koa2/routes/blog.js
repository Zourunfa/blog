const router = require('koa-router')()


const loginCheck = require('../middleware/loginCheck')
const {SuccessModel,ErrorModel}=require('../model/resModel')
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}=require('../controller/blog')

router.prefix('/api/blog') //路径的前缀

router.get('/list', async (ctx,next) => {

    let author =ctx.query.author || ''
    const keyword =ctx.query.keyword||''
    
    if(ctx.query.isadmin){
      console.error(('is admin but no login'));
      
      if(ctx.session.username == null){  
        ctx.body = new ErrorModel('未登录')
        return
      }
      author=ctx.session.username
      
    }
    const listData  =  await getList(author,keyword)
    ctx.body = new SuccessModel(listData)
  });


  
router.get('/detail',async (ctx,next)=>{
    // console.log(req.query.id)
    const data= await getDetail(ctx.query.id)
    ctx.body =  new SuccessModel(data)
  })
  
  
  router.post('/new', loginCheck,async(ctx,next) => {
    const body = ctx.request.body
    body.author = ctx.session.username
    const data = await newBlog(body)
    ctx.body = new SuccessModel(data)
            
      
  })
  

  router.post('/update', loginCheck,async(ctx,next) => {
    const val = await updateBlog(ctx.query.id, ctx.request.body)
    
    if(val){
        ctx.body = new SuccessModel()
    }else{
        ctx.body = new ErrorModel('更新失败')
    }
  })
  
  
  router.post('/del',loginCheck,async (ctx,next)=>{
    const author=ctx.session.username
    const val =await delBlog(ctx.query.id,author)
    if(val){
        ctx.body = new SuccessModel()
    }else{
        ctx.body = new ErrorModel('删除失败')
    }
  })

module.exports =router