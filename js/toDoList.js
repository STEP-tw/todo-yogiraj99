const ToDoItem = require('./toDoItem.js');
let ToDoList = function (title,description) {
  this.title=title;
  this.description=description;
  this.toDoItems={};
}

ToDoList.prototype.addToDoItem = function (toDoItemDescription) {
  let toDoItemId="itemNo"+Object.keys(this.toDoItems).length;
  this.toDoItems[toDoItemId]=new ToDoItem(toDoItemId,toDoItemDescription);
};

ToDoList.prototype.toHtml = function () {
  let toDoItems=Object.keys(this.toDoItems);
  let htmlFormat=`<div id=toDo><h4>${this.title}</h4>${this.description}<br>`
  let that=this;
  htmlFormat+=toDoItems.map((toDoItemTitle)=>{
    let toDoItem=that.toDoItems[toDoItemTitle];
    return toDoItem.toHtml();
  }).join("/n");
  return htmlFormat+"</div>";
}

module.exports = ToDoList;
