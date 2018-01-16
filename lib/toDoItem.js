let ToDoItem = function (ownId,description,state) {
  this.id=ownId;
  this.description=description;
  this.state=state||"notdone";
}

ToDoItem.prototype.markAsDone = function () {
  return this.state="done";
};

ToDoItem.prototype.markAsNotdone = function () {
  return this.state="notdone";
};

ToDoItem.prototype.isDone = function () {
  return this.state=="done";
}

module.exports = ToDoItem;
