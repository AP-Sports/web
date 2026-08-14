(() => {

    console.log("productos-destacados-web.js cargado");


    /* =========================
       SUPABASE
    ========================= */

    const SUPABASE_URL =
        "https://mqsfkeniyibnlyabrdfl.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_y4bBrmZzKcAr4zibLbM1ww_PHDxze87";


    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );


    /* =========================
       CONTENEDOR
    ========================= */

    const contenedor =
        document.getElementById(
            "productosDestacados"
        );


    if (!contenedor) {

        console.error(
            "No se encontró #productosDestacados"
        );

        return;

    }


    /* =========================
       CARGAR PRODUCTOS
    ========================= */

    async function cargarProductosDestacados() {

        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("productos")
                    .select(
                        "id,nombre,descripcion,imagen,mensaje,activo,destacado,orden"
                    )
                    .eq(
                        "destacado",
                        1
                    )
                    .eq(
                        "activo",
                        true
                    )
                    .order(
                        "orden",
                        {
                            ascending: true
                        }
                    )
                    .limit(4);


            if (error) {

                throw error;

            }


            console.log(
                "Productos destacados:",
                data
            );


            /* =========================
               LIMPIAR
            ========================= */

            contenedor.innerHTML = "";


            /* =========================
               SIN PRODUCTOS
            ========================= */

            if (
                !data ||
                data.length === 0
            ) {

                contenedor.innerHTML = `

                    <p>
                        No hay productos destacados actualmente.
                    </p>

                `;

                return;

            }


            /* =========================
               CREAR TARJETAS
            ========================= */

            data.forEach(
                producto => {

                    const tarjeta =
                        document.createElement(
                            "article"
                        );


                    tarjeta.className =
                        "product-card";


                    /* MENSAJE WHATSAPP */

                    const mensaje =
                        producto.mensaje ||
                        `Hola! Quisiera solicitar un presupuesto por "${producto.nombre}".`;


                    const whatsappURL =
                        "https://api.whatsapp.com/send" +
                        "?phone=541130093257" +
                        "&text=" +
                        encodeURIComponent(
                            mensaje
                        );


                    /* IMAGEN */

                    let imagenHTML = "";


                    if (
                        producto.imagen
                    ) {

                        imagenHTML = `

                            <img
                                src="${producto.imagen}"
                                alt="${producto.nombre}"
                                loading="lazy"
                            >

                        `;

                    }


                    /* TARJETA */

                    tarjeta.innerHTML = `

                        ${imagenHTML}

                        <div class="product-info">

                            <h3>
                                ${producto.nombre}
                            </h3>

                            <p>
                                ${producto.descripcion || ""}
                            </p>

                            <a
                                href="${whatsappURL}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Solicitar presupuesto →
                            </a>

                        </div>

                    `;


                    contenedor.appendChild(
                        tarjeta
                    );

                }
            );


        } catch (error) {

            console.error(
                "Error cargando productos destacados:",
                error
            );


            contenedor.innerHTML = `

                <p>
                    No se pudieron cargar los productos.
                </p>

            `;

        }

    }


    /* =========================
       INICIAR
    ========================= */

    cargarProductosDestacados();


})();