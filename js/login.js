const urlLogin = 'https://api-trab-sociales.zeabur.app/login'

document.getElementById('login-admin-btn').addEventListener('click', function(e) {
  e.preventDefault(); // Evitar el envío del formulario por defecto
  loginUser();
});

function loginUser() {
  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;

  fetch(urlLogin, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ usuario, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      // Guardar el token en el localStorage o en una cookie
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('usuario-admin', data.Username);
      // Redirigir al usuario a la página principal o mostrar un mensaje de éxito
      mostrarCargando();
      window.location.href = '/options.html';
    } else {
      // Mostrar un mensaje de error al usuario
      window.location.href = '/login-error.html';
    }
  })
  .catch(error => {
    // Manejar el error de la solicitud
    console.error('Error al iniciar sesión:', error);
    window.location.href = '/login-error.html';
  });
}

document.addEventListener("DOMContentLoaded", function() {
  
// Obtener el checkbox y el nombre de usuario del DOM
const recordarmeCheckbox = document.getElementById('exampleCheck1');
const usuarioInput = document.getElementById('usuario');

const { recordarme, nombreUsuario } = getUserFromLocalStorage();
if (recordarme === 'true' && nombreUsuario && nombreUsuario !== 'null') {
  recordarmeCheckbox.checked = true;
  usuarioInput.value = nombreUsuario;
}

// Agregar un event listener para el cambio de estado del checkbox
recordarmeCheckbox.addEventListener('change', function() {
  if (recordarmeCheckbox.checked) {
    saveUserToLocalStorage();
  } else {
    localStorage.removeItem('recordarme');
    localStorage.removeItem('usuario-admin');
  }
});
});

function saveUserToLocalStorage() {
const nombreUsuario = document.getElementById('usuario').value;
localStorage.setItem('recordarme', 'true');
localStorage.setItem('usuario-admin', nombreUsuario);
}

function getUserFromLocalStorage() {
const recordarme = localStorage.getItem('recordarme');
const nombreUsuario = localStorage.getItem('usuario-admin');
return { recordarme, nombreUsuario };
}

function mostrarCargando() {
const cargando = document.querySelector('.cargando');
cargando.style.display = 'block';
}

function ocultarCargando() {
const cargando = document.querySelector('.cargando');
cargando.style.opacity = 0;
setTimeout(() => {
    cargando.style.display = 'none';
    cargando.style.opacity = 1; // Restaurar la opacidad por si se vuelve a mostrar
}, 500); // Ajusta el tiempo según la duración de tu transición CSS
}