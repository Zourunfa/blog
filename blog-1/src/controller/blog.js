const{exec}=require('../db/mysql')
const xss=require('xss')

const getList = (author, keyword) => {
    // 写1=1是因为 占位置 防止报错
    // 
    let sql=`select * from blogs where 1=1 `
    if(author){
        sql += `and author='${author}' `
    }
    if(keyword){
         sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    // 返回的是promise
    return exec(sql)
   
}

// const getList = (author, keyword) => {
//     let sql = `select * from blogs where 1=1 `
//     if (author) {
//         sql += `and author='${author}' `
//     }
//     if (keyword) {
//         sql += `and title like '%${keyword}%' `
//     }
//     sql += `order by createtime desc;`

//     // 返回 promise
//     return exec(sql)
// }

const getDetail=(id)=>{
    const sql=`select * from blogs where id='${id}' `
    return exec(sql).then(rows=>{
        return rows[0]
    })

}

const newBlog=(blogData={})=>{
    // blogData是一个博客对象，包含title content 等属性
   const title=xss(blogData.title)
   console.log('titile is ',title)
   const content=blogData.content
   const author=blogData.author
   const createtime=Date.now()/1000
   const sql=`
   insert into blogs (title,content,createtime,author)
   values('${title}','${content}','${createtime}','${author}')
   `
   return exec(sql).then(insertData=>{
       console.log('inserData:',insertData)
       return {
           id:insertData.insertId
       }
   })

}

const updataBlog=(id,blogData={})=>{
    // // id就是要更新博客的id
    // console.log('updata blog',id,blogData)
    const title=blogData.title
    const content=blogData.content

    const sql=`
    update blogs set title='${title}',content='${content}' where id='${id}'
    `
    return exec(sql).then(updateData=>{
        console.log('updateData is',updateData)
        console.log('updateData.affecteRows:',updateData.affectedRows)
        if(updateData.affectedRows>0){
            console.log(updateData.affecteRows>0)
            return true
        }
        return false
    })
   
}

const delBlog=(id,author)=>{
    //  id 就是要删除博客的id 
    // const sql=`delete from blogs where id='${id}' and author='${author}'; `
    const sql = `delete from blogs where id='${id}' and author='${author}';`
    return exec(sql).then(delData=>{
        console.log('delData is ', delData)
        if(delData.affectedRows>0){
            return true
        }
        return false
    })


}
module.exports={
    getList,
    getDetail,
    newBlog,
    updataBlog,
    delBlog
}