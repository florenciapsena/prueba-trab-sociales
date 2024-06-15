export function mostrarCargando() {
    const cargando = document.querySelector('.cargando');
    cargando.style.display = 'block';
}
    
export function ocultarCargando() {
    const cargando = document.querySelector('.cargando');
    cargando.style.opacity = 0;
    setTimeout(() => {
        cargando.style.display = 'none';
        cargando.style.opacity = 1; // Restaurar la opacidad por si se vuelve a mostrar
    }, 500); // Ajusta el tiempo según la duración de tu transición CSS
}