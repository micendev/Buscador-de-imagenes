
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');

let paginaActual = 1;
let totalPaginas;
let iteradorSiguiente;

window.onload = () => {
    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit', validarFormulario);
    paginacionDiv.addEventListener('click', direccionPaginacion);
};

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === '') {
        // mensaje de error
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();
}


// Muestra una alerta de error o correcto
function mostrarAlerta(mensaje) {
    const alerta = document.querySelector('.bg-red-100');
    if(!alerta) {
        const alerta = document.createElement('p');

        alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded",  "max-w-lg", "mx-auto", "mt-6", "text-center" );
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}


// Busca las imagenes en una API
function buscarImagenes() {
    const terminoBusqueda = document.querySelector('#termino').value;

    const key = '34243839-f7f9337ea57c9ed5fe6806919';
    const url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&per_page=45&page=${paginaActual}`;

    fetch(url) 
        .then(respuesta => respuesta.json())
        .then( resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);

            // console.log(totalPaginas)

            mostrarImagenes(resultado.hits);
        });


}

function mostrarImagenes(imagenes, paginas ) {

    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    imagenes.forEach( imagen => {

        const { views, downloads, likes, previewURL, largeImageURL } = imagen;
        resultado.innerHTML += `
            
            <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-4 mb-8">
                 <div class="bg-white ">
            
                    <img class="w-full h-40 object-cover " src=${previewURL} alt={tags} />

                    <div class="p-4">
                        <p class="card-text">${views} Vistas </p>
                        <p class="card-text">${downloads} Descargas</p>
                        <p class="card-text">${likes} Me Gusta </p>

                        <a href=${largeImageURL} 
                        rel="noopener noreferrer" 
                        target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase
                         hover:bg-blue-500 text-white">Ver Imagen</a>
                    </div>
                </div>
            </div>
            `;
    });


    if(!iteradorSiguiente) {
        mostrarPaginacion();
    }
 
}

function mostrarPaginacion() {
    // recorrer el iterador
    iteradorSiguiente = crearPaginacion(totalPaginas);
    while( true ) {
        const { value, done } = iteradorSiguiente.next();

        if(done) return;

        // Crear botón de sig
        const botonSiguiente = document.createElement('a');
        botonSiguiente.href = "#";
        botonSiguiente.dataset.pagina = value;
        botonSiguiente.textContent = value;
        botonSiguiente.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'mx-auto', 'mb-10', 'font-bold', 'uppercase', 'rounded', 'hover:bg-blue-600');
        paginacionDiv.appendChild(botonSiguiente);
        
    }
}

function calcularPaginas(total) {
    return parseInt( Math.ceil( total / 30 ));
}


// Crear el generador
function *crearPaginacion(total) {
    console.log(total);
    for( let i = 1; i <= total; i++) {
        yield i;
    }
}

function direccionPaginacion(e) {
    if(e.target.classList.contains('siguiente')) {

        paginaActual= Number( e.target.dataset.pagina);
        buscarImagenes();
        formulario.scrollIntoView();
    }
}


// Obtener el botón y agregar un evento clic
const btn = document.getElementById("scroll-top-btn");
btn.addEventListener("click", () => {
  // Desplazarse suavemente hacia arriba de la página
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Mostrar el botón cuando el usuario ha desplazado hacia abajo
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
});


