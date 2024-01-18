const MongoClient=require("mongodb").MongoClient
const url="mongodb://127.0.0.1:27017"
const client=new MongoClient(url)
const dbs="Todo";
const cls="todo"


const db_connect=async()=>{
    const result=await client.connect();
    const db=result.db(dbs);
    const collection=db.collection(cls);
    return collection
    
}
module.exports =db_connect