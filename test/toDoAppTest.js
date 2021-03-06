const querystring = require('querystring');
let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.COMMENT_STORE = "./testStore.json";
let app = require('../toDoApp.js');
let th = require('./testHelper.js');

describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  })
  describe('GET /',()=>{
    it('serves the /login page',done=>{
      request(app,{method:'GET',url:'/'},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'userName:');
        th.body_does_not_contain(res,'login failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })
  describe('GET /login',()=>{
    it('serves the login page',done=>{
      request(app,{method:'GET',url:'/login'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'userName:');
        th.body_does_not_contain(res,'login failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })
  describe("POST /login",function () {
    it('serves home page',function () {
      it('serves the login page with message for a failed login',done=>{
        request(app,{method:'POST',url:'/login',body:'userName=yogi'},res=>{
          th.status_is_ok(res);
          th.should_not_have_cookie(res,'message');
          done();
        })
      })
    })
    it('serves the login page with message for a failed login',done=>{
      request(app,{method:'GET',url:'/login',headers:{'cookie':'message=logInFailed'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'userName:');
        th.body_contains(res,'logInFailed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })
  describe('GET /home',()=>{
    it('serves the home page',done=>{
      request(app,{method:'GET',url:'/home'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'HOME');
        th.body_contains(res,'createAToDo');
        th.body_does_not_contain(res,'login failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })
  describe('GET /createAToDo',()=>{
    it('serves the createAToDo page',done=>{
      request(app,{method:'GET',url:'/createAToDo'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'createAToDo');
        th.body_does_not_contain(res,'login failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })
  describe('POST /createToDo',()=>{
    let sessionid="";
    it('redirects to home page with added toDo',done=>{
      let anotherRequest=request(app,{method:'POST',url:'/createToDo',body:"Title=ToDoOfxyzApp&Description=i dont know",cookie:sessionid},res=>{
        th.should_be_redirected_to(res,"/home");
        th.should_not_have_cookie(res,'message');
        done();
      })
      request(app,{method:'GET',url:'/login'},anotherRequest=>{
        th.status_is_ok(res);
        th.body_contains(res,'userName:');
        th.body_does_not_contain(res,'login failed');
        th.should_not_have_cookie(res,'message');
        let cookieText = res.headers['Set-Cookie']
        sessionid="sessionid="+querystring.parse(cookieText).sessionid;
        anotherRequest();
      })
    })
  })
})
