const fs = require('fs');
const webapp = require('./webapp.js');
const ToDoManager = require('./js/toDoManager.js');

const PORT=8000;

let registered_users = [{userName:'yogi',name:'Yogiraj_Tambake'}];

let loginTemplate = fs.readFileSync("./templates/loginTemplate.html","utf8");

let app=webapp.create();

let toDoManager=new ToDoManager("./data/toDo.JSON");

let serveIndexForRoot = function (req,res) {
  if (req.url=='/') req.url='/login';
}

let isSameMessageInCookie = function (req,message) {
  return req.cookies.message==message;
}

let toS = o=>JSON.stringify(o,null,2);

timeStamp = ()=>{
  let t = new Date();
  return `${t.toDateString()} ${t.toLocaleTimeString()}`;
}

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

app.use(serveIndexForRoot);
app.use(loadUser);
app.use(logRequest);

app.get("/login",(req,res)=>{
  let message="This is a Login Page";
  if (isSameMessageInCookie(req,"logInFailed")) {
    message="logInFailed";
  }
  res.statusCode=200;
  res.setHeader("Content-Type","text/html");
  let loginPage=loginTemplate.replace(/MESSAGE/,message);
  res.write(loginPage);
  res.end();
})

app.get("/home",(req,res)=>{
  toDoManager.load()
  let home=fs.readFileSync("./public/home.html","utf8");
  let toDoLists=toDoManager.getToDoListInHtmlForm();
  home=home.replace(/TODOLISTS/,toDoLists)
  res.setHeader("Content-Type","text/html");
  res.statusCode=200;
  res.write(home);
  res.end();
})

app.get("/createAToDo",(req,res)=>{
  let toDoViewTemp=fs.readFileSync("./public/toDoView.html","utf8");
  toDoView=toDoViewTemp.replace("MESSAGE","createAToDo<br><br><br><br><br>");
  res.setHeader("Content-Type","text/html");
  res.statusCode=200;
  res.write(toDoView);
  res.end();
})

app.get("/logout",(req,res)=>{
  res.setHeader('Set-Cookie', [`logInFailed=false;Expires=${new Date(1).toUTCString()}`, `sessionid=0;Expires=${new Date(1).toUTCString()}`]);
  res.redirect("/login");
})

app.post('/login',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(user) {
    let sessionid = new Date().getTime();
    res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
    user.sessionid = sessionid;
    res.redirect("/home")
    res.end();
    return;
  }
  res.setHeader('Set-Cookie',`message=logInFailed;Max-Age=5`);
  res.redirect("/login");
});

app.post("/createToDo",(req,res)=>{
  let title=req.body.Title;
  let description=req.body.Description;
  console.log(req.body);
  toDoManager.createToDoList(title,description);
  res.redirect("/home")
})

module.exports = app;
