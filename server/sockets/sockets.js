const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();
io.on('connection', (cliente) => {
    console.log('Usuario conectado');

    cliente.on('entrarChat', (info, callback) => {
        if (!info.nombre || !info.sala) {
            return callback({ error: true, message: 'El nombre/sala es necesario' });
        }

        cliente.join(info.sala);

        let personas = usuarios.agregarPersona(cliente.id, info.nombre, info.sala);
        cliente.broadcast.to(info.sala).emit('listaPersona', usuarios.getPersonasPorSala(info.sala));
        cliente.broadcast.to(info.sala).emit('crearMensaje', crearMensaje('Administrador', `${info.nombre} se unió`));
        callback(usuarios.getPersonasPorSala(info.sala));
    });

    cliente.on('disconnect', () => {
        let personaBorrado = usuarios.borrarPersona(cliente.id);
        cliente.broadcast.to(personaBorrado.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrado.nombre} ha salido del chat`));
        cliente.broadcast.to(personaBorrado.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrado.sala));
    });

    cliente.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(cliente.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        cliente.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    cliente.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(cliente.id);
        cliente.broadcast.to(persona.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
    //Enviar Información
    cliente.emit('enviarMensaje', { nombre: 'NodeJS', mensaje: 'Te estamos esperando' });
});