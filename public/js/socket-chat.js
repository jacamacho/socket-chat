var socket = io();
var params = new URLSearchParams(window.location.search);
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre es necesario');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

//Escuchar Información
socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, (data) => {
        console.log(data);
    });
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

socket.on('crearMensaje', (mensaje) => {
    console.log(mensaje);
});

socket.on('listaPersona', (usuarios) => {
    console.log(usuarios);
});

//Enviar Información
socket.emit('crearMensaje', {
    usuario: 'John Andrés',
    mensaje: 'Hola mundo'
}, function(data) {
    console.log('Se lanzo el callback', data);
});

//Mensajes privados
socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje Privado', mensaje);
});