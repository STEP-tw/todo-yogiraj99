const fs = require('fs');
const ToDoList = require('./toDoList.js');

let ToDoManager = function (filePath) {
  this.toDoLists={};
  this.filePath=filePath;
}

ToDoManager.prototype.load = function () {
  let toDoLists={};
  try {
    let toDoListsData=fs.readFileSync(this.filePath,"utf8");
    toDoLists=JSON.parse(toDoListsData);
  } catch (e) {
    if (e.messsage==`no such file or directory, open '${this.filePath}'`) {
      fs.writeFileSync(this.filePath,toDoLists,"utf8");
    }
  } finally {
    this.loadToDoLists(toDoLists)
  }
};

ToDoManager.prototype.loadToDoLists = function (toDoLists) {
  let idsOfToDoLists=Object.keys(toDoLists);
  let that=this;
  idsOfToDoLists.forEach((toDoId)=>{
    let toDoTitle=toDoLists[toDoId].title;
    let description=toDoLists[toDoId].description;
    that.addToDoList(toDoId,toDoTitle,description)
    let toDoItems=toDoLists[toDoId].toDoItems;
    that.updateItemsOfToDo(toDoId,toDoItems);
  })
}

ToDoManager.prototype.updateItemsOfToDo = function (toDoId,toDoItems) {
  let keysOfToDoItem=Object.keys(toDoItems);
  let that=this;
  keysOfToDoItem.forEach((toDoItemId)=>{
    let description=toDoItems[toDoItemId].description;
    that.updateToDoItem(toDoId,toDoItemId,description);
  })
}

ToDoManager.prototype.addInDivWithOptionsLink = function (htmlText,toDoId) {
  let viewOption=`<button><a href='/view/${toDoId}'>View</a></button>`;
  let editOption=`<button><a href=/edit/${toDoId}>Edit</a></button>`;
  let deleteOption=`<button><a href=/delete/${toDoId}>Delete</a></button>`;
  let options=`${viewOption}${editOption}${deleteOption}`;
  return `<div class=toDo id='${toDoId}'>`+options+htmlText+"</div>";
}

ToDoManager.prototype.addToDoItem = function (toDoId,toDoItemId,toDoItemDescription) {
  this.toDoLists[toDoId].addToDoItem(toDoItemId,toDoItemDescription);
  this.storeToDoLists();
}

ToDoManager.prototype.storeToDoLists = function () {
  let toDoLists=JSON.stringify(this.toDoLists);
  console.log(toDoLists);
  fs.writeFileSync(this.filePath,toDoLists,"utf8");
}

ToDoManager.prototype.addToDoList = function (toDoId,toDoTitle,toDoDescription) {
  this.toDoLists[toDoId]=new ToDoList(toDoTitle,toDoDescription);
}

ToDoManager.prototype.createToDoList = function (toDoTitle,toDoDescription) {
  let toDoId=new Date().getTime();
  this.toDoLists[toDoId]=new ToDoList(toDoTitle,toDoDescription)
  this.storeToDoLists();
};

ToDoManager.prototype.deleteToDo = function (toDoId) {
  delete this.toDoLists[toDoId];
  this.storeToDoLists();
  return true;
}

ToDoManager.prototype.editToDo = function (toDoDetails) {
  let toDo=this.toDoLists[toDoDetails.toDoId];
  toDo.changeTitle(toDoDetails.title);
  toDo.changeDescription(toDoDetails.description);
  toDo.addToDoItems(toDoDetails.toDoItems);
  this.storeToDoLists();
}

ToDoManager.prototype.updateToDoItem = function (toDoId,toDoItemId,toDoItemDescription) {
  this.toDoLists[toDoId].updateToDoItem(toDoItemId,toDoItemDescription);
}

ToDoManager.prototype.deleteToDoItem = function (toDoId,toDoItemId) {
  this.toDoLists[toDoId].deleteToDoItem(toDoItemId);
  this.storeToDoLists();
  return true;
}

module.exports = ToDoManager;
