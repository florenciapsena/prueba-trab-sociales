import { mostrarCargando, ocultarCargando } from "./loading.js";

const apiUrlBase = 'https://api-trab-sociales.zeabur.app/matriculado/';
const authToken = localStorage.getItem('authToken');
const matriculadosPorPagina = 15;
const previousPageBtn = document.getElementById('previous-page');
const nextPageBtn = document.getElementById('next-page');
const firstPageBtn = document.getElementById('first-page');
const lastPageBtn = document.getElementById('last-page');
let totalPages = 1;
let paginaActual = 1;

window.addEventListener('load', function() {
    mostrarCargando();
    cargarMatriculados("", 1)
        .then(() => {
            paginadoInicial();
        })
        .catch(error => console.error('Error al cargar los matriculados:', error));
});

async function cargarMatriculados(dni, numeroPagina) {
    try {
        mostrarCargando();
        const apiUrl = `${apiUrlBase}?dni=${dni}&?pagina=${numeroPagina}&matriculadosPorPagina=${matriculadosPorPagina}`;
        const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                    }
                }
        );
        const data = await response.json();
        const matriculados = data;

        if(data.length >= 15){
            document.querySelector('footer').style.position = 'relative';
        }

        const matriculadosList = document.getElementById('tabla-matriculados');
        matriculadosList.innerHTML = '';

        matriculados.forEach((matriculado, index) => {
            // Crear elementos de matriculados
            const tr = document.createElement('tr');
            tr.innerHTML = `
                    <th scope="row">${index+1}</th>
                    <td>${matriculado.nombres}</td>
                    <td>${matriculado.apellidos}</td>
                    <td>${matriculado.numeroMatricula}</td>
                    <td>${matriculado.dni}</td>
                    <td id=${matriculado.idMatriculado}>${matriculado.matriculadoEstado}</td>
                    <td class="centrado-ver"><a href="" data-bs-target="#staticBackdrop-ver-mas-${matriculado.idMatriculado}" data-bs-toggle="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                    </a></td>
                    <td class="boton-modificar"><a href="" data-bs-target="#staticBackdrop-${matriculado.idMatriculado}" data-bs-toggle="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </a></td>`;
            matriculadosList.appendChild(tr);

            if("irregular".toUpperCase() === matriculado.matriculadoEstado.toUpperCase()){
                document.getElementById(`${matriculado.idMatriculado}`).setAttribute('style', 'color: yellow');
              } else if("suspendido".toUpperCase() === matriculado.matriculadoEstado.toUpperCase()){
                document.getElementById(`${matriculado.idMatriculado}`).setAttribute('style', 'color: red');
              } else{ 
                document.getElementById(`${matriculado.idMatriculado}`).setAttribute('style', 'color: green');
              }

            const modalsVerMas = document.getElementById('modales-ver-mas');
            const divModalsVerMas = document.createElement('div');
            divModalsVerMas.classList.add('item-modal');
            divModalsVerMas.innerHTML = `
            <div class="modal fade" id="staticBackdrop-ver-mas-${matriculado.idMatriculado}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="copy-to-clipboard">
                            <span class="modal-title fs-5">ID:</span><span>${matriculado.idMatriculado}</span>
                            <svg id="copyButton-${matriculado.idMatriculado}" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-clipboard copyButton" viewBox="0 0 16 16">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                            </svg>
                            <svg id="copyButtonSucceed-${matriculado.idMatriculado}" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-clipboard-check copyButtonSucceed" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                            </svg>
                            <p id="copiar-${matriculado.idMatriculado}" class="copiar">Copiar</p>
                            <p id="copia-exitosa-${matriculado.idMatriculado}" class="copia-exitosa">Copiado!</p>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-floating mb-3 form-group">
                                <input name="numero-matricula" type="number" class="form-control" maxlength="50" value="${matriculado.numeroMatricula}" placeholder disabled>
                                <label for="floatingInput">Número de Matrícula</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input name="nombres" type="text" maxlength="150" class="form-control" value="${matriculado.nombres}" placeholder disabled>
                                <label for="floatingInput">Nombre/s y Apellido</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input name="apellidos" type="text" maxlength="150" class="form-control" value="${matriculado.apellidos}" placeholder disabled>
                                <label for="floatingInput">Nombre/s y Apellido</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input name="dni" type="number" maxlength="9" class="form-control" value="${matriculado.dni}" placeholder disabled>
                                <label for="floatingInput">D.N.I. (Sin puntos)</label>
                            </div>
                            <span>Categoria de matricula</span>
                            <select id="categoria-${matriculado.idMatriculado}-2" name="categoria" class="form-select mb-3" aria-label="Default select example" disabled>
                                <option selected value="">Elegir una categoria</option>    
                                <option value="A">A</option>
                                <option id="categoria-b" value="B">B</option>
                                <option value="C">C</option>
                            </select>
                            <span>Becado o Monotributista (Si corresponde)</span>
                            <select id="becado-monotributista-${matriculado.idMatriculado}-2" name="becado-monotributista" class="form-select mb-3" value aria-label="Default select example" disabled>
                                <option selected value="NO CORRESPONDE">No corresponde</option>
                                <option selected value="BECADO">Becado</option>
                                <option value="MONOTRIBUTISTA">Monotributista</option>
                            </select>
                            <span>Estado</span>
                            <select id="estado-${matriculado.idMatriculado}-2" name="estado" class="form-select mb-3" aria-label="Default select example" disabled>
                                <option selected value="ACTIVO">Activo</option>
                                <option value="IRREGULAR">Irregular</option>
                                <option value="SUSPENDIDO">Suspendido</option>
                            </select>
                            <div class="form-floating mb-3 form-group">
                                <input name="enlace-legajo" type="text" class="form-control" value="${matriculado.linkLegajo}" placeholder required disabled>
                                <label for="floatingInput">Enlace legajo</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input name="email" type="email" maxlength="150" class="form-control" value="${matriculado.email}" placeholder required disabled>
                                <label for="floatingInput">Email</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input name="telContacto" type="number" class="form-control" maxlength="15" value="${matriculado.telContacto}" placeholder required disabled>
                                <label for="floatingInput">Télefono (sin 0 ni 15)</label>
                            </div>
                        </form>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
            </div>`;
            modalsVerMas.appendChild(divModalsVerMas);

            const modals = document.getElementById('modales-modificar');
            const divModals = document.createElement('div');
            divModals.classList.add('item-modal');
            divModals.innerHTML = `
            <div class="modal fade" id="staticBackdrop-${matriculado.idMatriculado}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                        <div class="copy-to-clipboard">
                            <span class="modal-title fs-5">ID:</span><span id="matriculado-id-${matriculado.idMatriculado}">${matriculado.idMatriculado}</span>
                            <svg id="copyButton-${matriculado.idMatriculado}" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-clipboard copyButton" viewBox="0 0 16 16">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                            </svg>
                            <svg id="copyButtonSucceed-${matriculado.idMatriculado}" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-clipboard-check copyButtonSucceed" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                            </svg>
                            <p id="copiar-${matriculado.idMatriculado}" class="copiar">Copiar</p>
                            <p id="copia-exitosa-${matriculado.idMatriculado}" class="copia-exitosa">Copiado!</p>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <form id="mi-formulario-${matriculado.idMatriculado}">
                            <div class="form-floating mb-3 form-group">
                                <input id="numero-matricula-${matriculado.idMatriculado}" name="numero-matricula" type="number" class="form-control" maxlength="50" value="${matriculado.numeroMatricula}" placeholder required>
                                <label for="floatingInput">Número de Matrícula</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input id="nombres-${matriculado.idMatriculado}" name="nombres" type="text" maxlength="150" class="form-control" value="${matriculado.nombres}" placeholder required>
                                <label for="floatingInput">Nombre/s y Apellido</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input id="apellidos-${matriculado.idMatriculado}" name="apellidos" type="text" maxlength="150" class="form-control" value="${matriculado.apellidos}" placeholder required>
                                <label for="floatingInput">Nombre/s y Apellido</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input id="dni-${matriculado.idMatriculado}" name="dni" type="number" maxlength="9" class="form-control" value="${matriculado.dni}" placeholder required>
                                <label for="floatingInput">D.N.I. (Sin puntos)</label>
                            </div>
                            <span>Categoria de matricula</span>
                            <select id="categoria-${matriculado.idMatriculado}" name="categoria" class="form-select mb-3" aria-label="Default select example">
                                <option selected value="">Elegir una categoria</option>    
                                <option value="A">A</option>
                                <option id="categoria-b" value="B">B</option>
                                <option value="C">C</option>
                            </select>
                            <span>Becado o Monotributista (Si corresponde)</span>
                            <select id="becado-monotributista-${matriculado.idMatriculado}" name="becado-monotributista" class="form-select mb-3" value aria-label="Default select example" disabled readonly>
                                <option selected value="NO CORRESPONDE">No corresponde</option>
                                <option selected value="BECADO">Becado</option>
                                <option value="MONOTRIBUTISTA">Monotributista</option>
                            </select>
                            <span>Estado</span>
                            <select id="estado-${matriculado.idMatriculado}" name="estado" class="form-select mb-3" aria-label="Default select example">
                                <option selected value="ACTIVO">Activo</option>
                                <option value="IRREGULAR">Irregular</option>
                                <option value="SUSPENDIDO">Suspendido</option>
                            </select>
                            <div class="form-floating mb-3 form-group">
                                <input id="enlace-legajo-${matriculado.idMatriculado}" name="enlace-legajo" type="text" class="form-control" value="${matriculado.linkLegajo}" placeholder required>
                                <label for="floatingInput">Enlace legajo</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input id="email-${matriculado.idMatriculado}" name="email" type="email" maxlength="150" class="form-control" value="${matriculado.email}" placeholder required>
                                <label for="floatingInput">Email</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input id="telContacto-${matriculado.idMatriculado}" name="telContacto" type="number" class="form-control" maxlength="15" value="${matriculado.telContacto}" placeholder required>
                                <label for="floatingInput">Télefono (sin 0 ni 15)</label>
                            </div>
                        </form>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button data-bs-target="#staticBackdrop-${matriculado.idMatriculado}-1" data-bs-toggle="modal" type="button" class="btn btn-success">Guardar Cambios</button>
                      </div>
                  </div>
              </div>
            </div>`;
            modals.appendChild(divModals);

            // Obtener el valor de matriculado.categoria
            const categoriaValue = `${matriculado.categoria}`;
            
            const monotributistaBecadoValue = `${matriculado.becadoOMonotributista}`;
            const selectEstadoValue = `${matriculado.matriculadoEstado}`;

            // Seleccionar el elemento select
            const selectCategoria = document.getElementById(`categoria-${matriculado.idMatriculado}`);
            const selectMonotributistaBecado = document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`);
            const selectEstado = document.getElementById(`estado-${matriculado.idMatriculado}`);

            // Asignar el valor de matriculado.categoria al select
            selectCategoria.value = categoriaValue;
            

            // Iterar sobre las opciones del select
            selectMonotributistaBecado.querySelectorAll('option').forEach(option => {
                // Verificar si el valor de la opción coincide con el valor de becadoOMonotributista
                if (option.value === monotributistaBecadoValue) {
                    // Establecer la opción como seleccionada
                    option.selected = true;
                }
            });

            selectEstado.querySelectorAll('option').forEach(option => {
                // Verificar si el valor de la opción coincide con el valor de becadoOMonotributista
                if (option.value === selectEstadoValue) {
                    // Establecer la opción como seleccionada
                    option.selected = true;
                }
            });

            // Seleccionar el elemento select
            const selectCategoriaVerMas = document.getElementById(`categoria-${matriculado.idMatriculado}-2`);
            const selectMonotributistaBecadoVerMas = document.getElementById(`becado-monotributista-${matriculado.idMatriculado}-2`);
            const selectEstadoVerMas = document.getElementById(`estado-${matriculado.idMatriculado}-2`);

            // Asignar el valor de matriculado.categoria al select
            selectCategoriaVerMas.value = categoriaValue;

            // Iterar sobre las opciones del select
            selectMonotributistaBecadoVerMas.querySelectorAll('option').forEach(option => {
                // Verificar si el valor de la opción coincide con el valor de becadoOMonotributista
                if (option.value === monotributistaBecadoValue) {
                    // Establecer la opción como seleccionada
                    option.selected = true;
                }
            });

            selectEstadoVerMas.querySelectorAll('option').forEach(option => {
                // Verificar si el valor de la opción coincide con el valor de becadoOMonotributista
                if (option.value === selectEstadoValue) {
                    // Establecer la opción como seleccionada
                    option.selected = true;
                }
            });


            const modalesCambios = document.getElementById('modales-confirmacion-cambios');
            const divModalsConfirmacion = document.createElement('div');
            divModalsConfirmacion.classList.add('item-modal');
            divModalsConfirmacion.innerHTML = `
            <div class="modal fade" id="staticBackdrop-${matriculado.idMatriculado}-1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Confirmar Cambios</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <p>Los cambios serán aplicados en el momento</p>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button id="understood-btn-${matriculado.idMatriculado}" type="submit" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                  </div>
              </div>
            </div>`;
            modalesCambios.appendChild(divModalsConfirmacion);

            const modalesCambiosConfirmados = document.getElementById('modales-cambios-confirmados');
            const divModalsConfirmado = document.createElement('div');
            divModalsConfirmado.classList.add('item-modal');
            divModalsConfirmado.innerHTML = `
            <div class="modal fade" id="staticBackdrop-${matriculado.idMatriculado}-2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Cambios realizados con éxito</h1>
                      </div>
                  </div>
              </div>
            </div>`;
            modalesCambiosConfirmados.appendChild(divModalsConfirmado);

            copiadoPortapapeles();

            const showModalBtn = document.querySelector(`[data-bs-target="#staticBackdrop-${matriculado.idMatriculado}"]`);
            const modal = new bootstrap.Modal(document.getElementById(`staticBackdrop-${matriculado.idMatriculado}`));

            showModalBtn.addEventListener('click', function(e) {
                e.preventDefault();
                modal.show();
            });

            const showModalBtnConfirmacion = document.querySelector(`[data-bs-target="#staticBackdrop-${matriculado.idMatriculado}-1"]`);
            const modalConfirmacion = new bootstrap.Modal(document.getElementById(`staticBackdrop-${matriculado.idMatriculado}-1`));

            showModalBtnConfirmacion.addEventListener('click', function(e) {
                e.preventDefault();
                camposValidos();
                modalConfirmacion.show();
            });

            if(document.getElementById(`categoria-${matriculado.idMatriculado}`).value !== "B"){
                document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`).setAttribute('value', 'No corresponde')
                document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`).setAttribute('disabled', 'disabled');
                document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`).setAttribute('readonly', 'readonly');
            } else{
                document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`).removeAttribute('disabled');
                document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`).removeAttribute('readonly');
            }

            document.getElementById(`categoria-${matriculado.idMatriculado}`).addEventListener('change', () => {

                const categoriaSeleccionada = document.getElementById(`categoria-${matriculado.idMatriculado}`).value;
            
                if (categoriaSeleccionada === "B") {
                    // Habilitar el select de becado-monotributista
                    document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`).removeAttribute('value')
                    document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`).removeAttribute('disabled');
                    document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`).removeAttribute('readonly');
                } else {
                    // Si no es "B", deshabilitar el select de becado-monotributista
                    document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`).setAttribute('value', 'No corresponde')
                    document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`).setAttribute('disabled', 'disabled');
                    document.getElementById(`becado-monotributista-${matriculado.idMatriculado}`).setAttribute('readonly', 'readonly');
                };
            })

            const modalConfirmado = new bootstrap.Modal(document.getElementById(`staticBackdrop-${matriculado.idMatriculado}-2`));

            document.getElementById(`understood-btn-${matriculado.idMatriculado}`).addEventListener("click", function(event) {
                // Evita que el formulario se envíe automáticamente
                event.preventDefault();
            
                // Verifica si todos los campos requeridos están completos
                if (camposValidos()) {
                    const formData = new FormData(document.getElementById(`mi-formulario-${matriculado.idMatriculado}`));
            
                    const formDataJSON = {
                        numeroMatricula: formData.get(`numero-matricula`),
                        nombress: formData.get(`nombres`),
                        apellidos: formData.get(`apellidos`),
                        dni: formData.get(`dni`),
                        categoria: formData.get(`categoria`),
                        becadoOMonotributista: formData.get(`becado-monotributista`),
                        matriculadoEstado: formData.get(`estado`),
                        linkLegajo: formData.get(`enlace-legajo`),
                        email: formData.get(`email`),
                        telContacto: formData.get(`telContacto`)
                    };
            
                    console.log(formDataJSON);

                    const authToken = localStorage.getItem('authToken');
            
                    fetch(apiUrlBase+`actualizarMatriculado/${matriculado.idMatriculado}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': 'Bearer ' + authToken
                        },
                        body: JSON.stringify(formDataJSON)
                    })
                    .then(response => {
                        // Verificar si la solicitud fue exitosa
                        if (response.ok) {
                            modalConfirmacion.hide();
                            modalConfirmado.show();
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

                const copyButton = document.getElementById(`copyButton-${matriculado.idMatriculado}`);
                const copyButtonSucceed = document.getElementById(`copyButtonSucceed-${matriculado.idMatriculado}`);
                const copiar = document.getElementById(`copiar-${matriculado.idMatriculado}`);
                const copiaExitosa = document.getElementById(`copia-exitosa-${matriculado.idMatriculado}`);

              function copiadoPortapapeles() {
                    "use strict";
                
                    function copyToClipboard(elem) {
                        var textToCopy = elem.value || elem.textContent;
                    
                        navigator.clipboard.writeText(textToCopy)
                        .then(function() {
                            console.log('Texto copiado al portapapeles');
                            // Realiza cualquier acción adicional después de copiar, como mostrar un mensaje de éxito.
                        })
                        .catch(function(err) {
                            console.error('Error al copiar el texto: ', err);
                            // Manejar errores aquí, si es necesario.
                        });
                    }
                
                    $(`#copyButton-${matriculado.idMatriculado}, #matriculado-id-${matriculado.idMatriculado} , #copyButtonSucceed-${matriculado.idMatriculado}`).on("click", function() {
                    copyToClipboard(document.getElementById(`matriculado-id-${matriculado.idMatriculado}`));
                    copyButton.style.display = 'none';
                    copiar.style.display = 'none';
                    copyButtonSucceed.style.display = 'block';
                    copiaExitosa.style.display = 'block';
                    });
                }

                function camposValidos() {
                    var numeroMatricula = document.getElementById(`numero-matricula-${matriculado.idMatriculado}`).value;
                    var nombres = document.getElementById(`nombres-${matriculado.idMatriculado}`).value;
                    var apellidos = document.getElementById(`apellidos-${matriculado.idMatriculado}`).value;
                    var dni = document.getElementById(`dni-${matriculado.idMatriculado}`).value;
                    var categoria = document.getElementById(`categoria-${matriculado.idMatriculado}`).value;
                    var estado = document.getElementById(`estado-${matriculado.idMatriculado}`).value;
                    // Verifica si los campos no están vacíos
                    if (numeroMatricula.trim() === '' || nombres.trim() === '' || apellidos.trim() === '' || 
                    dni.trim() === '' || categoria.trim() === '' || estado.trim() === '') {
                        return false;
                    } 
                    return true;
                }         

    });

        updatePagination(); // Actualizar la paginación después de cargar los matriculados

        document.getElementById('cantidad-matriculados').innerText = `Total de matriculados: ${data.length}`;

        ocultarCargando();

        return Promise.resolve(); // Promesa resuelta para indicar que la carga de matriculados se completó correctamente
    } catch (error) {
        return Promise.reject(error); // Rechazar la promesa en caso de error
    }
}

