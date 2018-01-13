const fs = require('fs');
const ToDoList = require('./toDoList.js');

let ToDoManager = function (filePath) {
  this.toDoLists={};
  this.filePath=filePath;
}

ToDoManager.prototype.load = function () {
  let toDoLists={};
  try {
    let toDoListsData=fs.readFileSync(this.filePath);
    toDoLists=JSON.parse(toDoListsData);
  } catch (e) {
    if (e.messsage==`no such file or directory, open '${this.filePath}'`) {
      fs.writeFileSync(this.filePath,toDoLists,"utf8");
    }
  } finally {
    this.loadToDoLists(toDoLists)
  }
};

ToDoManager.prototype.getToDoListInHtmlForm = function (toDoKey) {
  return this.toDoLists[toDoKey].toHtml();
}

ToDoManager.prototype.loadToDoLists = function (toDoLists) {
  let keysOfToDoList=Object.keys(toDoLists);
  let that=this;
  keysOfToDoList.forEach((toDoId)=>{
    let toDoTitle=toDoLists[toDoId].title;
    let description=toDoLists[toDoId].description;
    that.addToDoList(toDoId,toDoTitle,description)
    let toDoItems=toDoLists[toDoId].toDoItems;
    that.addItemsOfToDo(toDoTitle,toDoItems);
  })
}

ToDoManager.prototype.addItemsOfToDo = function (toDoTitle,toDoItems) {
  let keysOfToDoItem=Object.keys(toDoItems);
  keysOfToDoItem.forEach((toDoItemId)=>{
    let description=toDoItems[toDoItemId].description;
    that.addToDoItem(toDoTitle,description);
  })
}

ToDoManager.prototype.getAllToDoListInHtmlForm = function () {
  let toDoListsKeys=Object.keys(this.toDoLists);
  let htmlFormat=`<h2>To-Do</h2><br><br>`
  let that=this;
  let htmlFormatOfToDos=toDoListsKeys.map((toDoId)=>{
    let toDoList=that.toDoLists[toDoId];
    let toDoHtml=toDoList.toHtmlWithOnlyDescription();
    return that.addInDivWithOptionsLink(toDoHtml,toDoId);
  });
  return htmlFormat+htmlFormatOfToDos.join("<br><br>");
}

ToDoManager.prototype.addInDivWithOptionsLink = function (htmlText,toDoId) {
  let viewOption=`<button><a href='/view/${toDoId}'>View</a></button>`;
  let editOption=`<button><a href=/edit/${toDoId}>Edit</a></button>`;
  let deleteOption=`<button><a href=/delete/${toDoId}>Delete</a></button>`;
  let options=`${viewOption}${editOption}${deleteOption}`;
  return `<div class=toDo id='${toDoId}'>`+options+htmlText+"</div>";
}

ToDoManager.prototype.addToDoItem = function (toDoId,toDoItemDescription) {
  this.toDoLists[toDoId].addToDoItem(toDoItemDescription);
}

ToDoManager.prototype.storeToDoLists = function () {
  let toDoLists=JSON.stringify(this.toDoLists);
  fs.writeFileSync(this.filePath,toDoLists);
}

ToDoManager.prototype.addToDoList = function (toDoId,toDoTitle,toDoDescription) {
  this.toDoLists[toDoId]=new ToDoList(toDoTitle,toDoDescription)
  this.storeToDoLists();
}

ToDoManager.prototype.createToDoList = function (toDoTitle,toDoDescription) {
  let toDoId=new Date().getTime();
  this.toDoLists[toDoId]=new ToDoList(toDoTitle,toDoDescription)
  this.storeToDoLists();
};

ToDoManager.prototype.getToDoInEditFormat = function (toDoId) {
  let toDoForm=`<form action="/edit/${toDoId}" method="post">`
  return toDoForm+this.toDoLists[toDoId].toHtmlEditFormat()+"</form>";
}

ToDoManager.prototype.deleteToDo = function (toDoId) {
  delete this.toDoLists[toDoId];
  this.storeToDoLists();
}

module.exports = ToDoManager;
