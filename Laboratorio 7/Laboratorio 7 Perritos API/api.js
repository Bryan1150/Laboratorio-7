const BASE_URL = 'https://dog.ceo/api/'

//Obtener la lista de razas de perros. 
async function getDogList() {
    const perrosURL = `https://dog.ceo/api/breeds/list/all`;
    let data = null;
    const response = await fetch(perrosURL);
    data = await response.json();
    let breedList = parseJsonResponse(data);
	
    return breedList;
}

//Separar los datos del mensaje
function parseJsonResponse(json) {
    let allBreedsData = json.message;
    let breedList = Object.keys(allBreedsData);
    return breedList;
}

//Obtener una imagen aleatoria segun la raza ingresada
async function getRandomImage(raza) {
    const imagenURL = `${BASE_URL}breed/${raza}/images/random`;
    let data = null;
    const response = await fetch(imagenURL);
    data = await response.json();
    imagen = data.message;
    return imagen;
}


async function main() {
    // Cada vez que se presiona una tecla en la barra de búsqueda, se hace la búsqueda
    document.getElementById("search").addEventListener("keyup", search);

    // Datos 
    data = await getDogList();
  
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

    for (i = 0; i < data.length; i++) {
        imagen = await getRandomImage(data[i]);
        display += `
        <ul id="${i}">
        <li><strong>Nombre raza:</strong> ${data[i]}</li>
        <br/><img src = "${imagen}" alt= "${data[i]}">
        </ul>
        `;
        document.getElementById("data").innerHTML = display;
    }
}

/**
* Function que se pasa como callback el keyup del textarea search
*/
function search() {
    let text = document.getElementById("search").value;
	text = text.toLowerCase();
	for (i = 0; i < data.length; i++) {
		if (match(data[i], text) || text == "") {
			show(i);
		} else {
			hide(i);
		}
	}; 
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