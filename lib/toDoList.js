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
  let toDoItemsKeys=Object.keys(this.toDoItems);
  let htmlFormat="<div>"+this.toHtmlWithOnlyDescription();
  let that=this;
  htmlFormat+=this.getAllToDoItemsInHtml();
  return htmlFormat+"</div>";
}

ToDoList.prototype.getAllToDoItemsInHtml = function () {
  let that=this;
  let toDoItemsKeys=Object.keys(this.toDoItems);
  return toDoItemsKeys.map((toDoItemTitle)=>{
    let toDoItem=that.toDoItems[toDoItemTitle];
    return toDoItem.toHtml();
  }).join("/n");
}

ToDoList.prototype.toHtmlEditFormat = function () {
  let title=this.title;
  let description=this.description;
  let toDoEditTemp=`<input type="text" name="Title" value="${title}">
  <input type="text" name="Description" value="${description}">
  <input type="submit">`;
  return toDoEditTemp;
}

ToDoList.prototype.toHtmlWithOnlyDescription = function () {
  return `<h4>${this.title}</h4>Description:${this.description}`;
}

module.exports = ToDoList;
