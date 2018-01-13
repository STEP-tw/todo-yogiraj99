let ToDoItem = function (ownId,description) {
  this.id=ownId;
  this.description=description;
  this.state=state;
}

ToDoItem.prototype.toHtml = function () {
  return `<p class=todoItem id='${this.id}'>${this.description}</p>`;
};

module.exports = ToDoItem;
