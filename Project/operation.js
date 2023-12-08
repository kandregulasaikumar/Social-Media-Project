import mysql from 'mysql2'

 const connection = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'password',
    database:'social_media'
}).promise()

 export async function readPosts(){
    const output = await connection.query("select * from posts")
    return output[0]
}
//  const result = await readPosts ()
//  console.log(result)

export async function readUser (profile){ // edi verife cheyaam kosam

    const output = await connection.query("select * from users where profile ='"+profile+"'")
    return output[0]
 }

 export async function insertUser(name , profile,headline, password){ // new user insert cheyyadinki
   
const output = await connection.query("insert into users (name , profile,headline, password) values ('"+name+"','"+profile+"', '"+headline+"','"+password+"')")

 }

//posts

export async function insertPosts(profile ,content,){ // new user insert cheyyadinki
   
    const output = await connection.query("insert into posts (profile,content, likes,shares) values ('"+profile+"','"+content+"',0,0 )")
    
}


export async function likefun(content){
    const output = await connection.query("select likes from posts where content='"+content+"'")
const likes = output[0][0].likes
const incLikes= likes+1
await connection.query("update posts set likes="+incLikes+" where content='"+content+"'")
}

export async function sharefun(content){
    const output = await connection.query("select shares from posts where content='"+content+"'")
    const shares = output[0][0].shares
    const incShares= shares+1
    await connection.query("update posts set shares="+incShares+" where content='"+content+"'")

}


export async function deleteFun(content) {
    await connection.query("delete from posts where content='" + content + "'");
}
