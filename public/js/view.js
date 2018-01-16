let addToDoItem = function () {
  let text=document.getElementById("toDoItemInputBox").value;
  let toDoId=document.getElementsByClassName('toDoDiv')[0].id
  let toDoItem=`toDoItem=${text}`;
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let newToDoItem=document.createElement("li");
      newToDoItem.innerText=text;
      document.getElementsByTagName("ol")[0].appendChild(newToDoItem);
    }
  };
  xhttp.open("POST",`/add/${toDoId}`, true);
  xhttp.send(toDoItem);
}
