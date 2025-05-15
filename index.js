const express = require('express');
const app = express();
const jugadores = [];

class Jugador {
  constructor(id) {
    this.id = id;
  }
}

app.get('/unirse', (req, res) => {
  const id = `${Math.random()}`;
  const jugador = new Jugador(id);
  jugadores.push(jugador);

  // Permitir peticiones desde cualquier origen
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.send(id); // Devuelve el ID generado
});

app.listen(8080, () => {
  console.log('Servidor corriendo en el puerto 8080');
});