const buscarMatriculadoBtn = document.getElementById('buscar-matriculado');
const dniMatriculado = document.getElementById('input-dni-matriculado')

buscarMatriculadoBtn.addEventListener('click', function (e) {
    e.preventDefault();
    cargarMatriculados(dniMatriculado.value, 1);
});


function updatePagination() {
    const paginas = document.querySelectorAll('.pagination .page-item');
    paginas.forEach(function(pagina) {
        pagina.classList.remove('active');
        if (parseInt(pagina.querySelector('.page-link').textContent) === paginaActual) {
            pagina.classList.add('active');
        }
    });
    // Actualizar el estado de los botones de página anterior y siguiente
    // según la página actual y el número total de páginas
    if (paginaActual === totalPages && paginaActual === 1) {
        nextPageBtn.parentElement.style.display = 'none';
        lastPageBtn.parentElement.style.display = 'none';
        previousPageBtn.parentElement.style.display = 'none';
        firstPageBtn.parentElement.style.display = 'none';
      } else if(paginaActual === totalPages) {
        nextPageBtn.parentElement.style.display = 'none';
        lastPageBtn.parentElement.style.display = 'none';
        previousPageBtn.parentElement.style.display = 'list-item';
        firstPageBtn.parentElement.style.display = 'list-item';
      } else if(paginaActual === 1) {
        previousPageBtn.parentElement.style.display = 'none';
        firstPageBtn.parentElement.style.display = 'none';
        nextPageBtn.parentElement.style.display = 'list-item';
        lastPageBtn.parentElement.style.display = 'list-item';
      } else {
        previousPageBtn.parentElement.style.display = 'list-item';
        nextPageBtn.parentElement.style.display = 'list-item';
        firstPageBtn.parentElement.style.display = 'list-item';
        lastPageBtn.parentElement.style.display = 'list-item';
      }
}

