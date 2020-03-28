var express = require('express');
var router = express.Router();
const loginCheck = require('../middleware/loginCheck')


const {SuccessModel,ErrorModel}=require('../model/resModel')
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}=require('../controller/blog')


router.get('/list', function(req, res, next) {
  let author =req.query.author || ''
  const keyword =req.query.keyword||''
  
  if(req.query.isadmin){
    console.console.error(('is admin,but no login'));
    
    if(req.session.username == null){  
      req.json(
        new ErrorModel('未登录')
      )
      return
    }
    author=req.session.username
    
  }

  console.log(req.session)

 const result =getList(author,keyword)
 return result.then(listData=>{
   res.json(
     new SuccessModel(listData)
   )
 })

});


router.get('/detail',(req,res,next)=>{
  console.log(req.query.id)
  const result=getDetail(req.query.id)
  return result.then(data=>{
    res.json(
      new SuccessModel(data)
    )
  })
})


// router.post('/new',loginCheck,(req,res,next)=>{
//   req.body.author=req.session.username
//   const result = newBlog(req.body)
//   return result.then(data=>{
//     res.json(
//       new SuccessModel(data)
//     )
//   })
// })

router.post('/new', loginCheck,(req, res, next) => {
  req.body.author = req.session.username
  const result = newBlog(req.body)
  return result.then(data => {
      res.json(
          new SuccessModel(data)
      )
  })
})

// router.post('/update',loginCheck,(req,res,next)=>{
//   const result =updateBlog(req.query.id , req.body)
//   return result.then(val=>{
//     if(val){
//       res.json(
//         new SuccessModel()
//       )}
//       else{
//         res.json(
//           new ErrorModel('更新失败')
//         )
//     }
//   })
// })
router.post('/update', loginCheck, (req, res, next) => {
 
  const result = updateBlog(req.query.id, req.body)
  return result.then(val => {

    console.log(val)
      if (val) {   
          res.json(
              new SuccessModel()
          )
      } else {
          res.json(
              new ErrorModel('更新博客失败')
          )
      }
  })
})


router.post('/del',loginCheck,(req,res,next)=>{
  const author=req.session.username
  const result =delBlog(req.query.id,author)
  return result.then(val=>{
    if(val){
      res.json(
        new SuccessModel()
      ) 
    }else{
      res.json(
         new ErrorModel('删除失败')
      )
      
    }
  }
  )
})


module.exports = router;
