
// 这是项目代码的第一层，全部为createServer方面的逻辑
// 和业务代码没有关系

const http=require('http')

const PORT=3000
const serverHandle=require('../app')

const server=http.createServer(serverHandle)
server.listen(PORT,()=>{
    console.log('running');
})