// Variables Globales (guardar vidas del jugador y enemigo)
let vidasJugador = 3;
let vidasEnemigo = 3;
// Variable para verificar si el juego ha terminado
let juegoTerminado = false; 

// Función para iniciar el juego
function iniciarJuego() {
    //conectarse al servidor
    unirseAlJuego();
    let sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque');
    // Ocultar la sección de seleccionar ataque
    sectionSeleccionarAtaque.style.display = 'none'; 

    let sectionReiniciar = document.getElementById('reiniciar');
    // Ocultar la sección de reiniciar
    sectionReiniciar.style.display = 'none'; 

    let botonMascotaJugador = document.getElementById('boton-mascota');
    // Añadir evento de clic para seleccionar mascota y se ejecuta la función seleccionarMacostaJugador
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador); 

    // Añadir eventos a los botones de ataque
    document.getElementById('boton-fuego').addEventListener('click', () => ataqueJugador('FUEGO')); // Evento para ataque Fuego
    document.getElementById('boton-agua').addEventListener('click', () => ataqueJugador('AGUA'));  // Evento para ataque Agua
    document.getElementById('boton-tierra').addEventListener('click', () => ataqueJugador('TIERRA')); // Evento para ataque Tierra
    
    let botonReiniciar = document.getElementById('boton-reiniciar');
    // Al dar click en el botón reiniciar el juego
    botonReiniciar.addEventListener('click', reiniciarJuego); 
}
// Nueva función para conectarse al servidor
function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")  // <-- IMPORTANTE: incluye http://
    .then(function (res) {
        if (res.ok) {
            res.text()
            .then(function (respuesta) {
                console.log("ID recibido del servidor:", respuesta);
            });
        } else {
            console.error("Error en la respuesta del servidor");
        }
    })
    .catch(function (error) {
        console.error("Error en la petición fetch:", error);
    });
}

// Función para que el jugador seleccione una mascota
function seleccionarMascotaJugador() {
    let sectionSeleccionarMascota = document.getElementById("seleccionar-mascota");
    // Ocultar la sección de seleccionar mascota
    sectionSeleccionarMascota.style.display = 'none'; 

    let sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque');
    // Mostrar la sección de seleccionar ataque
    sectionSeleccionarAtaque.style.display = 'block'; 
    //Opciones de mascotas
    let inputHipodoge = document.getElementById('hipodoge');
    let inputCapipepo = document.getElementById('capipepo');
    let inputRatigueya = document.getElementById('ratigueya');
    // Span donde se mostrará la mascota seleccionada
    let spanMascotaJugador = document.getElementById('mascota-jugador');

    // Verificar qué mascota ha seleccionado el jugador
    if (inputHipodoge.checked) {
        // Asignar Hipodoge
        spanMascotaJugador.innerHTML = 'Hipodoge'; 
    } else if (inputCapipepo.checked) {
        // Asignar Capipepo
        spanMascotaJugador.innerHTML = 'Capipepo'; 
    } else if (inputRatigueya.checked) {
        // Asignar Ratigueya
        spanMascotaJugador.innerHTML = 'Ratigueya'; 
    } else {
        // Mostrar alerta si no se selecciona ninguna
        alert('Selecciona una mascota'); 
        // Volver a mostrar la selección de mascota
        sectionSeleccionarMascota.style.display = 'block'; 
        // Salir de la función si no se selecciona una mascota
        return; 
    }
    //Guardar la mascota seleccioanda
    let mascotaSeleccionada = '';
    if (inputHipodoge.checked) {
        mascotaSeleccionada = 'hipodoge';
        spanMascotaJugador.innerHTML = 'Hipodoge';
    } else if (inputCapipepo.checked) {
        mascotaSeleccionada = 'capipepo';
        spanMascotaJugador.innerHTML = 'Capipepo';
    } else if (inputRatigueya.checked) {
        mascotaSeleccionada = 'ratigueya';
        spanMascotaJugador.innerHTML = 'Ratigueya';
    }
    // Mostrar imagen del jugador
    const imgJugador = document.getElementById('imagen-mascota-jugador');
    imgJugador.src = `./imagenes/${mascotaSeleccionada}.png`;

    // Llamar a la función para seleccionar la mascota del enemigo
    seleccionarMascotaEnemigo(); 
}

