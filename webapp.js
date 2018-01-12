const querystring = require('querystring');

const toKeyValue = kv=>{
    let parts = kv.split('=');
    return {key:parts[0],value:parts[1]};
};
const accumulate = (o,kv)=> {
  o[kv.key] = kv.value;
  return o;
};
const parseBody = text=> text && text.split('&').map(toKeyValue).reduce(accumulate,{}) || {};

const parseBodyUsingQuerryString = function (text){
  let commentDetails=querystring.parse(text);
  return commentDetails;
}

let redirect = function(path){
  console.log(`redirecting to ${path}`);
  this.statusCode = 302;
  this.setHeader('location',path);
  this.end();
};
const parseCookies = text=> {
  return text && text.split(';').map(toKeyValue).reduce(accumulate,{}) || {};
}
let invoke = function(req,res){
  let handler = this._handlers[req.method][req.url];
  if(!handler){
    res.statusCode = 404;
    res.write('File not found!');
    res.end();
    return;
  }
  handler(req,res);
}
const initialize = function(){
  this._handlers = {GET:{},POST:{}};
  this._preprocess = [];
};
const get = function(url,handler){
  this._handlers.GET[url] = handler;
}
const post = function(url,handler){
  this._handlers.POST[url] = handler;
};
const use = function(handler){
  this._preprocess.push(handler);
};

const main = function(req,res){
  res.redirect = redirect.bind(res);
  req.cookies = parseCookies(req.headers.cookie||'');
  let content="";
  req.on('data',data=>content+=data.toString())
  req.on('end',()=>{
    req.body = parseBodyUsingQuerryString(content);
    content="";
    // debugger;
    this._preprocess.forEach(middleware=>{
      if(res.finished) return;
      middleware(req,res);
    });
    if(res.finished) return;
    invoke.call(this,req,res);
  });
};

let create = ()=>{
  let rh = (req,res)=>{
    main.call(rh,req,res)
  };
  initialize.call(rh);
  rh.get = get;
  rh.post = post;
  rh.use = use;
  return rh;
}
exports.create = create;
