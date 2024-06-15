import { mostrarCargando, ocultarCargando } from "./loading.js";

const apiUrlBase = "https://api-trab-sociales.zeabur.app/factura/";
const authToken = localStorage.getItem("authToken");
const facturasPorPagina = 15;
const previousPageBtn = document.getElementById("previous-page");
const nextPageBtn = document.getElementById("next-page");
const firstPageBtn = document.getElementById("first-page");
const lastPageBtn = document.getElementById("last-page");
let totalPages = 1;
let paginaActual = 1;

window.addEventListener("load", function () {
  cargarFacturas("", "", 1)
    .then(() => {
      paginadoInicial();
    })
    .catch((error) => console.error("Error al cargar las facturas:", error));
});

async function cargarFacturas(dni, numeroMatriculado, numeroPagina) {
  try {
    mostrarCargando();
    const apiUrl = `${apiUrlBase}?dni=${dni}&numeroMatricula=${numeroMatriculado}&?pagina=${numeroPagina}&facturasPorPagina=${facturasPorPagina}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });
    const data = await response.json();
    const facturas = data;

    if (data.length >= 15) {
      document.querySelector("footer").style.position = "relative";
    }

    const facturasList = document.getElementById("tabla-facturas");
    facturasList.innerHTML = "";

    facturas.forEach((factura, index) => {
      // Crear elementos de facturas
      const tr = document.createElement("tr");
      tr.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${factura.numeroMatriculado}</td>
                    <td>${factura.anio}</td>
                    <td>${factura.monto}</td>
                    <td id=${factura.idFactura}>${factura.pagoEstado}</td>
                    <td>${factura.saldo}</td>
                    <td class="centrado-ver"><a href="" data-bs-target="#staticBackdrop-ver-mas-${
                      factura.idFactura
                    }" data-bs-toggle="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                    </a></td>
                    <td class="boton-modificar"><a href="" data-bs-target="#staticBackdrop-${
                      factura.idFactura
                    }" data-bs-toggle="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </a></td>`;
      facturasList.appendChild(tr);

      if ("pago parcial".toUpperCase() === factura.pagoEstado.toUpperCase()) {
        document
          .getElementById(`${factura.idFactura}`)
          .setAttribute("style", "color: yellow");
      } else if ("impago".toUpperCase() === factura.pagoEstado.toUpperCase()) {
        document
          .getElementById(`${factura.idFactura}`)
          .setAttribute("style", "color: red");
      } else {
        document
          .getElementById(`${factura.idFactura}`)
          .setAttribute("style", "color: green");
      }

      const modalsVerMas = document.getElementById("modales-ver-mas");
      const divModalsVerMas = document.createElement("div");
      divModalsVerMas.classList.add("item-modal");
      divModalsVerMas.innerHTML = `
            <div class="modal fade" id="staticBackdrop-ver-mas-${factura.idFactura}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="copy-to-clipboard">
                            <span class="modal-title fs-5">ID:</span><span id="factura-id-${factura.idFactura}">${factura.idFactura}</span>
                            <svg id="copyButton-${factura.idFactura}" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-clipboard copyButton" viewBox="0 0 16 16">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                            </svg>
                            <svg id="copyButtonSucceed-${factura.idFactura}" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-clipboard-check copyButtonSucceed" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                            </svg>
                            <p id="copiar-${factura.idFactura}" class="copiar">Copiar</p>
                            <p id="copia-exitosa-${factura.idFactura}" class="copia-exitosa">Copiado!</p>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-floating mb-3 form-group">
                                <input name="numero-matricula" type="number" class="form-control" maxlength="50" value="${factura.numeroMatriculado}" placeholder disabled>
                                <label for="floatingInput">N° de Matrícula</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input name="anio" type="number" maxlength="150" class="form-control" value="${factura.anio}" placeholder disabled>
                                <label for="floatingInput">Año</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input name="monto" type="number" maxlength="150" class="form-control" value="${factura.monto}" placeholder disabled>
                                <label for="floatingInput">Monto</label>
                            </div>
                            <span>En convenio</span>
                            <select id="en-convenio-${factura.idFactura}" name="en-convenio" class="form-select mb-3" aria-label="Default select example" required disabled>
                                <option selected value="NO">No</option>
                                <option value="SI">Si</option>
                            </select>
                            <span>Estado de pago</span>
                            <select id="pago-estado-${factura.idFactura}" name="pago-estado" class="form-select mb-3" aria-label="Default select example" required disabled>
                                <option selected value="IMPAGO">Impago</option>
                                <option value="PAGO PARCIAL">Pago Parcial</option>
                                <option value="PAGADO">Pagado</option>
                            </select>
                            <div class="form-floating mb-3 form-group">
                                <input name="saldo" type="number" maxlength="150" class="form-control" value="${factura.saldo}" placeholder disabled>
                                <label for="floatingInput">Saldo</label>
                            </div>
                        </form>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
            </div>`;
      modalsVerMas.appendChild(divModalsVerMas);

      const modals = document.getElementById("modales-modificar");
      const divModals = document.createElement("div");
      divModals.classList.add("item-modal");
      divModals.innerHTML = `
            <div class="modal fade" id="staticBackdrop-${factura.idFactura}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                        <div class="copy-to-clipboard">
                            <span class="modal-title fs-5">ID:</span><span id="factura-id-${factura.idFactura}-2">${factura.idFactura}</span>
                            <svg id="copyButton-${factura.idFactura}-2" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-clipboard copyButton" viewBox="0 0 16 16">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                            </svg>
                            <svg id="copyButtonSucceed-${factura.idFactura}-2" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-clipboard-check copyButtonSucceed" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                            </svg>
                            <p id="copiar-${factura.idFactura}-2" class="copiar">Copiar</p>
                            <p id="copia-exitosa-${factura.idFactura}-2" class="copia-exitosa">Copiado!</p>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <form id="mi-formulario-${factura.idFactura}">
                            <div class="form-floating mb-3 form-group">
                                <input id="numero-matricula-${factura.idFactura}" name="numero-matricula" type="number" class="form-control" maxlength="50" value="${factura.numeroMatriculado}" placeholder required>
                                <label for="floatingInput">N° de Matrícula</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input id="anio-${factura.idFactura}" name="anio" type="number" maxlength="150" class="form-control" value="${factura.anio}" placeholder required>
                                <label for="floatingInput">Año</label>
                            </div>
                            <div class="form-floating mb-3 form-group">
                                <input id="monto-${factura.idFactura}" name="monto" type="number" maxlength="150" class="form-control" value="${factura.monto}" placeholder required>
                                <label for="floatingInput">Monto</label>
                            </div>
                            <span>En convenio</span>
                            <select id="en-convenio-${factura.idFactura}-2" name="en-convenio" class="form-select mb-3" aria-label="Default select example" required>
                                <option selected value="NO">No</option>
                                <option value="SI">Si</option>
                            </select>
                            <span>Estado de pago</span>
                            <select id="pago-estado-${factura.idFactura}-2" name="pago-estado" class="form-select mb-3" aria-label="Default select example" required>
                                <option selected value="IMPAGO">Impago</option>
                                <option value="PAGO PARCIAL">Pago Parcial</option>
                                <option value="PAGADO">Pagado</option>
                            </select>
                            <div class="form-floating mb-3 form-group">
                                <input name="saldo" type="number" maxlength="150" class="form-control" value="${factura.saldo}" placeholder required disabled>
                                <label for="floatingInput">Saldo</label>
                            </div>
                        </form>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button data-bs-target="#staticBackdrop-${factura.idFactura}-1" data-bs-toggle="modal" type="button" class="btn btn-success">Guardar Cambios</button>
                      </div>
                  </div>
              </div>
            </div>`;
      modals.appendChild(divModals);

      // Obtener los valores de factura
      const estadoPagoValue = `${factura.pagoEstado}`;
      const enConvenioValue = `${factura.enConvenio}`;

      // Seleccionar el elemento select
      const selectPagoEstado = document.getElementById(
        `pago-estado-${factura.idFactura}`
      );
      const selectPagoEstado2 = document.getElementById(
        `pago-estado-${factura.idFactura}-2`
      );
      const selectEnConvenio = document.getElementById(
        `en-convenio-${factura.idFactura}`
      );
      const selectEnConvenio2 = document.getElementById(
        `en-convenio-${factura.idFactura}-2`
      );

      // Asignar el valor al select
      selectPagoEstado.value = estadoPagoValue;
      selectPagoEstado2.value = estadoPagoValue;
      selectEnConvenio.value = enConvenioValue;
      selectEnConvenio2.value = enConvenioValue;

      const modalesCambios = document.getElementById(
        "modales-confirmacion-cambios"
      );
      const divModalsConfirmacion = document.createElement("div");
      divModalsConfirmacion.classList.add("item-modal");
      divModalsConfirmacion.innerHTML = `
            <div class="modal fade" id="staticBackdrop-${factura.idFactura}-1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
                    <button id="understood-btn-${factura.idFactura}" type="submit" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                  </div>
              </div>
            </div>`;
      modalesCambios.appendChild(divModalsConfirmacion);

      const modalesCambiosConfirmados = document.getElementById(
        "modales-cambios-confirmados"
      );
      const divModalsConfirmado = document.createElement("div");
      divModalsConfirmado.classList.add("item-modal");
      divModalsConfirmado.innerHTML = `
            <div class="modal fade" id="staticBackdrop-${factura.idFactura}-2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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

      const showModalBtn = document.querySelector(
        `[data-bs-target="#staticBackdrop-${factura.idFactura}"]`
      );
      const modal = new bootstrap.Modal(
        document.getElementById(`staticBackdrop-${factura.idFactura}`)
      );

      showModalBtn.addEventListener("click", function (e) {
        e.preventDefault();
        modal.show();
      });

      const showModalBtnConfirmacion = document.querySelector(
        `[data-bs-target="#staticBackdrop-${factura.idFactura}-1"]`
      );
      const modalConfirmacion = new bootstrap.Modal(
        document.getElementById(`staticBackdrop-${factura.idFactura}-1`)
      );

      showModalBtnConfirmacion.addEventListener("click", function (e) {
        e.preventDefault();
        camposValidos();
        modalConfirmacion.show();
      });

      const modalConfirmado = new bootstrap.Modal(
        document.getElementById(`staticBackdrop-${factura.idFactura}-2`)
      );

      document
        .getElementById(`understood-btn-${factura.idFactura}`)
        .addEventListener("click", function (event) {
          // Evita que el formulario se envíe automáticamente
          event.preventDefault();

          // Verifica si todos los campos requeridos están completos
          if (camposValidos()) {
            const formData = new FormData(
              document.getElementById(`mi-formulario-${factura.idFactura}`)
            );

            const formDataJSON = {
              numeroMatricula: formData.get(`numero-matricula`),
              anio: formData.get(`anio`),
              monto: formData.get(`monto`),
              pagoEstado: formData.get(`estado-pago`),
              enConvenio: formData.get(`en-convenio`),
            };

            console.log(formDataJSON);

            const authToken = localStorage.getItem("authToken");

            fetch(
              apiUrl+`actualizarFactura/${factura.idFactura}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + authToken,
                },
                body: JSON.stringify(formDataJSON),
              }
            ).then((response) => {
              // Verificar si la solicitud fue exitosa
              if (response.ok) {
                modalConfirmacion.hide();
                modalConfirmado.show();
                // Mostrar la ventana modal de confirmación
                setTimeout(function () {
                  window.location.reload();
                }, 3000); // ajusta el tiempo según sea necesario
              } else {
                // Manejar el caso de error
                throw new Error("Hubo un problema al enviar el formulario.");
              }
            });
          } else {
            // Si faltan campos, muestra un mensaje de error o realiza alguna otra acción
            alert(
              "Por favor, complete los campos obligatorios antes de enviar."
            );
          }
        });

      const copyButton = document.getElementById(
        `copyButton-${factura.idFactura}`
      );
      const copyButton2 = document.getElementById(
        `copyButton-${factura.idFactura}-2`
      );
      const copyButtonSucceed = document.getElementById(
        `copyButtonSucceed-${factura.idFactura}`
      );
      const copyButtonSucceed2 = document.getElementById(
        `copyButtonSucceed-${factura.idFactura}-2`
      );
      const copiar = document.getElementById(`copiar-${factura.idFactura}`);
      const copiar2 = document.getElementById(`copiar-${factura.idFactura}-2`);
      const copiaExitosa = document.getElementById(
        `copia-exitosa-${factura.idFactura}`
      );
      const copiaExitosa2 = document.getElementById(
        `copia-exitosa-${factura.idFactura}-2`
      );

      function copiadoPortapapeles() {
        "use strict";

        function copyToClipboard(elem) {
          var textToCopy = elem.value || elem.textContent;

          navigator.clipboard
            .writeText(textToCopy)
            .then(function () {
              console.log("Texto copiado al portapapeles");
              // Realiza cualquier acción adicional después de copiar, como mostrar un mensaje de éxito.
            })
            .catch(function (err) {
              console.error("Error al copiar el texto: ", err);
              // Manejar errores aquí, si es necesario.
            });
        }

        $(
          `#copyButton-${factura.idFactura}, #factura-id-${factura.idFactura} , #copyButtonSucceed-${factura.idFactura}`
        ).on("click", function () {
          copyToClipboard(
            document.getElementById(`factura-id-${factura.idFactura}`)
          );
          copyButton.style.display = "none";
          copiar.style.display = "none";
          copyButtonSucceed.style.display = "block";
          copiaExitosa.style.display = "block";
        });

        $(
          `#copyButton-${factura.idFactura}-2, #factura-id-${factura.idFactura}-2 , #copyButtonSucceed-${factura.idFactura}-2`
        ).on("click", function () {
          copyToClipboard(
            document.getElementById(`factura-id-${factura.idFactura}-2`)
          );
          copyButton2.style.display = "none";
          copiar2.style.display = "none";
          copyButtonSucceed2.style.display = "block";
          copiaExitosa2.style.display = "block";
        });
      }

      function camposValidos() {
        var numeroMatricula = document.getElementById(
          `numero-matricula-${factura.idFactura}`
        ).value;
        var anio = document.getElementById(`anio-${factura.idFactura}`).value;
        var monto = document.getElementById(`monto-${factura.idFactura}`).value;
        var pagoEstado = document.getElementById(
          `pago-estado-${factura.idFactura}`
        ).value;
        var enConvenio = document.getElementById(
          `en-convenio-${factura.idFactura}`
        ).value;
        // Verifica si los campos no están vacíos
        if (
          numeroMatricula.trim() === "" ||
          anio.trim() === "" ||
          monto.trim() === "" ||
          pagoEstado.trim() === "" ||
          enConvenio.trim() === ""
        ) {
          return false;
        }
        return true;
      }
    });

    updatePagination(); // Actualizar la paginación después de cargar las facturas

    document.getElementById(
      "cantidad-facturas"
    ).innerText = `Total de facturas: ${data.length}`;

    ocultarCargando();

    return Promise.resolve(); // Promesa resuelta para indicar que la carga de facturas se completó correctamente
  } catch (error) {
    return Promise.reject(error); // Rechazar la promesa en caso de error
  }
}

