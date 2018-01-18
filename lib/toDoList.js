const ToDoItem = require('./toDoItem.js');
let ToDoList = function (title,description) {
  this.title=title;
  this.description=description;
  this.toDoItems={};
}

ToDoList.prototype.addToDoItem = function (toDoItemId,toDoItemDescription) {
  this.toDoItems[toDoItemId]=new ToDoItem(toDoItemId,toDoItemDescription);
};

ToDoList.prototype.addToDoItems = function (toDoItems) {
  let that=this;
  let toDoItemIds=Object.keys(toDoItems);
  toDoItemIds.forEach((toDoItemId)=>{
    that.addToDoItem(toDoItems[toDoItemId]);
  });
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

ToDoList.prototype.deleteToDoItem = function (toDoItemId) {
  delete this.toDoItems[toDoItemId];
  return true;
}

module.exports = ToDoList;
