import { mostrarCargando, ocultarCargando } from "./loading.js";

const apiUrlBase = 'https://api-trab-sociales.zeabur.app/matriculado/';
const authToken = localStorage.getItem('authToken');

document.getElementById('buscar-matriculado').addEventListener('click', async function(e){
    e.preventDefault();
    try{
        mostrarCargando();
        const botonEliminar = document.getElementById('boton-eliminar');
        const valorIdInput = document.getElementById('input-id-matriculado').value
        const formularioInfo = document.getElementById('formulario-info');
        if (!validarUUID(valorIdInput)) {
            // Si el formato no es válido, muestra un mensaje de error o realiza alguna acción adecuada
            alert("Por favor, introduce un UUID válido");
            ocultarCargando();
            return; // Sale de la función
        }

        fetch(apiUrlBase+valorIdInput, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
            }
        })
        .then(response =>{
            if (response.ok) {
                return response.json();
            } else if (response.status === 403) {
                // Posible error del servidor o matriculado no encontrada
                alert("Por favor, introduce un UUID válido");
                window.location.reload();
            } else {
                throw new Error(`Error de validación del token: ${response.status} - ${response.statusText}`);
        }})
        .then(data => {
            var { numeroMatricula, nombres, apellidos, dni, categoria, becadoOMonotributista, 
                matriculadoEstado, usuario, linkLegajo, email, telContacto } = data;

            const numeroMatriculaElement = document.querySelector(`#numero-matricula`);
            const nombresElement = document.querySelector(`#nombres`);
            const apellidosElement = document.querySelector(`#apellidos`);
            const dniElement = document.querySelector(`#dni`);
            const categoriaElement = document.querySelector(`#categoria`);
            const becadoOMonotributistaElement = document.querySelector(`#becado-monotributista`);
            const matriculadoEstadoElement = document.querySelector(`#estado`);
            const usuarioElement = document.querySelector(`#usuario`);
            const linkLegajoElement = document.querySelector(`#enlace-legajo`);
            const emailElement =  document.querySelector(`#email`);
            const telContactoElement = document.querySelector(`#tel-contacto`);

            numeroMatriculaElement.value = numeroMatricula;
            nombresElement.value = nombres;
            apellidosElement.value = apellidos;
            dniElement.value = dni;
            categoriaElement.value = categoria;
            becadoOMonotributistaElement.value = becadoOMonotributista;
            matriculadoEstadoElement.value = matriculadoEstado;
            usuarioElement.value = usuario;
            linkLegajoElement.value = linkLegajo;
            emailElement.value = email;
            telContactoElement.value = telContacto;

            botonEliminar.classList.remove('disabled');

            formularioInfo.style.display = "flex";

            document.getElementById('input-id-matriculado').setAttribute('disabled', true);

            document.querySelector('footer').style.position = 'relative';

            ocultarCargando();

            return Promise.resolve();
        });
    } catch (error) {
        return Promise.reject(error); // Rechazar la promesa en caso de error
    }
});

document.getElementById('confirmar-eliminar').addEventListener('click', function (e) {
    e.preventDefault();
    try{
        const valorIdInput = document.getElementById('input-id-matriculado').value
        if (!validarUUID(valorIdInput)) {
            // Si el formato no es válido, muestra un mensaje de error o realiza alguna acción adecuada
            alert("Por favor, introduce un UUID válido");
            ocultarCargando();
            return; // Sale de la función
        }

        fetch(apiUrlBase+"borrarMatriculado/"+valorIdInput, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
            }
        })
        .then(response => {
            // Verificar si la solicitud fue exitosa
            if (response.ok) {
                ocultarModalConfirmacion();
                mostrarModalConfirmado();
                setTimeout(function() {
                    window.location.reload();
                }, 3000); // ajusta el tiempo según sea necesario
            } else {
                // Manejar el caso de error
                throw new Error('Hubo un problema al enviar el formulario.');
            }
        });
        

        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error); // Rechazar la promesa en caso de error
    }
})

function validarUUID(uuid) {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(uuid);
}

function ocultarModalConfirmacion(){
    const modalConfirmacion = new bootstrap.Modal(document.getElementById(`staticBackdrop`));
    modalConfirmacion.hide();
}

function mostrarModalConfirmado(){
    const modalConfirmado = new bootstrap.Modal(document.getElementById(`staticBackdrop-2`));
    modalConfirmado.show();
}

