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
        document.getElementById('becado-monotributista').setAttribute('readonly', 'readonly');
    };
})

document.getElementById(`boton-crear`).addEventListener("click", function(event) {
    // Evita que el formulario se envíe automáticamente
    event.preventDefault();
  
    // Verifica si todos los campos requeridos están completos
    if (camposValidos()) {
        const formData = new FormData(document.getElementById(`mi-formulario`));
  
        const formDataJSON = {
          numeroMatricula: formData.get(`numero-matricula`),
          nombres: formData.get(`nombres`),
          apellidos: formData.get(`apellidos`),
          dni: formData.get(`dni`),
          categoria: formData.get(`categoria`),
          becadoOMonotributista: formData.get(`becado-monotributista`),
          matriculadoEstado: formData.get(`estado`),
          linkLegajo: formData.get(`enlace-legajo`),
          email: formData.get(`email`),
          telContacto: formData.get(`telContacto`)
        };

        const authToken = localStorage.getItem('authToken');
  
        fetch(`https://api-trab-sociales.zeabur.app/matriculado`, {
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
        // Si faltan campos, muestra un mensaje de error o realiza alguna otra acción
        alert("Por favor, complete los campos obligatorios antes de enviar.");
    }
  });

    function camposValidos() {
        var numeroMatricula = document.getElementById(`numero-matricula`).value;
        var nombres = document.getElementById(`nombres`).value;
        var apellidos = document.getElementById(`apellidos`).value;
        var dni = document.getElementById(`dni`).value;
        var categoria = document.getElementById(`categoria`).value;
        var estado = document.getElementById(`estado`).value;
        // Verifica si los campos no están vacíos
        if (numeroMatricula.trim() === '' || nombres.trim() === '' || apellidos.trim() === '' ||
        dni.trim() === '' || categoria.trim() === '' || estado.trim() === '') {
            return false;
        } 
        return true;
}

function mostrarModalConfirmado(){
    const modalConfirmado = new bootstrap.Modal(document.getElementById(`staticBackdrop`));
    modalConfirmado.show();
}