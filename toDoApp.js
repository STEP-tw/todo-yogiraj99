const fs = require('fs');
const querystring = require('querystring');
const webapp = require('./webapp.js');
const ToDoManager = require('./lib/toDoManager.js');
const presentor = require('./lib/presentor');

const PORT=8000;

let registered_users = [{userName:'yogi',name:'Yogiraj_Tambake'}];

let loginTemplate = fs.readFileSync("./templates/loginTemplate.html","utf8");

let app=webapp.create();

let toDoManager=new ToDoManager("./data/toDo.JSON");

let isOneOfActions = function (actualAction) {
  let expectedActions=["view","edit","delete","add"];
  return expectedActions.some((expectedAction)=>{
    return actualAction==expectedAction;
  });
}

let splitUrlBySlash = function (url) {
  return url.split("/");
}

let viewHandler = function (req,res) {
  let toDoId=req.option
  toDoManager.load();
  let toDoDetails=toDoManager.toDoLists[toDoId];
  let toDoTemp=fs.readFileSync("./templates/toDo","utf8");
  let jsScript=`<script src=/js/view.js charset=utf-8></script>`;
  let htmlToShow=presentor.showTodo(toDoTemp,toDoDetails,toDoId,jsScript);
  res.statusCode=200
  res.setHeader("Content-Type","text/html")
  res.write(htmlToShow);
  res.end();
  return ;
}

let editHandler = function (req,res) {
  if (req.method=="GET") {
    let toDoId=req.option
    toDoManager.load();
    let toDoDetails=toDoManager.toDoLists[toDoId];
    let htmlToShow=presentor.showTodoForEditOption(toDoDetails,toDoId);
    res.statusCode=200;
    res.setHeader("Content-Type","text/html");
    res.write(htmlToShow);
    res.end();
    return ;
  }
  if (req.method=="POST") {
    let todoId=req.option;
    let toDoTitle=req.body.title;
    let toDoDescription=req.body.description;
    console.log(req.body);
    toDoManager.editToDo(todoId,toDoTitle,toDoDescription);
    res.redirect("/home");
  }
}

let deleteHandler = function (req,res) {
  let toDo=toDoManager.deleteToDo(req.option);
  res.redirect("/home")
  return ;
}

let addHandler = function (req,res) {
  let description=req.body.toDoItem;
  let toDoId=req.option;
  let toDoItemId=new Date().getTime();
  toDoManager.addToDoItem(toDoId,toDoItemId,description);
  res.statusCode=200;
  res.end();
  return ;
}

let optionHandlers = {
  "view":viewHandler,
  "edit":editHandler,
  "delete":deleteHandler,
  "add":addHandler
}

let parseUrl = function (req,res) {
  let splitedUrl=req.url.split("/");
  req.action=splitedUrl[1];
  req.option=splitedUrl[2];
  req.subOption=splitedUrl[3];
}

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
app.use(parseUrl);
app.use(loadUser);
app.use(logRequest);

app.use((req,res)=>{
  if (isOneOfActions(req.action)) {
    optionHandlers[req.action](req,res);
  }
})

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
  toDoManager.load();
  let home=fs.readFileSync("./public/home.html","utf8");
  let toDoLists=toDoManager.getAllToDoListInHtmlForm();
  home=home.replace(/TODOLISTS/,toDoLists)
  res.setHeader("Content-Type","text/html");
  res.statusCode=200;
  res.write(home);
  res.end();
})

app.get("/js/view.js",(req,res)=>{
  let jsFile=fs.readFileSync("./public/js/view.js","utf8");
  res.setHeader("Content-Type","text/javascript");
  res.statusCode=200;
  res.write(jsFile);
  res.end();
})

app.get("/css/homePage.css",(req,res)=>{
  let cssFile=fs.readFileSync("./public/css/homePage.css","utf8");
  res.setHeader("Content-Type","text/css");
  res.statusCode=200;
  res.write(cssFile);
  res.end();
})

app.get("/createAToDo",(req,res)=>{
  let toDoViewTemp=fs.readFileSync("./public/createToDo.html","utf8");
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
  toDoManager.createToDoList(title,description);
  res.redirect("/home")
})

module.exports = app;
