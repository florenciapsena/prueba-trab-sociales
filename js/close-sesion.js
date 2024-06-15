document.getElementById('cerrar-sesion').addEventListener('click', function(e) {
    e.preventDefault(); // Evitar el envío del formulario por defecto
    localStorage.removeItem('authToken', '');
    redirectToLogin();
});

function redirectToLogin() {
    window.location.href = '/index.html';
}