(() => {

    console.log("productos-destacados.js cargado");


    /* =========================
       ELEMENTOS
    ========================= */

    const contenedorDestacados =
        document.getElementById("productosDestacados");

    const contenedorTodos =
        document.getElementById("todosLosProductos");

    const contador =
        document.getElementById("contadorDestacados");

    const botonGuardar =
        document.getElementById("guardarDestacados");

    const mensaje =
        document.getElementById("mensajeGuardado");


    let productos = [];

    let cambiosPendientes = false;


    /* =========================
       ESPERAR SUPABASE
    ========================= */

    function esperarSupabase() {

        if (typeof supabaseClient === "undefined") {

            console.error(
                "supabaseClient no está disponible."
            );

            return false;
        }

        return true;
    }


    /* =========================
       CARGAR PRODUCTOS
    ========================= */

    async function cargarProductos() {

        if (!esperarSupabase()) {
            return;
        }

        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("productos")
                .select("*")
                .order("orden", {
                    ascending: true
                });


            if (error) {
                throw error;
            }


            productos = data || [];


            console.log(
                "Productos cargados:",
                productos
            );


            mostrarProductos();


        } catch (error) {

            console.error(
                "Error cargando productos:",
                error
            );


            if (contenedorDestacados) {

                contenedorDestacados.innerHTML = `
                    <p>
                        No se pudieron cargar los productos.
                    </p>
                `;

            }

        }

    }


    /* =========================
       SABER SI ES DESTACADO
    ========================= */

    function esDestacado(producto) {

        return (
            producto.destacado === true ||
            producto.destacado === 1 ||
            producto.destacado === "1"
        );

    }


    /* =========================
       MARCAR CAMBIOS
    ========================= */

    function marcarCambios() {

        cambiosPendientes = true;


        if (botonGuardar) {

            botonGuardar.classList.add(
                "cambios-pendientes"
            );

        }


        if (mensaje) {

            mensaje.className =
                "mensaje-pendiente";

            mensaje.innerHTML = `
                <span class="mensaje-icono">●</span>
                Hay cambios sin guardar
            `;

        }

    }


    /* =========================
       MOSTRAR PRODUCTOS
    ========================= */

    function mostrarProductos() {

        if (
            !contenedorDestacados ||
            !contenedorTodos
        ) {

            return;

        }


        contenedorDestacados.innerHTML = "";
        contenedorTodos.innerHTML = "";


        const destacados =
            productos
                .filter(esDestacado)
                .sort(
                    (a, b) =>
                        Number(a.orden || 0) -
                        Number(b.orden || 0)
                );


        /* =========================
           DESTACADOS
        ========================= */

        if (destacados.length === 0) {

            contenedorDestacados.innerHTML = `
                <p class="sin-destacados">
                    Todavía no hay productos destacados.
                </p>
            `;

        }


        destacados.forEach(producto => {

            contenedorDestacados.appendChild(
                crearTarjetaDestacada(producto)
            );

        });


        /* =========================
           TODOS
        ========================= */

        productos.forEach(producto => {

            contenedorTodos.appendChild(
                crearTarjetaProducto(producto)
            );

        });


        actualizarContador();

        activarArrastre();

    }


    /* =========================
       TARJETA DESTACADA
    ========================= */

    function crearTarjetaDestacada(producto) {

        const tarjeta =
            document.createElement("div");


        tarjeta.className =
            "producto-destacado";


        tarjeta.draggable = true;


        tarjeta.dataset.id =
            producto.id;


        tarjeta.innerHTML = `

            <div class="drag-handle">
                ☰
            </div>

            <div class="producto-imagen">

                ${
                    producto.imagen

                    ? `
                        <img
                            src="${producto.imagen}"
                            alt="${producto.nombre}"
                        >
                    `

                    : `
                        <div class="sin-imagen">
                            Sin imagen
                        </div>
                    `
                }

            </div>

            <div class="producto-info">

                <strong>
                    ${producto.nombre}
                </strong>

                <small>
                    ${producto.descripcion || ""}
                </small>

            </div>

        `;


        return tarjeta;

    }


    /* =========================
       TARJETA NORMAL
    ========================= */

    function crearTarjetaProducto(producto) {

        const tarjeta =
            document.createElement("div");


        tarjeta.className =
            "producto-disponible";


        tarjeta.dataset.id =
            producto.id;


        tarjeta.innerHTML = `

            <div class="producto-checkbox">

                <input
                    type="checkbox"
                    ${
                        esDestacado(producto)
                            ? "checked"
                            : ""
                    }
                >

            </div>

            <div class="producto-imagen">

                ${
                    producto.imagen

                    ? `
                        <img
                            src="${producto.imagen}"
                            alt="${producto.nombre}"
                        >
                    `

                    : `
                        <div class="sin-imagen">
                            Sin imagen
                        </div>
                    `
                }

            </div>

            <div class="producto-info">

                <strong>
                    ${producto.nombre}
                </strong>

                <small>
                    ${producto.descripcion || ""}
                </small>

            </div>

        `;


        const checkbox =
            tarjeta.querySelector("input");


        checkbox.addEventListener(
            "change",
            () => {

                cambiarDestacadoLocal(
                    producto,
                    checkbox.checked
                );

            }
        );


        return tarjeta;

    }


    /* =========================
       CAMBIAR DESTACADO
       SOLO LOCAL
    ========================= */

    function cambiarDestacadoLocal(
        producto,
        seleccionado
    ) {

        const cantidad =
            productos.filter(esDestacado).length;


        /* MÁXIMO 4 */

        if (
            seleccionado &&
            cantidad >= 4
        ) {

            alert(
                "Podés seleccionar como máximo 4 productos."
            );


            mostrarProductos();

            return;

        }


        /* CAMBIAR SOLO EN MEMORIA */

        producto.destacado =
            seleccionado;


        /* =========================
           SI SE AGREGA
        ========================= */

        if (seleccionado) {

            const ordenes =
                productos
                    .filter(
                        p =>
                            esDestacado(p) &&
                            p.id !== producto.id
                    )
                    .map(
                        p =>
                            Number(
                                p.orden || 0
                            )
                    );


            producto.orden =
                Math.max(
                    0,
                    ...ordenes
                ) + 1;

        }


        /* =========================
           SI SE QUITA
        ========================= */

        else {

            producto.orden = 0;

        }


        marcarCambios();

        mostrarProductos();

    }


    /* =========================
       DRAG & DROP
    ========================= */

    function activarArrastre() {

        const tarjetas =
            contenedorDestacados.querySelectorAll(
                ".producto-destacado"
            );


        let arrastrado = null;


        tarjetas.forEach(tarjeta => {


            tarjeta.addEventListener(
                "dragstart",
                () => {

                    arrastrado =
                        tarjeta;


                    tarjeta.classList.add(
                        "arrastrando"
                    );

                }
            );


            tarjeta.addEventListener(
                "dragend",
                () => {

                    tarjeta.classList.remove(
                        "arrastrando"
                    );


                    arrastrado = null;


                    actualizarOrdenLocal();


                    marcarCambios();

                }
            );


            tarjeta.addEventListener(
                "dragover",
                event => {

                    event.preventDefault();


                    if (
                        !arrastrado ||
                        arrastrado === tarjeta
                    ) {

                        return;

                    }


                    const rect =
                        tarjeta.getBoundingClientRect();


                    const mitad =
                        rect.top +
                        rect.height / 2;


                    if (
                        event.clientY < mitad
                    ) {

                        contenedorDestacados.insertBefore(
                            arrastrado,
                            tarjeta
                        );

                    }

                    else {

                        contenedorDestacados.insertBefore(
                            arrastrado,
                            tarjeta.nextSibling
                        );

                    }

                }
            );

        });

    }


    /* =========================
       ACTUALIZAR ORDEN LOCAL
    ========================= */

    function actualizarOrdenLocal() {

        const tarjetas =
            contenedorDestacados.querySelectorAll(
                ".producto-destacado"
            );


        tarjetas.forEach(
            (tarjeta, index) => {

                const id =
                    tarjeta.dataset.id;


                const producto =
                    productos.find(
                        p =>
                            String(p.id) ===
                            String(id)
                    );


                if (producto) {

                    producto.orden =
                        index + 1;

                }

            }
        );

    }


    /* =========================
       GUARDAR CAMBIOS
    ========================= */

    async function guardarCambios() {

        if (!esperarSupabase()) {
            return;
        }


        if (!cambiosPendientes) {

            if (mensaje) {

                mensaje.className =
                    "mensaje-info";

                mensaje.innerHTML = `
                    <span class="mensaje-icono">✓</span>
                    No hay cambios para guardar
                `;

            }

            return;

        }


        try {

            botonGuardar.disabled =
                true;


            botonGuardar.textContent =
                "Guardando...";


            actualizarOrdenLocal();


            /* =========================
               GUARDAR PRODUCTOS
            ========================= */

            for (
                const producto of productos
            ) {

                const destacado =
                    esDestacado(producto);


                const orden =
                    destacado
                        ? Number(
                            producto.orden || 0
                        )
                        : 0;


                const {
                    error
                } =
                    await supabaseClient
                        .from("productos")
                        .update({

                            destacado:
                                destacado,

                            orden:
                                orden

                        })
                        .eq(
                            "id",
                            producto.id
                        );


                if (error) {

                    throw error;

                }

            }


            /* =========================
               TODO GUARDADO
            ========================= */

            cambiosPendientes =
                false;


            botonGuardar.classList.remove(
                "cambios-pendientes"
            );


            if (mensaje) {

                mensaje.className =
                    "mensaje-exito";

                mensaje.innerHTML = `
                    <span class="mensaje-icono">✓</span>
                    Cambios guardados correctamente
                `;

            }


            setTimeout(
                () => {

                    if (mensaje) {

                        mensaje.innerHTML =
                            "";

                        mensaje.className =
                            "";

                    }

                },
                2500
            );


        } catch (error) {

            console.error(
                "Error guardando cambios:",
                error
            );


            if (mensaje) {

                mensaje.className =
                    "mensaje-error";

                mensaje.innerHTML = `
                    <span class="mensaje-icono">!</span>
                    No se pudieron guardar los cambios
                `;

            }

        }


        botonGuardar.disabled =
            false;


        botonGuardar.textContent =
            "Guardar cambios";

    }


    /* =========================
       CONTADOR
    ========================= */

    function actualizarContador() {

        const cantidad =
            productos.filter(
                esDestacado
            ).length;


        if (contador) {

            contador.textContent =
                `${cantidad} / 4`;

        }

    }


    /* =========================
       BOTÓN GUARDAR
    ========================= */

    if (botonGuardar) {

        botonGuardar.addEventListener(
            "click",
            guardarCambios
        );

    }


    /* =========================
       INICIAR
    ========================= */

    cargarProductos();


})();