const buscarFacturaBtn = document.getElementById("buscar-factura");
const dniFactura = document.getElementById("input-dni-factura");
const matriculaFactura = document.getElementById("input-matriculado-factura");

buscarFacturaBtn.addEventListener("click", function (e) {
  e.preventDefault();
  cargarFacturas(dniFactura.value, matriculaFactura.value, 1);
});

async function buscarFacturasPorCategoria(
  categoria,
  becadoMonotributista,
  anio
) {
  try {
    const apiUrl = `${apiUrlBase}getByCategoria?categoria=${categoria}&becadoMono=${becadoMonotributista}&anio=${anio}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data[0]);

      const primerResultado = data[0];


      //primeros modales para modificar facturas
      const modalesModificar = document.getElementById(
        "modales-modificar-facturas"
      );
      modalesModificar.innerHTML = "";

      const divModalsModificar = document.createElement("div");
      divModalsModificar.classList.add("item-modal");
      divModalsModificar.innerHTML = `
            <div class="modal fade" id="staticBackdrop-modificar-${primerResultado.idFactura}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formulario-categoria-${primerResultado.idFactura}">
                                <div class="form-floating mb-3 form-group">
                                    <input name="categoria" type="text" class="form-control" maxlength="50" value="${categoria}" placeholder disabled>
                                    <label for="floatingInput">Categoría</label>
                                </div>
                                <div class="form-floating mb-3 form-group">
                                    <input name="becado-monotributista" type="text" maxlength="150" class="form-control" value="${becadoMonotributista}" placeholder disabled>
                                    <label for="floatingInput">Becado/Monotributista</label>
                                </div>
                                <div class="form-floating mb-3 form-group">
                                    <input name="anio" type="number" maxlength="150" class="form-control" value="${primerResultado.anio}" placeholder disabled>
                                    <label for="floatingInput">Año</label>
                                </div>
                                <div class="form-floating mb-3 form-group">
                                    <input name="monto" type="number" maxlength="150" class="form-control" value="${primerResultado.monto}" placeholder disabled>
                                    <label for="floatingInput">Monto</label>
                                </div>
                                <div class="form-floating mb-3 form-group">
                                    <input id="nuevo-monto-${primerResultado.idFactura}" name="nuevo-monto" type="number" maxlength="150" class="form-control" value="" placeholder>
                                    <label for="floatingInput">Nuevo Monto</label>
                                </div>
                            </form>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button data-bs-target="#staticBackdrop-modificar-confirmar-${primerResultado.idFactura}" data-bs-toggle="modal" type="button" class="btn btn-success">Confirmar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
      modalesModificar.appendChild(divModalsModificar);


      //segundos modales de consulta de confirmacion de cambios
      const modalesCambiosConfirmadosFacturas = document.getElementById(
        "modales-cambios-facturas-confirmados"
      );
      modalesCambiosConfirmadosFacturas.innerHTML = "";

      const divModalsConfirmacionModificacion = document.createElement("div");
      divModalsConfirmacionModificacion.classList.add("item-modal");
      divModalsConfirmacionModificacion.innerHTML = `
            <div class="modal fade" id="staticBackdrop-modificar-confirmar-${primerResultado.idFactura}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
                            <button id="boton-de-confirmado-${primerResultado.idFactura}" type="submit" class="btn btn-success">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            </div>`;
      modalesCambiosConfirmadosFacturas.appendChild(
        divModalsConfirmacionModificacion
      );


      //modales de cambios confirmados con exito
      const modalesCambiosCorrectos = document.getElementById(
        "modales-cambios-correctos"
      );
      modalesCambiosCorrectos.innerHTML = "";

      const divModalsCambiosCorrectos = document.createElement("div");
      divModalsCambiosCorrectos.classList.add("item-modal");
      divModalsCambiosCorrectos.innerHTML = `
            <div class="modal fade" id="staticBackdrop-modificar-success-${primerResultado.idFactura}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <p>Cambios aplicados</p>
                        </div>
                    </div>
                </div>
            </div>`;
      modalesCambiosCorrectos.appendChild(divModalsCambiosCorrectos);



      const modalModificar = new bootstrap.Modal(document.getElementById(`staticBackdrop-modificar-${primerResultado.idFactura}`));
      function mostrarModalModificar(){
        modalModificar.show();
      }

      const showModalBtnConfirmacion = document.querySelector(`[data-bs-target="#staticBackdrop-modificar-confirmar-${primerResultado.idFactura}"]`);
      const modalConfirmar = new bootstrap.Modal(document.getElementById(`staticBackdrop-modificar-confirmar-${primerResultado.idFactura}`));
      showModalBtnConfirmacion.addEventListener('click', function(){
        modalConfirmar.show();
      })

      const modalSuccess = new bootstrap.Modal(document.getElementById(`staticBackdrop-modificar-success-${primerResultado.idFactura}`));

      console.log('antes del put');
      document.getElementById(`boton-de-confirmado-${primerResultado.idFactura}`).addEventListener('click', function (event) {
          event.preventDefault();
          if (camposValidos()) {
            const formData = new FormData(
              document.getElementById(
                `formulario-categoria-${primerResultado.idFactura}`
              )
            );
            const formDataJSON = {
              monto: formData.get(`nuevo-monto`)
            };

            console.log(formDataJSON);

            fetch(
              `${apiUrlBase}actualizarFacturas?categoria=${categoria}&becadoMono=${becadoMonotributista}&anio=${anio}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + authToken,
                },
                body: JSON.stringify(formDataJSON),
              }
            )
              .then((response) => {
                if (response.ok) {
                  modalConfirmar.hide();
                  modalSuccess.show();
                  setTimeout(function () {
                    window.location.reload();
                  }, 3000);
                } else {
                  throw new Error("Hubo un problema al enviar el formulario.");
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          } else {
            alert(
              "Por favor, complete los campos obligatorios antes de enviar."
            );
          }
        });

      function camposValidos() {
        const monto = document.getElementById(
          `nuevo-monto-${primerResultado.idFactura}`
        ).value;
        return monto.trim() !== "";
      }

      mostrarModalModificar();
    } else if (response.status === 403) {
      alert("No existen facturas en esa categoría");
    } else {
      throw new Error(
        `Error de validación del token: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

document
  .getElementById("buscar-por-categoria")
  .addEventListener("click", function (e) {
    e.preventDefault();
    const categoria = document.getElementById("categoria").value.trim();
    const becadoMonotributista = document.getElementById(
      "becado-monotributista"
    ).value.trim();
    const anio = document.getElementById("anio").value.trim();
    console.log(categoria+becadoMonotributista+anio);
    buscarFacturasPorCategoria(categoria, becadoMonotributista, anio);
  });

function updatePagination() {
  const paginas = document.querySelectorAll(".pagination .page-item");
  paginas.forEach(function (pagina) {
    pagina.classList.remove("active");
    if (
      parseInt(pagina.querySelector(".page-link").textContent) === paginaActual
    ) {
      pagina.classList.add("active");
    }
  });
  // Actualizar el estado de los botones de página anterior y siguiente
  // según la página actual y el número total de páginas
  if (paginaActual === totalPages && paginaActual === 1) {
    nextPageBtn.parentElement.style.display = "none";
    lastPageBtn.parentElement.style.display = "none";
    previousPageBtn.parentElement.style.display = "none";
    firstPageBtn.parentElement.style.display = "none";
  } else if (paginaActual === totalPages) {
    nextPageBtn.parentElement.style.display = "none";
    lastPageBtn.parentElement.style.display = "none";
    previousPageBtn.parentElement.style.display = "list-item";
    firstPageBtn.parentElement.style.display = "list-item";
  } else if (paginaActual === 1) {
    previousPageBtn.parentElement.style.display = "none";
    firstPageBtn.parentElement.style.display = "none";
    nextPageBtn.parentElement.style.display = "list-item";
    lastPageBtn.parentElement.style.display = "list-item";
  } else {
    previousPageBtn.parentElement.style.display = "list-item";
    nextPageBtn.parentElement.style.display = "list-item";
    firstPageBtn.parentElement.style.display = "list-item";
    lastPageBtn.parentElement.style.display = "list-item";
  }
}

async function paginadoInicial() {
  try {
    const response = await fetch(apiUrlBase, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });
    const data = await response.json();

    const cantidadFacturas = data.length;
    const cantidadPaginas = Math.ceil(cantidadFacturas / facturasPorPagina);
    totalPages = cantidadPaginas;

    // Inicializar la paginación
    const paginadoList = document.getElementById("pagination");
    for (let index = 1; index <= cantidadPaginas; index++) {
      const newPageItem = document.createElement("li");
      newPageItem.classList.add("page-item");
      if (index === paginaActual) {
        newPageItem.classList.add("active");
      }
      const newPageLink = document.createElement("a");
      newPageLink.classList.add("page-link");
      newPageLink.href = "#";
      newPageLink.textContent = index;
      newPageItem.appendChild(newPageLink);
      paginadoList.appendChild(newPageItem);
      paginadoList.insertBefore(newPageItem, nextPageBtn.parentNode);
    }
    updatePagination();
  } catch (error) {
    console.error("No se cargaron todas las facturas:", error);
  }
}

document
  .getElementById("pagination")
  .addEventListener("click", function (event) {
    if (
      event.target.tagName === "A" &&
      !event.target.classList.contains("page-link-disabled")
    ) {
      event.preventDefault();
      const paginaClicada = parseInt(event.target.textContent);
      if (!isNaN(paginaClicada) && paginaClicada !== paginaActual) {
        paginaActual = paginaClicada;
        cargarFacturas(paginaActual)
          .then(() => updatePagination())
          .catch((error) =>
            console.error("Error al cargar las facturas:", error)
          );
      }

      if (event.target.classList.contains("previous-page")) {
        cargarFacturas(paginaActual - 1);
        paginaActual--;
      }

      if (event.target.classList.contains("next-page")) {
        cargarFacturas(paginaActual + 1);
        paginaActual++;
      }

      if (event.target.classList.contains("first-page")) {
        cargarFacturas(1);
        paginaActual = 1;
      }

      if (event.target.classList.contains("last-page")) {
        cargarFacturas(totalPages);
        paginaActual = totalPages;
      }
    }
  });

document.getElementById("categoria").addEventListener("change", () => {
  const categoriaSeleccionada = document.getElementById("categoria").value;

  if (categoriaSeleccionada === "B") {
    // Habilitar el select de becado-monotributista
    document.getElementById("becado-monotributista").removeAttribute("value");
    document
      .getElementById("becado-monotributista")
      .removeAttribute("disabled");
  } else {
    // Si no es "B", deshabilitar el select de becado-monotributista
    document
      .getElementById("becado-monotributista")
      .setAttribute("value", "NO CORRESPONDE");
    document
      .getElementById("becado-monotributista")
      .setAttribute("disabled", "disabled");
  }
});
