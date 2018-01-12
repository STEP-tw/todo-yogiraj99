let ToDoItem = function (ownId,description,state) {
  this.id=ownId;
  this.description=description;
  this.state=state;
}

ToDoItem.prototype.toHtml = function () {
  return `<td id='${this.id}'>${this.description}</td>`;
};
