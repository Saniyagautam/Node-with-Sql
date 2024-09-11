const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express=require("express");
const app=express();

//for ejs
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

//for patch 
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));


const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'delta',
    password:'San@100504'
});

let getRandomUser=()=> {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
};
  //can remove also as we have inserted the dat already

// let q="Insert into user (id,username,email,password) values ?";
// let data=[];
// // let users=[[1,"san","san@","pass1"],[2,"san2","san2@","pass2"],[3,"san3","san3@","pass3"]];//manually entry
// //entry using faker
// for(let i=1;i<=100;i++){
//     data.push(getRandomUser());
    
// }

//HOME ROUTR --->first to print total entries(rows)
app.get("/",(req,res)=>{
    let q=`Select count(*) from user`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count=result[0]["count(*)"]
            res.render("home.ejs",{count});
        });
    }
    catch(err) {
        console.log(err);
        res.send("some err occurs");
    }
});

//SHOW ROUTE ( to show the details of all users except pswd)
app.get("/user",(req,res)=>{
    let q=`Select * from user`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let users=result;
            res.render("show.ejs",{users});
        });
    }
    catch(err) {
        console.log(err);
        res.send("some err occurs");
    }

})
    
//EDIT ROUTE (to edit the username)
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`Select * from user where id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            res.render("edit.ejs",{user});
        });
    }
    catch(err) {
        console.log(err);
        res.send("some err occurs");
    }
})

//UPDATE ROUTE(after edit)updation in db
app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {password:formpass,username:newusername}=req.body;
    let q=`Select * from user where id='${id}'`;
    try{

        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            if(formpass!=user.password){
                res.send("Incorrect Password");//not verified
            }
            else{
                let q2=`Update user set username='${newusername}' where id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err)throw err;
                    res.redirect("/user");
                })
            }
        });
    }
    catch(err) {
        console.log(err);
        res.send("some err occurs");
    }
})

//delete form ROUTE 
app.get("/user/:id/delete",(req,res)=>{
    let {id}=req.params;
    let q=`Select * from user where id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            res.render("delete.ejs",{user});
        });
    }
    catch(err) {
        console.log(err);
        res.send("some err occurs");
    }
})

//DELETE A USER
app.delete("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {password:formpass,email:formemail}=req.body;
    let q=`Select * from user where id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            if(formpass!=user.password && formemail!=user.email){
                res.send("Incorrect Password or email");//not verified
            }
            else{
                let q2=`delete from user where id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err)throw err;
                    res.redirect("/user");
                })
            }
        });
    }
    catch(err) {
        console.log(err);
        res.send("some err occurs");
    }
})




app.listen("8080",()=>{
    console.log("Server is listening to port 8080");
})


