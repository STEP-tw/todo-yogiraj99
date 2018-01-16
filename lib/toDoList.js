const ToDoItem = require('./toDoItem.js');
let ToDoList = function (title,description) {
  this.title=title;
  this.description=description;
  this.toDoItems={};
}

ToDoList.prototype.addToDoItem = function (toDoItemId,toDoItemDescription) {
  this.toDoItems[toDoItemId]=new ToDoItem(toDoItemId,toDoItemDescription);
};

ToDoList.prototype.getAllToDoItemsInHtml = function () {
  let that=this;
  let toDoItemsKeys=Object.keys(this.toDoItems);
  return toDoItemsKeys.map((toDoItemId)=>{
    let toDoItem=that.toDoItems[toDoItemId];
    return toDoItem.toHtml();
  }).join("");
}

ToDoList.prototype.changeTitle = function (newTitle) {
  this.title=newTitle;
}

ToDoList.prototype.changeDescription = function (newDescription) {
  this.description=newDescription;
}

ToDoList.prototype.updateToDoItem = function (toDoItemId,toDoItemDescription) {
  this.toDoItems[toDoItemId]=new ToDoItem(toDoItemId,toDoItemDescription);
};

module.exports = ToDoList;
