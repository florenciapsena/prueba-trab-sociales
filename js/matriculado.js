const usuario = localStorage.getItem('usuario');
const authToken = localStorage.getItem('authToken');



const apiUrlBase = 'https://api-trab-sociales.zeabur.app/matriculado/';
const nombreApellido = document.getElementById('nombre-apellido');
const numeroMatriculado = document.getElementById('numero-matricula');
const numeroDni = document.getElementById('dni-matriculado');
const categoriaMatriculado = document.getElementById('categoria-matriculado');
const becadoMonotributista = document.getElementById('becado-mono-matriculado');
const matriculadoElEstado = document.getElementById('estado-matriculado');
const linkDelLegajo = document.getElementById('link-legajo');
const informacionMatriculado = document.getElementById('info-matriculado');

document.getElementById('cerrar-sesion').addEventListener('click', function(e) {
  e.preventDefault(); // Evitar el envío del formulario por defecto
  localStorage.removeItem('authToken');
  redirectToLogin();
});


document.addEventListener("DOMContentLoaded", function() {
  mostrarCargando();  
  fetch(apiUrlBase + usuario, {
        headers: {
          'Authorization': 'Bearer '+ authToken
        }
      })
    .then(response => response.json())
    .then(data => {
        var {nombresApellidos, numeroMatricula, dni, categoria, 
          becadoOMonotributista, matriculadoEstado, linkLegajo} = data[0];

        nombreApellido.textContent = nombresApellidos;
        numeroMatriculado.textContent = numeroMatricula;
        numeroDni.textContent = dni;
        categoriaMatriculado.textContent = categoria;
        if(linkLegajo===null){
          linkDelLegajo.setAttribute('href', '#');
        } else{
          linkDelLegajo.setAttribute('href', linkLegajo);
        }
        if(matriculadoEstado===null){
          matriculadoElEstado.textContent = "Sin información";
          informacionMatriculado.textContent = "";
        } else{
          matriculadoElEstado.textContent = matriculadoEstado;
          if("irregular".toUpperCase() === matriculadoEstado.toUpperCase()){
            matriculadoElEstado.setAttribute('style', 'color: yellow');
            informacionMatriculado.textContent = "Según artículo n°666, el matriculado......";
          } else if("suspendido".toUpperCase() === matriculadoEstado.toUpperCase()){
            matriculadoElEstado.setAttribute('style', 'color: red');
            informacionMatriculado.textContent = "Según artículo n°777, el matriculado......";
          } else{
            matriculadoElEstado.setAttribute('style', 'color: green');
            informacionMatriculado.textContent = "";
          }
        }
        if(becadoOMonotributista===null){
            becadoMonotributista.textContent = "No corresponde";
        } else {
            becadoMonotributista.textContent = becadoOMonotributista;
        }

        const facturas = data[0].facturas;

        const facturasLi = document.getElementById('accordionExample');
        facturasLi.innerHTML = '';

        const modals = document.getElementById('modales-cuotas');
        modals.innerHTML = '';

        facturas.forEach((factura, index) => {
          const div = document.createElement('div');
          div.classList.add('accordion-item');
          div.innerHTML = `
              <h2 class="accordion-header">
                <button id="anio-facturacion" class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
                    AÑO ${factura.anio}
                </button>
              </h2>
              <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                      <strong>Numero de Factura: </strong> <span id="numero-factura">${factura.numeroFactura}</span>
                      <strong>Monto: </strong> <span id="numero-factura">$${factura.monto}</span> 
                      <strong>Saldo: </strong> <span id="saldo-factura">$${factura.saldo}</span>  
                      <strong>Pago Estado:</strong> <span class="pago-estado-bolder" id="pago-estado${index}">${factura.pagoEstado}</span> 
                      <strong>En Convenio: </strong> <span id="en-convenio">${factura.enConvenio}</span> 
                  </div>
                  <div class="ver-facturacion">
                    <a href="#" data-bs-target="#staticBackdrop${index}" id="show-modal-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt-cutoff" viewBox="0 0 16 16">
                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5M11.5 4a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
                        <path d="M2.354.646a.5.5 0 0 0-.801.13l-.5 1A.5.5 0 0 0 1 2v13H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H15V2a.5.5 0 0 0-.053-.224l-.5-1a.5.5 0 0 0-.8-.13L13 1.293l-.646-.647a.5.5 0 0 0-.708 0L11 1.293l-.646-.647a.5.5 0 0 0-.708 0L9 1.293 8.354.646a.5.5 0 0 0-.708 0L7 1.293 6.354.646a.5.5 0 0 0-.708 0L5 1.293 4.354.646a.5.5 0 0 0-.708 0L3 1.293zm-.217 1.198.51.51a.5.5 0 0 0 .707 0L4 1.707l.646.647a.5.5 0 0 0 .708 0L6 1.707l.646.647a.5.5 0 0 0 .708 0L8 1.707l.646.647a.5.5 0 0 0 .708 0L10 1.707l.646.647a.5.5 0 0 0 .708 0L12 1.707l.646.647a.5.5 0 0 0 .708 0l.509-.51.137.274V15H2V2.118z"/>
                      </svg>
                      <strong>Ver Cuotas Pagas</strong>
                    </a>
                  </div>
              </div>`;
            facturasLi.appendChild(div);

            const estadoFactura = document.getElementById('pago-estado'+index);

            if("impago".toUpperCase() === factura.pagoEstado.toUpperCase()){
              estadoFactura.setAttribute('style', 'color: red');
            } else if("pago parcial".toUpperCase() === factura.pagoEstado.toUpperCase()){
              estadoFactura.setAttribute('style', 'color: yellow');
            } else{
              estadoFactura.setAttribute('style', 'color: green');
            }

            const divModals = document.createElement('div');
            divModals.classList.add('item-modal');
            divModals.innerHTML = `
            <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                      <h1 class="modal-title fs-5" id="staticBackdropLabel">${factura.anio}-Cuotas Pagas</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="accordion" id="accordion-cuotas${index}">
                        </div>
                        <strong>Total a pagar: </strong>$${factura.monto}
                        <strong>Saldo: </strong>$${factura.saldo}
                      </div>
                      <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                      </div>
                  </div>
              </div>
            </div>`;
          modals.appendChild(divModals);

          const showModalBtn = document.querySelector(`[data-bs-target="#staticBackdrop${index}"]`);
          const modal = new bootstrap.Modal(document.getElementById(`staticBackdrop${index}`));

          showModalBtn.addEventListener('click', () => {
            modal.show();
          });

          const cuotas = data[0].facturas[index].cuotas;
          const accordionCuotas = document.getElementById('accordion-cuotas'+index);
          
          cuotas.forEach((cuota, index) => {
            const divCuota = document.createElement('div');
            divCuota.classList.add('accordion-item');
            divCuota.innerHTML = `
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index+30}" aria-expanded="true" aria-controls="collapse${index+30}">
                    ${cuota.numeroCuota}
                </button>
              </h2>
              <div id="collapse${index+30}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                      <strong>Numero de Factura: </strong> ${cuota.numeroCuota}
                      <strong>Monto:</strong> ${cuota.monto}
                      <strong>Fecha de Pago: </strong> ${cuota.fechaPago}
                      <strong>Metodo de Pago: </strong> ${cuota.metodoPago}
                  </div>
                  <a href="${cuota.linkComprobante}" class="comprobante-enlace" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.75em" height="1.75em" fill="rgb(82,71,151)" class="bi bi-file-pdf" viewBox="0 0 16 16">
                      <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                      <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z"/>
                    </svg>
                  </a>
              </div>`;
            accordionCuotas.appendChild(divCuota);
          })


        });
        ocultarCargando();
    })
    .catch(error => {
        console.error('Hubo un error al obtener los datos:', error);
        redirectToLogin();
    });
  });


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

function redirectToLogin() {
  window.location.href = '/login-matriculado.html';
}