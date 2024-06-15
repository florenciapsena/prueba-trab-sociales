const API_BASE_URL = 'https://api-trab-sociales.zeabur.app';

function requireAuth(callback) {
  isTokenValid().then(({ valid, redirect }) => {
    if (valid) {
      console.log("sigue accediendo");
      callback();
    } else if (redirect) {
      console.log("no accede");
      redirectToLogin();
    } else {
      console.log("error al validar el token");
    }
  });
}

function isTokenValid() {
  return new Promise((resolve, reject) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        resolve({ valid: false, redirect: true });
    } else {
        fetch(`${API_BASE_URL}/api/auth/validate`, {
            headers: {
                'Authorization': 'Bearer ' + authToken
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 403) {
                // Si el token es inválido, elimínalo del localStorage
                localStorage.removeItem('authToken');
                resolve({ valid: false, redirect: true });
            } else {
                throw new Error(`Error de validación del token: ${response.status} - ${response.statusText}`);
            }
        })
        .then(data => {
            if (!data.valid || !data.role.includes('ROLE_ADMIN')) {
                resolve({ valid: false, redirect: true });
            } else {
                resolve({ valid: data.valid, redirect: false });
            }
        })
        .catch(error => {
            console.error('Error al validar el token:', error);
            resolve({ valid: false, redirect: true });
        });
    }
  });
}

function redirectToLogin() {
  window.location.href = '/login.html';
}



export { requireAuth };