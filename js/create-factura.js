const urlBusqueda = 'https://api-trab-sociales.zeabur.app/matriculado/getByNumber/';
const authToken = localStorage.getItem('authToken');
const numeroMatricula = document.getElementById('contenedor-numero-matricula');
const matriculado = document.getElementById('contenedor-matriculado');
const cleanMatriculado = document.getElementById('clean-matriculado');
const searchInput = document.getElementById('numero-matricula');
const results = document.getElementById('matriculado');
const crearParticular = document.getElementById('check-particular');


document.addEventListener('DOMContentLoaded', () => {
    const categoriaContenedor = document.getElementById('contenedor-categoria');
    const becadoMonotributista = document.getElementById('contenedor-becado-monotributista');

    crearParticular.addEventListener('change', () => {
        numeroMatricula.classList.toggle('ocultar');
        matriculado.classList.toggle('ocultar');
        categoriaContenedor.classList.toggle('ocultar');
        becadoMonotributista.classList.toggle('ocultar');
        cleanMatriculado.classList.toggle('ocultar');

        });
    })

searchInput.addEventListener('input', () => {
    if(searchInput.value.trim()>0){
        const query = searchInput.value.trim();
        performSearch(query);
    }
});

async function performSearch(query) {
    try{
        const urlResultado = urlBusqueda+query;
        const response = await fetch(urlResultado, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
                }
            }
            );
        const data = await response.json();
        if(data.length != 0){
            var {nombres, apellidos} = data[0];
            results.value = nombres + " " + apellidos;
            searchInput.setAttribute('readonly', 'readonly');
        }
        return Promise.resolve();
    } catch (error){
        return Promise.reject(error); // Rechazar la promesa en caso de error
    }
}

document.getElementById('boton-crear').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (crearParticular.checked) {
        // Switch is checked (active)
        if(camposValidos()){
            const formData = new FormData(document.getElementById(`mi-formulario`));
    
            const formDataJSON = {
            anio: formData.get(`anio`),
            monto: formData.get(`monto`),
            enConvenio: formData.get(`en-convenio`),
            pagoEstado: formData.get(`pago-estado`),
            numeroMatriculado: formData.get(`numero-matricula`)
            };
    
            fetch(`https://api-trab-sociales.zeabur.app/factura`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(formDataJSON)
            })
            .then(response => {
                // Verificar si la solicitud fue exitosa
                if (response.ok) {
                    mostrarModalConfirmado();
                    // Mostrar la ventana modal de confirmación
                    setTimeout(function() {
                    window.location.reload();
                    }, 3000); // ajusta el tiempo según sea necesario
                } else {
                    // Manejar el caso de error
                    throw new Error('Hubo un problema al enviar el formulario.');
                }
            });
        } else {
            // Manejar el caso de error
            throw new Error('Hubo un problema al enviar el formulario.');
        }
    } else {
        if(camposValidos()){
            const formData = new FormData(document.getElementById(`mi-formulario`));
            const categoria = document.getElementById('categoria').value;
            const becadoMonotributista = document.getElementById('becado-monotributista').value;
    
            const formDataJSON = {
            anio: formData.get(`anio`),
            monto: formData.get(`monto`),
            enConvenio: formData.get(`en-convenio`),
            pagoEstado: formData.get(`pago-estado`),
            };
    
            fetch(`https://api-trab-sociales.zeabur.app/factura/crearFacturas?categoria=${categoria}&becadoMono=${becadoMonotributista}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(formDataJSON)
            })
            .then(response => {
                // Verificar si la solicitud fue exitosa
                if (response.ok) {
                    mostrarModalConfirmado();
                    // Mostrar la ventana modal de confirmación
                    setTimeout(function() {
                    window.location.reload();
                    }, 3000); // ajusta el tiempo según sea necesario
                } else {
                    // Manejar el caso de error
                    throw new Error('Hubo un problema al enviar el formulario.');
                }
            });
        } else {
            // Manejar el caso de error
            throw new Error('Hubo un problema al enviar el formulario.');
        }
    }
})

document.getElementById('categoria').addEventListener('change', () => {

    const categoriaSeleccionada = document.getElementById('categoria').value;

    if (categoriaSeleccionada === "B") {
        // Habilitar el select de becado-monotributista
        document.getElementById('becado-monotributista').removeAttribute('value')
        document.getElementById('becado-monotributista').removeAttribute('disabled');
    } else {
        // Si no es "B", deshabilitar el select de becado-monotributista
        document.getElementById('becado-monotributista').setAttribute('value', 'NO CORRESPONDE')
        document.getElementById('becado-monotributista').setAttribute('disabled', 'disabled');
    };
})

document.getElementById('clean-matriculado').addEventListener('click', () => {
    numeroMatricula.querySelector('input').value = '';
    numeroMatricula.querySelector('input').removeAttribute('readonly');
    matriculado.querySelector('input').value = "";
});

function camposValidos() {
    var anio = document.getElementById(`anio`).value;
    var monto = document.getElementById(`monto`).value;
    var enConvenio = document.getElementById(`en-convenio`).value;
    var pagoEstado = document.getElementById(`pago-estado`).value;
    // Verifica si los campos no están vacíos
    if (anio.trim() === '' || monto.trim() === '' || enConvenio.trim() === '' ||
    pagoEstado.trim() === '') {
        return false;
    } 
    return true;
}

function mostrarModalConfirmado(){
    const modalConfirmado = new bootstrap.Modal(document.getElementById(`staticBackdrop`));
    modalConfirmado.show();
}

