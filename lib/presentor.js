const showTodo = function (template,toDoDetails,toDoId,jsScript="") {
  let toDoItems=toDoDetails.toDoItems;
  template=template.replace(/JSSCRIPT/,jsScript)
  template=addToDoDetailsInTemplate(template,toDoDetails,toDoId);
  template=addToDoItemsInTemplate(template,toDoItems);
  template=addOptionsInTemplate(template,toDoId);
  return template;
}

const addOptionsInTemplate = function (template,toDoId) {
  let inputbox=`<input id=toDoItemInputBox value=""></input>`;
  let addItemButton=`<button onclick=addToDoItem()>addToDoItem</button><br>`;
  let editOption=`<button><a href=/edit/${toDoId}>Edit</a></button><br>`;
  let options=inputbox+addItemButton+editOption;
  return template.replace(/OPTIONS/,options);
}

const addToDoDetailsInTemplate = function (template,toDoDetails,toDoId) {
  let toDoHtml=`<div id=${toDoId} class=toDoDiv><h3>${toDoDetails.title}</h3>`;
  toDoHtml+=`<p>${toDoDetails.description}</p><br></div>`;
  return template.replace(/TODODETAILS/,toDoHtml);
}

const addToDoItemsInTemplate = function (template,toDoItems) {
  let toDoIetemsHtml=`<ol><h5>toDoItems</h5>`;
  toDoIetemsHtml+=getAllTodoItemsAsHtml(toDoItems)+"</ol>";
  return template.replace(/TODOITEMS/,toDoIetemsHtml);
}

const showTodoForEditOption = function (toDoDetails,toDoId) {
  let title=toDoDetails.title;
  let toDoItems=toDoDetails.toDoItems;
  let description=toDoDetails.description;
  let htmlToShow=`<script src="/js/edit.js" charset="utf-8"></script>`;
  htmlToShow+=`<div class=toDo><form action=/edit/${toDoId} id=toDoForm method=post>`;
  htmlToShow+=`<input type=text name=title value=${title}></input>`;
  htmlToShow+=`<input type=text name=description value=${description}></input><br>`;
  htmlToShow+=`<h5>toDoItems</h5>`;
  let toDoItemsHtmlForm=showAllTodoItemsInTextBox(toDoItems);
  htmlToShow+=toDoItemsHtmlForm+"<br><br>";
  htmlToShow+"</form>";
  let saveOption=`<button type="submit" form="toDoForm">Submit</button>`;
  let cancelOption=`<a href=/view/${toDoId}>Cancel</a>`;
  options=saveOption+cancelOption;
  return htmlToShow+options;
}

const showAllTodoItemsInTextBox = function (toDoItems) {
  let toDoItemsKeys=Object.keys(toDoItems);
  return toDoItemsKeys.map((toDoItemId)=>{
    let toDoItem=toDoItems[toDoItemId];
    return `<input type=text name=toDoItem value='${toDoItem.description}'></input>`;
  }).join("<br><br>");
}

const getAllTodoItemsAsHtml = function (toDoItems) {
  let toDoItemsKeys=Object.keys(toDoItems);
  return toDoItemsKeys.map((toDoItemId)=>{
    let toDoItem=toDoItems[toDoItemId];
    let toDoItemHtmlForm=`<li>${toDoItem.description}</li>`;
    return toDoItemHtmlForm;
  }).join("");
}

exports.showTodo = showTodo;
exports.showTodoForEditOption = showTodoForEditOption;
