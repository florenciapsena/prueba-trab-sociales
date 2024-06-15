const urlBusqueda = 'https://api-trab-sociales.zeabur.app/matriculado/getByDNIandMatricula'
const contenedorMatriculado = document.getElementById('contenedor-matriculado');
const matriculado = document.getElementById('matriculado');
const cleanMatriculado = document.getElementById('clean-matriculado');
const btnBuscarMatriculado = document.getElementById('cargar-matriculado');
const limpiarMatriculado = document.getElementById('clean-matriculado');
const dni = document.getElementById('dni');
const matricula = document.getElementById('matricula');
const contenedorEmail = document.getElementById('contenedor-email');
const contenedorPassword1 = document.getElementById('contenedor-password-1');
const contenedorPassword2 = document.getElementById('contenedor-password-2');
const registrarMatriculadoBtn = document.getElementById('registrar-matriculado');
const footer = document.getElementById('footer');
const errorContraseniasCoinciden = document.getElementById('validacion-contrasenias-coinciden');
const correctaCantidadCaracteres = document.getElementById('correcta-cantidad-caracteres');
const errorCantidadCaracteres = document.getElementById('validacion-cantidad-caracteres');
const contraseniasCoinciden = document.getElementById('contrasenias-coinciden');
const password1 = document.getElementById('password-1');
const password2 = document.getElementById('password-2');
const usuario = document.getElementById('usuario');
const errorMail = document.getElementById('error-email');
const correctoMail = document.getElementById('email-correcto');

btnBuscarMatriculado.addEventListener('click', async function(e){
    e.preventDefault();
    dni.setAttribute('disabled', 'disabled');
    matricula.setAttribute('disabled', 'disabled');
    try{
        const apiUrl = urlBusqueda+`?dni=${dni.value}&numeroMatricula=${matricula.value}`;
        const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        });
        if(response.ok){
            const data = await response.json();
            var {nombres ,  apellidos} = data;
            matriculado.value = `${nombres} ${apellidos}`
            contenedorMatriculado.classList.remove('ocultar');
            cleanMatriculado.classList.remove('ocultar');
            contenedorEmail.classList.remove('ocultar');
            contenedorPassword1.classList.remove('ocultar');
            contenedorPassword2.classList.remove('ocultar');
            btnBuscarMatriculado.classList.add('ocultar');
            registrarMatriculadoBtn.classList.remove('ocultar');
            footer.style.position = 'relative';
            validarCampos();
        } else{
            alert(
                "Sin resultados."
              );
            dni.removeAttribute('disabled');
            matricula.removeAttribute('disabled');
        }

        Promise.resolve();
        
    } catch(error){
        return Promise.reject(error); // Rechazar la promesa en caso de error
    }
})

limpiarMatriculado.addEventListener('click', function(e) {
    e.preventDefault();
    dni.value='';
    matricula.value = '';
    dni.removeAttribute('disabled');
    matricula.removeAttribute('disabled');
    contenedorMatriculado.classList.add('ocultar');
    cleanMatriculado.classList.add('ocultar');
    contenedorEmail.classList.add('ocultar');
    contenedorPassword1.classList.add('ocultar');
    contenedorPassword2.classList.add('ocultar');
    btnBuscarMatriculado.classList.remove('ocultar');
    registrarMatriculadoBtn.classList.add('ocultar');
    footer.style.position = 'fixed';
    errorContraseniasCoinciden.style.display = 'none';
    errorCantidadCaracteres.style.display = 'none';
    contraseniasCoinciden.style.display = 'none';
    correctaCantidadCaracteres.style.display = 'none';
    password1.value = '';
    password2.value = '';
    password2.setAttribute('disabled', 'disabled');
    errorMail.style.display = 'none';
    correctoMail.style.display = 'none';
    usuario.value = '';
})

function validarCampos() {
    function validateFields() {
        if ((password1.value !== password2.value && password1.value.length >= 8)) {
            errorContraseniasCoinciden.style.display = 'block';
            contraseniasCoinciden.style.display = 'none';
            registrarMatriculadoBtn.setAttribute('disabled', 'disabled');
        } else if ((password1.value !== password2.value && password1.value.length < 8)){
            errorContraseniasCoinciden.style.display = 'none';
            contraseniasCoinciden.style.display = 'none';
            registrarMatriculadoBtn.setAttribute('disabled', 'disabled');
        }else {
            errorContraseniasCoinciden.style.display = 'none';
            contraseniasCoinciden.style.display = 'block';
            registrarMatriculadoBtn.removeAttribute('disabled');
        }

        if(password1.value.length < 8){
            errorCantidadCaracteres.style.display = 'block';
            correctaCantidadCaracteres.style.display = 'none';
            password2.value = '';
            password2.setAttribute('disabled', 'disabled');
        } else{
            errorCantidadCaracteres.style.display = 'none';
            correctaCantidadCaracteres.style.display = 'block';
            password2.removeAttribute('disabled');
        }

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        if (!validateEmail(usuario.value)) {
            errorMail.style.display = 'block';
            correctoMail.style.display = 'none';
        } else {
            errorMail.style.display = 'none';
            correctoMail.style.display = 'block';
        }

    }

    password1.addEventListener('input', validateFields);
    password2.addEventListener('input', validateFields);
    usuario.addEventListener('input', validateFields);
};