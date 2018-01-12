const fs = require('fs');
const ToDoList = require('./toDoList.js');

let ToDoManager = function (filePath) {
  this.toDoLists={};
  this.filePath=filePath;
}

ToDoManager.prototype.load = function () {
  let toDoListsData=fs.readFileSync(this.filePath);
  let toDoLists=JSON.parse(toDoListsData);
  this.loadToDoLists(toDoLists)
};

ToDoManager.prototype.loadToDoLists = function (toDoLists) {
  let keysOfToDoList=Object.keys(toDoLists);
  let that=this;
  keysOfToDoList.forEach((toDoKey)=>{
    let toDoTitle=toDoLists[toDoKey].title;
    let description=toDoLists[toDoKey].description;
    that.createToDoList(toDoTitle,description)
    let toDoItems=toDoLists[toDoKey].toDoItems;
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

ToDoManager.prototype.getToDoListInHtmlForm = function () {
  let toDoLists=Object.keys(this.toDoLists);
  let htmlFormat=`<h2>To-Do</h2><br><br>`
  let that=this;
  let htmlFormatOfToDos=toDoLists.map((toDoListTitle)=>{
    let toDoList=that.toDoLists[toDoListTitle];
    return toDoList.toHtml();
  });
  return htmlFormat+htmlFormatOfToDos.join("\n");
}

ToDoManager.prototype.addToDoItem = function (toDoListTitle,toDoItemDescription) {
  this.toDoLists[toDoListTitle].addToDoItem(toDoItemDescription);
}

ToDoManager.prototype.storeToDoLists = function () {
  let toDoLists=JSON.stringify(this.toDoLists);
  fs.writeFileSync(this.filePath,toDoLists);
}

ToDoManager.prototype.createToDoList = function (toDoTitle,toDoDescription) {
  this.toDoLists[toDoTitle]=new ToDoList(toDoTitle,toDoDescription)
  this.storeToDoLists();
};

module.exports = ToDoManager;
