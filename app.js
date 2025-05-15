//OBTENER LA INFORMACIÓN DEL FORMULARIO

//Seleccionar el Formulario (Elemento Padre)
const taskForm = document.getElementById("task-form");

//Seleccionar el TaskList (Elemento Padre) donde se irán agregando todas las tareas
const taskList = document.getElementById("task-list");

//Llamado de la función que carga las tareas que ya estaban en el LOCALSTORAGE
loadTasks();


//Agregar el evento de SUBMIY
taskForm.addEventListener("submit", (event) =>{

    //Prevenir el comportamiento por DEFAULT de refrescar la página en cada click al botón
    event.preventDefault();

    //Seleccionar el INPUT dentro del formulario
    const taskInput = document.getElementById("task-input");

    //Agarra el valor introducido en teclado por el usuario
    const task = taskInput.value;
    //Muestra dicho valor para confirmar que el código funciona hasta acá
    console.log(task);

    //Valida si es verdadero para agregar una nueva tarea
    if(task){
        //Agrega con APPEND la nueva tarea después de la tarea por default
        //Para esto se llama a la función createTaskElement
        taskList.append(createTaskElement(task));
        //Guarda la tarea en el LOCAL STORAGE
        storeTaskInLocalStorage(task);
        //Limpia el valor del input
        taskInput.value = "";
    }
    
});


//CREAR NUEVAS TAREAS

function createTaskElement(task){
    //Selecciona un elemento padre li para crear la nueva tarea
    const li = document.createElement("li");
    //Crear el elemento p (donde se agregará el texto para que no modifique el diseño de las list)
    const p = document.createElement("p");

    
    //Agregar el texto de la tarea (recibido por input)
    p.textContent = task;
    // Agregar el párrafo al li
    li.appendChild(p);

    //A cada li se le crean los dos botones de modificaciones
    li.append(createButton("Delete","delete-btn"), createButton("Edit", "edit-btn"));
        return li;
}

//CREAR LOS BOTONES DE CADA TAREA NUEVA
//Parámetros el texto, y la clase
function createButton(text, className) {
    //Crea el nuevo botón 1 sola vez
    const btn = document.createElement("button");
    //Le agrega el texto al botón
    btn.textContent = text;
    //Le agrega la clase al botón
    btn.className = className;
    return btn;
}


//INTERACCIÓN CON BOTONES

//Evento que viene desde el padre y él decide en qué botón ocurre el evento
taskList.addEventListener("click", (event) =>{

    //Valida si contiene la clase del botón para eliminar tareas
    if(event.target.classList.contains("delete-btn")){
        //LLAMADO a la función para REMOVER la tarea
        deleteTask(event.target.parentElement);
            //Valida si contiene la clase del botón para editar tareas
    }else if(event.target.classList.contains("edit-btn")){
        editTask(event.target.parentElement);
    }
})

//taskItem: el parámetro seleccionado

//Función para BORRAR TAREAS
function deleteTask(taskItem){

    //Valida con el usuario
    if(confirm("¿Estás seguro de borrar esta tarea?")){
        //REMUEVE EL ELEMENTOS
        taskItem.remove();
    }
}

//Función para EDITAR TAREAS
function editTask(taskItem){

    //Valida con el usuario
    //Me trae el contenido del texto que tiene la tarea para editarla
    const editedTask = prompt("Edita tu tarea:", taskItem.querySelector("p").firstChild.textContent);

    if(editedTask !== null){
        //Si es diferente a null REESCRIBE EL CONTENIDO
        taskItem.querySelector("p").firstChild.textContent = editedTask;
    }
}

//PERSISTENCIA: que se guarden los cambios aunque yo refresque la página

//GUARDAR LAS TAREAS QUE SE VAN GENERANDO EN EL LOCAL STORAGE
function storeTaskInLocalStorage (task){
    //Ir guardando las tareas
    //JSON.pase es un método que convierte una cadena de texto en formato JSON a un objeto o array en JavaScript
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    //Push de las tareas: push agrega un elemento a un array existente
    tasks.push(task);
    //Guardar como un string 
    //JSON.stringify: convierte un objeto de Javascript a texto en formato JSON
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

//INYECTAR EL LOCALSTORAGE AL DOM cuando se refresque la página
function loadTasks (){
    //Obtener los elementos del localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });
}