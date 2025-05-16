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
        //Remueve las tareas del LOCAL STORAGE
        removeFromLocalStorage(taskItem.firstChild.textContent);
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
        //Traer el estado actual para guardarlo en LOCAL STORAGE
        updateLocalStorage();
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

//FUNCIONES PARA QUE AL REFRESCAR Y ELIMINAR SE GUARDEN LOS CAMBIOS EN EL LOCAL STORAGE

//Guardar EDITS de tareas
function updateLocalStorage(){
    //Trae todos los elementos que coincidan
    //Convierte la lista de nodos en un array que SI puedo manipular

    //SOLUCIÓN DE CONFLICTO: Siempre se incluye la función harcodeada en HTML, queremos que al editar o eliminar tareas no nos salga esta

    //El filter evita que en el código ocurra el BUG donde se guardaba en el local storage la lista hardcodeada en html, al editar y borrar elementos ya no se guardará esta primera tarea
    const tasks = Array.from(taskList.querySelectorAll("li")).filter((li) => li.querySelector("p").id !== "task-harcodeada").map((li) => li.querySelector("p").firstChild.textContent);
    console.log(tasks);
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Borrar tareas ELIMINADAS en el localStorage
function removeFromLocalStorage(taskContent) {
    //Obtiene el estado actual del LOCAL STORAGE para manipular estos elementos
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    //Nuevo ARRAY que comprueba si la tarea actual es diferente al contenido que se quiere eliminar
    //Deja las tareas que PERSISTEN y quita a las que no
    const updateTasks = tasks.filter((task) => task !== taskContent);

    //Vuelve a convertir a JSON para que el localStorage actualice el cambio con los elementos BORRADOS
    localStorage.setItem("tasks", JSON.stringify(updateTasks));
}

//DARK MODE - BUTTON SWITCH

//Seleccionar botón switch
const toggleButton = document.getElementById("toggle-theme-btn");
//Seleccionar el contenedor padre del tema
const currentTheme = localStorage.getItem("theme");
console.log(currentTheme);

toggleButton.addEventListener("click", () =>{
    document.body.classList.toggle("dark-theme");

    //Validación del tema
    const themeToggle = document.body.classList.contains("dark-theme") ? "dark" : "Light";

    //Guardar en el storage
    localStorage.setItem("theme", themeToggle);

});

if(currentTheme === "dark"){
    document.body.classList.add("dark-theme");
} 