const BASE_URL = 'https://api.imgflip.com/'

//Obtener la lista de memes
async function getMemeList() {
    const memesURL = `${BASE_URL}get_memes`;
    let data = null;
    const response = await fetch(memesURL);
    data = await response.json();
    let memeList = parseJsonResponse(data);
    return memeList;
}

//Separar los datos del mensaje
function parseJsonResponse(json) {
    let allMemesData = json.data;
    return allMemesData;
}

//Crear un array con todos los nombres de memes.
function obtenerTodosLosNombres(data) {
    let stringMemes = "";
    for (i = 0; i < data.memes.length; i++) {       
        stringMemes += data.memes[i].name;
        stringMemes += "$";      
    }
    stringMemes = stringMemes.slice(0, -1);
    window.localStorage.setItem('ListaMemes', stringMemes)
}

async function main() {
    // Cada vez que se presiona una tecla en la barra de búsqueda, se hace la búsqueda
    document.getElementById("myInput").addEventListener("keyup", search);

    // Datos 
    data = await getMemeList();

    //Obtener los nombres de los memes
    obtenerTodosLosNombres(data);

    //Crear un array con los nombres de los memes.
    var arrayMemes = (window.localStorage.getItem('ListaMemes').split('$'))
    autocomplete(document.getElementById("myInput"), arrayMemes);

    // Mostramos la data en la pantalla
    displayData(data);
}

/**
* Itera un arreglo de datos y construye una lista que muestra su contenido en
la pantalla
* cada elemento agregado se le agrega un id que es el id de cada objeto (dato)
dentro del arreglo
*/
async function displayData(data) {
    let display = "";
    for (i = 0; i < data.memes.length; i++) {
        //imagen = await getRandomImage(data[i]);
        display += `
        <ul id="${i}">
        <li><strong>Nombre del meme:</strong> ${data.memes[i].name}</li>
        <br/><img src = "${data.memes[i].url}" alt= "${data.memes[i].name}">
        </ul>
        `;
        document.getElementById("data").innerHTML = display;
        console.log(data.memes[i].url)
    }
    hideAll();  
}


//Funcion para capitalizar la primera letra de cada palabra
function capitalizeTheFirstLetterOfEachWord(words) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
            separateWord[i].substring(1);
    }
    return separateWord.join(' ');
}


/**
* Function que se pasa como callback el keyup del textarea search
*/
function search() {
    let text = document.getElementById("myInput").value;
    text = capitalizeTheFirstLetterOfEachWord(text);
    if (text == "") {
        hideAll();
    } else {
        for (i = 0; i < data.memes.length; i++) {
            if (match(data.memes[i].name, text) || text == "") {

                show(i);
            } else {
                hide(i);
            }
        };
    }  
}

//Ocultar todos los resultados.
function hideAll(exception) {
    for (i = 0; i < data.memes.length; i++) { 
            hide(i);
    }
}

/**
* Si substring es parte de word, retorna true, si no retorna false
* @param {String} word
* @param {String} substring
*/
function match(word, substring) {
    return word.includes(substring);
}

/**
* Oculta el elemento html que tiene el id elementId
* @param {String} elementId
*/
function hide(elementId) {
    document.getElementById(elementId).style.display = "none";
}

/**
* Muestra el elemento html que tiene el id elementId
* @param {String} elementId
*/
function show(elementId) {
    document.getElementById(elementId).style.display = "block";
}

// Punto de entrada para desencadenar lógica
main();

//Funcion para autocompletar. Incluye otras subfunciones relacionadas.
//Source: https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(input, array) {
    //Toma 2 argumentos, el elemento de text field, y un array de los valores posibles a autocompletar.
    var currentFocus;
    //Ejecuta la funcion cuando alguien escribe en el campo de texto.
    input.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        //Cierra cualquier lista ya abierta de valores autocompletados
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        //Crea un elemento DIV que contendra los items (Valores)
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        //Hacerle append al elemento DIV como un hijo del container autocomplete
        this.parentNode.appendChild(a);
        //Para cada item del array...
        for (i = 0; i < array.length; i++) {
            //Checkear si el item empieza con las mismas letras que el valor en el text field.
            if (array[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                //Crear un elemento DIV para cada elemento que coincide.
                b = document.createElement("DIV");
                //Hacer las letras que matchean negrita
                b.innerHTML = "<strong>" + array[i].substr(0, val.length) + "</strong>";
                b.innerHTML += array[i].substr(val.length);
                //Insertar un input field que contendra el array actual de los valores del item.
                b.innerHTML += "<input type='hidden' value='" + array[i] + "'>";
                //Ejecutar una funcion cuando alguien le de click al valor del item.
                b.addEventListener("click", function (e) {
                    //Insertar el valor para el text field autocompletado.
                    input.value = this.getElementsByTagName("input")[0].value;
                    //Cerrar la lista de valores autocompletados.
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    //Ejecutar una funcion cuando se presiona una tecla.
    input.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            //Si la tecla flecha abajo es presionada, incrementa la variable currentFocus.
            currentFocus++;
            //Y hace el item actual mas visible.
            addActive(x);
        } else if (e.keyCode == 38) { //up
            //Si la tecla flecha arriba es preisonada, decrementa la variable current Focus.
            currentFocus--;
            //Y hace el item actual mas visible.
            addActive(x);
        } else if (e.keyCode == 13) {
            //Si la tecla ENTER es presionada, evita que el formulario sea subido.
            e.preventDefault();
            if (currentFocus > -1) {
                //Y simula un click en el objeto activo
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        // Una funcion para clasificar un item como "activo"
        if (!x) return false;
        // Empieza removiendo la clase "active" en todos los items.
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        //Una funcion para remover la clase "active" de todos los items autocompletados.
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        //Cerrar todas las listas autocomplete del documento, excepto la pasada por argumento.
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    //Ejecutar una funcion cuando alguien hace click en el documento.
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
        search();
    });
}

