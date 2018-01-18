const getAllToDoListInHtmlForm = function (toDos) {
  let toDoListsKeys=Object.keys(toDos);
  let htmlFormat=`<h2>To-Do</h2><br><br>`
  let htmlFormatOfToDos=toDoListsKeys.map((toDoId)=>{
    let toDo=toDos[toDoId];
    return toHtmlWithOnlyDescription(toDo,toDoId);
  });
  return htmlFormat+htmlFormatOfToDos.join("<br><br>");
}

const toHtmlWithOnlyDescription = function (toDoDetails,toDoId) {
  let toDoHtml=`<div id=${toDoId} class=toDo><h3>${toDoDetails.title}</h3>`;
  toDoHtml+=addOptions(toDoId)
  toDoHtml+=`<br><p>${toDoDetails.description}</p><br></div>`;
  return toDoHtml+"</div>";
}

const addOptions = function (toDoId) {
  let viewOption=`<button><a href='/view/${toDoId}'>View</a></button>`;
  let editOption=`<button><a href=/edit/${toDoId}>Edit</a></button>`;
  let deleteOption=`<button><a href=/delete/${toDoId}>Delete</a></button>`;
  let options=`${viewOption}${editOption}${deleteOption}`;
  return options;
}

const showTodo = function (template,toDoDetails,toDoId,jsScript="") {
  let toDoItems=toDoDetails.toDoItems;
  template=template.replace(/JSSCRIPT/,jsScript)
  template=addToDoDetailsInTemplate(template,toDoDetails,toDoId);
  template=addToDoItemsInTemplate(template,toDoItems,toDoId);
  template=addEditOptionInTemplate(template,toDoId);
  return template;
}

const addToDoDetailsInTemplate = function (template,toDoDetails,toDoId) {
  let toDoHtml=`<div id=${toDoId} class=toDoDiv><h3>${toDoDetails.title}</h3>`;
  toDoHtml+=`<p>${toDoDetails.description}</p><br></div>`;
  return template.replace(/TODODETAILS/,toDoHtml);
}

const addToDoItemsInTemplate = function (template,toDoItems,toDoId) {
  let toDoItemsInHtmlForm=`<ol><h5>toDoItems</h5>`;
  toDoItemsInHtmlForm+=getAllTodoItemsAsHtml(toDoItems,toDoId)+"</ol>";
  return template.replace(/TODOITEMS/,toDoItemsInHtmlForm);
}

const getAllTodoItemsAsHtml = function (toDoItems,toDoId) {
  let toDoItemsKeys=Object.keys(toDoItems);
  return toDoItemsKeys.map((toDoItemId)=>{
    let toDoItem=toDoItems[toDoItemId];
    let doneState=toDoItem.isDone();
    let checkBox=`<input type=checkbox name=${toDoItemId} >`;
    let toDoItemDescription=toDoItem.description;
    let deleteOption=`<button><a href=/delete/${toDoId}/${toDoItemId}>Delete</a></button>`;
    let toDoItemHtmlForm=`<li>${checkBox}${toDoItemDescription}  ${deleteOption}</li>`;
    return toDoItemHtmlForm;
  }).join("<br>");
}

const addEditOptionInTemplate = function (template,toDoId) {
  let inputbox=`<input id=toDoItemInputBox value=""></input>`;
  let addItemButton=`<button onclick=addToDoItem()>addToDoItem</button><br>`;
  let editOption=`<br><a href=/edit/${toDoId}>Edit</a><br>`;
  let options=inputbox+addItemButton+editOption;
  return template.replace(/OPTIONS/,options);
}

const showTodoForEditOption = function (template,toDoDetails,toDoId,jsScript="") {
  let toDoItems=toDoDetails.toDoItems;
  template=template.replace(/JSSCRIPT/,jsScript)
  template=addToDoDetailsInForm(template,toDoDetails,toDoId);
  template=addAllTodoItemsInTextBox(template,toDoItems);
  template=addOptionsInTemplate(template,toDoId);
  template+="<form>"
  return template;
}

const addToDoDetailsInForm = function (template,toDoDetails,toDoId) {
  let htmlToShow =`<form action=/edit/${toDoId} method=post id=toDoform>`;
  htmlToShow +=`Title:<input type=text name=title value=${toDoDetails.title}></input><br><br>`;
  htmlToShow +=`Description:<input type=text name=description value=${toDoDetails.description}></input>`;
  return template.replace(/TODODETAILS/,htmlToShow);
}

const addAllTodoItemsInTextBox = function (template,toDoItems) {
  let toDoItemsKeys=Object.keys(toDoItems);
  let toDoItemsInHtmlForm=toDoItemsKeys.map((toDoItemId)=>{
    let toDoItem=toDoItems[toDoItemId];
    let checkBox=`<input type=checkbox name=${toDoItemId} >`;
    return `<br><br>${checkBox}<input type=text name=${toDoItemId} value='${toDoItem.description}'>`;
  }).join("");
  return template.replace(/TODOITEMS/,toDoItemsInHtmlForm);
}

const addOptionsInTemplate = function (template,toDoId) {
  let saveOption=`<input type=submit value=Save>`;
  let cancelOption=`<a href=/view/${toDoId}>Cancel</a>`;
  let options=`${saveOption}${cancelOption}`;
  return template.replace(/OPTIONS/,options);
}

exports.showTodo = showTodo;
exports.showTodoForEditOption = showTodoForEditOption;
exports.getAllToDoListInHtmlForm = getAllToDoListInHtmlForm;
