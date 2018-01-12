const fs = require('fs');
const webapp = require('./webapp.js');


const PORT=8000;

let registered_users = [{userName:'yogi',name:'Yogiraj_Tambake'}];

let loginTemplate = fs.readFileSync("./templates/loginTemplate.html","utf8");

let app=webapp.create();

let serveIndexForRoot = function (req,res) {
  if (req.url=='/') req.url='/login';
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
  res.statusCode=200;
  res.setHeader("Content-Type","text/html");
  loginTemplate=loginTemplate.replace(/MESSAGE/,"This is a Login Page");
  res.write(loginTemplate);
  res.end();
})

app.get("/home",(req,res)=>{
  res.statusCode=200;
  res.write("");
  res.end();
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
  res.redirect("/login");
});

module.exports = app;
