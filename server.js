//套件引入 變數設定
const express = require("express");
const app = express();
const mongo = require("mongodb");
const uri = "mongodb+srv://root:0000@mycluster.9pcepz7.mongodb.net/?retryWrites=true&w=majority"; //資料庫連線位置
const hostname = "localhost", port = 3000;


//資料庫連接
const client = new mongo.MongoClient(uri,{useNewUrlParser:true, useUnifiedTopology:true});
let db = null;
async function initDB(){
    await client.connect();
    console.log("資料庫連線成功");
    db = client.db("messageBoard");
}
initDB();


//伺服器設定
app.set("view engine","ejs");
app.set("Views","./Views");
app.use(express.static("public"));
app.use (express.urlencoded({extended:true}));


//路由處理
//-主頁
app.get("/",async (req,res)=>{
    const collection = db.collection("messages");
    let resual = await collection.find({});
    let msgList = [];
    await resual.forEach((messages)=>{
        msgList.push(messages)
    })
    res.render("index.ejs",{msgList:msgList})
});
//-發送訊息
app.post("/in",async (req,res)=>{
    const name = req.body.name;
    const msg = req.body.msg;
    const guest = "不具名的訪客";
    const date = new Date().toString();
    const collection = db.collection("messages");
    const count = await collection.countDocuments({}) + 1;
    if(name == ""){
        collection.insertOne({
            no:count,name:guest,msg:msg,date:date,
        })
    }else{
        collection.insertOne({
            no:count,name:name,msg:msg,date:date,
        })
    }
    
    res.redirect("/");
});


//伺服器啟動 
app.listen(port,hostname ,() => {
    console.log(`Server started in http://${hostname}:${port}`);
});