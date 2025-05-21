let vidasJugador = 3;
let vidasEnemigo = 3;
let juegoTerminado = false;
let jugadorId = null;
let mascotaJugador = null;

function iniciarJuego() {
    unirseAlJuego();

    document.getElementById('seleccionar-ataque').style.display = 'none';
    document.getElementById('reiniciar').style.display = 'none';

    document.getElementById('boton-mascota').addEventListener('click', seleccionarMascotaJugador);
    document.getElementById('boton-fuego').addEventListener('click', () => ataqueJugador('FUEGO'));
    document.getElementById('boton-agua').addEventListener('click', () => ataqueJugador('AGUA'));
    document.getElementById('boton-tierra').addEventListener('click', () => ataqueJugador('TIERRA'));
    document.getElementById('boton-reiniciar').addEventListener('click', reiniciarJuego);
}

function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")
        .then(res => {
            if (res.ok) {
                res.text().then(respuesta => {
                    console.log("ID recibido del servidor:", respuesta);
                    jugadorId = respuesta;
                });
            } else {
                console.error("Error en la respuesta del servidor");
            }
        })
        .catch(error => {
            console.error("Error en la petición fetch:", error);
        });
}

function seleccionarMascotaJugador() {
    const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota");
    sectionSeleccionarMascota.style.display = 'none';

    const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque');
    sectionSeleccionarAtaque.style.display = 'block';

    const inputHipodoge = document.getElementById('hipodoge');
    const inputCapipepo = document.getElementById('capipepo');
    const inputRatigueya = document.getElementById('ratigueya');
    const spanMascotaJugador = document.getElementById('mascota-jugador');

    if (inputHipodoge.checked) {
        mascotaJugador = 'hipodoge';
        spanMascotaJugador.innerHTML = 'Hipodoge';
    } else if (inputCapipepo.checked) {
        mascotaJugador = 'capipepo';
        spanMascotaJugador.innerHTML = 'Capipepo';
    } else if (inputRatigueya.checked) {
        mascotaJugador = 'ratigueya';
        spanMascotaJugador.innerHTML = 'Ratigueya';
    } else {
        alert('Selecciona una mascota');
        sectionSeleccionarMascota.style.display = 'block';
        return;
    }

    document.getElementById('imagen-mascota-jugador').src = `./imagenes/${mascotaJugador}.png`;

    seleccionarMokepon(mascotaJugador);
    seleccionarMascotaEnemigo();
}

function seleccionarMokepon(mascotaJugador) {
    fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mokepon: mascotaJugador })
    });
}

function seleccionarMascotaEnemigo() {
    const numero = aleatorio(1, 3);
    const spanMascotaEnemigo = document.getElementById('mascota-enemigo');
    let nombre = "";

    if (numero === 1) {
        nombre = 'Hipodoge';
    } else if (numero === 2) {
        nombre = 'Capipepo';
    } else {
        nombre = 'Ratigueya';
    }

    spanMascotaEnemigo.innerHTML = nombre;
    document.getElementById('imagen-mascota-enemigo').src = `./imagenes/${nombre.toLowerCase()}.png`;
}

function ataqueJugador(ataque) {
    if (juegoTerminado) return;

    const ataqueEnemigo = ataqueAleatorioEnemigo();
    combate(ataque, ataqueEnemigo);
}

function ataqueAleatorioEnemigo() {
    const numero = aleatorio(1, 3);
    if (numero === 1) return 'FUEGO';
    if (numero === 2) return 'AGUA';
    return 'TIERRA';
}

function combate(ataqueJugador, ataqueEnemigo) {
    if (juegoTerminado) return;

    if (ataqueJugador === ataqueEnemigo) {
        crearMensaje("HAY EMPATE", ataqueJugador, ataqueEnemigo);
    } else if (
        (ataqueJugador === 'FUEGO' && ataqueEnemigo === 'TIERRA') ||
        (ataqueJugador === 'AGUA' && ataqueEnemigo === 'FUEGO') ||
        (ataqueJugador === 'TIERRA' && ataqueEnemigo === 'AGUA')
    ) {
        crearMensaje("GANASTE", ataqueJugador, ataqueEnemigo);
        vidasEnemigo--;
    } else {
        crearMensaje("PERDISTE", ataqueJugador, ataqueEnemigo);
        vidasJugador--;
    }

    if (vidasJugador < 0) vidasJugador = 0;
    if (vidasEnemigo < 0) vidasEnemigo = 0;

    actualizarVidas();
    revisarVidas();
}

function actualizarVidas() {
    document.getElementById('vidas-jugador').textContent = vidasJugador;
    document.getElementById('vidas-enemigo').textContent = vidasEnemigo;
}

function revisarVidas() {
    if (vidasEnemigo === 0) {
        crearMensajeFinal('Felicitaciones, GANASTE');
        juegoTerminado = true;
    } else if (vidasJugador === 0) {
        crearMensajeFinal('Lo siento, PERDISTE');
        juegoTerminado = true;
    }
}

function crearMensaje(resultado, ataqueJugador, ataqueEnemigo) {
    const sectionMensajes = document.getElementById('mensajes');
    sectionMensajes.innerHTML = '';
    const parrafo = document.createElement('p');
    parrafo.innerHTML = `Tu mascota atacó con ${ataqueJugador}, la del enemigo con ${ataqueEnemigo}. <span class="resultado ${resultado.toLowerCase()}">${resultado}</span>`;
    sectionMensajes.appendChild(parrafo);
}

function crearMensajeFinal(mensaje) {
    const resultadoFinal = document.getElementById('resultado-final');
    resultadoFinal.innerHTML = `<p>${mensaje}</p>`;

    document.getElementById('boton-fuego').disabled = true;
    document.getElementById('boton-agua').disabled = true;
    document.getElementById('boton-tierra').disabled = true;
    document.getElementById('reiniciar').style.display = 'block';
}

function reiniciarJuego() {
    location.reload();
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener('load', iniciarJuego);