async function paginadoInicial() {
    try {
        const response = await fetch(apiUrlBase, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
                }
            });
        const data = await response.json();

        const cantidadMatriculados = data.length;
        const cantidadPaginas = Math.ceil(cantidadMatriculados / matriculadosPorPagina);
        totalPages = cantidadPaginas;

        // Inicializar la paginación
        const paginadoList = document.getElementById('pagination');
        for (let index = 1; index <= cantidadPaginas; index++) {
            const newPageItem = document.createElement('li');
            newPageItem.classList.add('page-item');
            if (index === paginaActual) {
                newPageItem.classList.add('active');
            }
            const newPageLink = document.createElement('a');
            newPageLink.classList.add('page-link');
            newPageLink.href = '#';
            newPageLink.textContent = index;
            newPageItem.appendChild(newPageLink);
            paginadoList.appendChild(newPageItem);
            paginadoList.insertBefore(newPageItem, nextPageBtn.parentNode);
        }
        updatePagination();
    } catch (error) {
        console.error('No se cargaron todas los matriculados:', error);
    }
}

document.getElementById('pagination').addEventListener('click', function(event) {
    if (event.target.tagName === 'A' && !event.target.classList.contains('page-link-disabled')) {
        event.preventDefault();
        const paginaClicada = parseInt(event.target.textContent);
        if (!isNaN(paginaClicada) && paginaClicada !== paginaActual) {
            paginaActual = paginaClicada;
            cargarMatriculados(paginaActual)
                .then(() => updatePagination())
                .catch(error => console.error('Error al cargar los matriculados:', error));
        }

        if(event.target.classList.contains('previous-page')) {
            cargarMatriculados(paginaActual - 1);
            paginaActual--;
        };
        
        if(event.target.classList.contains('next-page')) {
            cargarMatriculados(paginaActual + 1);
            paginaActual++;
        };

        if(event.target.classList.contains('first-page')) {
            cargarMatriculados(1);
            paginaActual = 1;
        };

        if(event.target.classList.contains('last-page')) {
            cargarMatriculados(totalPages);
            paginaActual = totalPages;
        };
    }
});