// Función para seleccionar aleatoriamente la mascota del enemigo
function seleccionarMascotaEnemigo() {
    // Generar número aleatorio
    let ataqueAleatorio = aleatorio(1, 3); 
    let spanMascotaEnemigo = document.getElementById('mascota-enemigo');
    // Asignar la mascota del enemigo según el número aleatorio
    if (ataqueAleatorio == 1) {
        spanMascotaEnemigo.innerHTML = 'Hipodoge';
    } else if (ataqueAleatorio == 2) {
        spanMascotaEnemigo.innerHTML = 'Capipepo';
    } else {
        spanMascotaEnemigo.innerHTML = 'Ratigueya';
    }
    // Obtener el nombre que se asignó al enemigo
    const nombreEnemigo = document.getElementById('mascota-enemigo').innerText.toLowerCase();

    // Mostrar imagen del enemigo
    const imgEnemigo = document.getElementById('imagen-mascota-enemigo');
    imgEnemigo.src = `./imagenes/${nombreEnemigo}.png`;
}

// Función para manejar el combate
function combate(ataqueJugador, ataqueEnemigo) {
    // Si el juego ha terminado, no hacer nada
    if (juegoTerminado) return; 

    // COMBATE
    if (ataqueJugador == ataqueEnemigo) {
        crearMensaje("HAY EMPATE", ataqueJugador, ataqueEnemigo);
    } else if (ataqueJugador == 'FUEGO' && ataqueEnemigo == 'TIERRA' || 
               ataqueJugador == 'AGUA' && ataqueEnemigo == 'FUEGO' || 
               ataqueJugador == 'TIERRA' && ataqueEnemigo == 'AGUA') {
        crearMensaje("GANASTE", ataqueJugador, ataqueEnemigo);
        // Restar vida al enemigo
        vidasEnemigo--; 
        if (vidasEnemigo < 0) vidasEnemigo = 0;
    } else {
        crearMensaje("PERDISTE", ataqueJugador, ataqueEnemigo);
        vidasJugador--; // Restar vida al jugador
        if (vidasJugador < 0) vidasJugador = 0;
    }

    // Actualiza los números de vidas 
    actualizarVidas();

    // Verificar si alguien ha perdido todas las vidas
    revisarVidas();
}


// Función para revisar vidas
function revisarVidas() {
    // Si el jugador o enemigo no tienen vidas, mostrar mensaje final
    if (vidasEnemigo == 0) {
        crearMensajeFinal('Felicitaciones, GANASTE');
        juegoTerminado = true;
    } else if (vidasJugador == 0) {
        crearMensajeFinal('Lo siento, PERDISTE');
        juegoTerminado = true;
    }
}

// Función para actualizar las vidas en el DOM actuales
function actualizarVidas() {
    document.getElementById('vidas-jugador').textContent = vidasJugador;
    document.getElementById('vidas-enemigo').textContent = vidasEnemigo;
}


// Función de ataque del jugador
function ataqueJugador(ataque) {
    //Llama al combate con el ataque del jugador y uno aleatorio del enemigo.
    if (juegoTerminado) return; 
    let ataqueEnemigo = ataqueAleatorioEnemigo(); 
    combate(ataque, ataqueEnemigo); 
}

// Función para ataque aleatorio enemigo
function ataqueAleatorioEnemigo() {
    let ataqueAleatorio = aleatorio(1, 3);
    let ataqueEnemigo;    
    //Devolver agua, tierra o fuego aleatoriamente
    if (ataqueAleatorio == 1) {
        ataqueEnemigo = 'FUEGO';
    } else if (ataqueAleatorio == 2) {
        ataqueEnemigo = 'AGUA';
    } else {
        ataqueEnemigo = 'TIERRA';
    }
    return ataqueEnemigo;
}

// Función para crear mensajes de ataque
function crearMensaje(resultado, ataqueJugador, ataqueEnemigo) {
    let sectionMensajes = document.getElementById('mensajes');
    sectionMensajes.innerHTML = '';
    let parrafo = document.createElement('p');
    parrafo.innerHTML = `Tu mascota atacó con ${ataqueJugador}, la mascota del enemigo atacó con ${ataqueEnemigo} <span class="resultado ${resultado.toLowerCase()}">${resultado}</span>`;
    sectionMensajes.appendChild(parrafo);
}

// Función para crear mensajes finales
function crearMensajeFinal(mensaje) {
    const resultadoFinal = document.getElementById('resultado-final');
    // Mostrar mensaje final abajo
    resultadoFinal.innerHTML = `<p>${mensaje}</p>`; 

    // Mostrar botón reiniciar
    document.getElementById('boton-fuego').disabled = true;
    document.getElementById('boton-agua').disabled = true;
    document.getElementById('boton-tierra').disabled = true;

    document.getElementById('reiniciar').style.display = 'block';
}


// Función para reiniciar el juego
function reiniciarJuego() {
    location.reload();
}

// Función para aleatorio
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Evento al cargar la página
window.addEventListener('load', iniciarJuego);
