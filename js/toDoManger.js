let ToDoManager = function () {
  this.toDoLists={};
  this.filePath=filePath;
}

ToDoManager.prototype.loadToDoLists = function () {
  let toDoLists=fs.readFileSync(this.filePath);
  return toDoLists;
};

ToDoManager.prototype.storeToDoLists = function () {
  let toDoLists=JSON.stringify(this.toDoLists);
  fs.writeFileSync(this.filePath,toDoLists);
}

ToDoManager.prototype.createToDoList = function (toDoTitle,toDoDescription) {
  this.toDoLists[toDoTitle]:{
    description:toDoDescription
  }
  this.storeToDoLists();
};
