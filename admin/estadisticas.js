console.log("estadisticas.js cargado");


const SUPABASE_URL =
    "https://mqsfkeniyibnlyabrdfl.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_y4bBrmZzKcAr4zibLbM1ww_PHDxze87";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


const FUNCTION_URL =
    "https://mqsfkeniyibnlyabrdfl.supabase.co/functions/v1/dynamic-responder";


async function cargarEstadisticas() {

    try {

        // OBTENER SESIÓN

        const {
            data: {
                session
            }
        } =
            await supabaseClient
                .auth
                .getSession();


        if (!session) {

            console.error(
                "No hay una sesión iniciada"
            );

            return;

        }


        console.log(
            "Sesión encontrada"
        );


        // LLAMAR A EDGE FUNCTION

        const respuesta =
            await fetch(
                FUNCTION_URL,
                {
                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${session.access_token}`,

                        "Content-Type":
                            "application/json"

                    }

                }
            );


        const datos =
            await respuesta.json();


        console.log(
            "Estadísticas:",
            datos
        );


        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                datos.message ||
                "Error cargando estadísticas"
            );

        }


        // VISITAS

        document.getElementById(
            "visitas"
        ).textContent =
            datos.visitas ?? "0";


        // VISITANTES

        document.getElementById(
            "visitantes"
        ).textContent =
            datos.visitantes ?? "—";


        // PÁGINAS

        const contenedor =
            document.getElementById(
                "paginas"
            );


        contenedor.innerHTML = "";


        const paginas =
            datos.paginas || [];


        const paginasAgrupadas = {};


        paginas.forEach(
            pagina => {

                const ruta =
                    pagina
                        .dimensions
                        ?.requestPath || "";


                const cantidad =
                    pagina.count || 0;


                let nombre;


                if (
                    ruta === "/web/" ||
                    ruta === "/web/index.html"
                ) {

                    nombre =
                        "Inicio";

                }

                else if (
                    ruta === "/web/productos.html"
                ) {

                    nombre =
                        "Productos";

                }

                else {

                    nombre =
                        ruta;

                }


                if (
                    !paginasAgrupadas[nombre]
                ) {

                    paginasAgrupadas[nombre] =
                        0;

                }


                paginasAgrupadas[nombre] +=
                    cantidad;

            }
        );


        Object.entries(
            paginasAgrupadas
        ).forEach(
            ([nombre, cantidad]) => {

                const tarjeta =
                    document.createElement(
                        "div"
                    );


                tarjeta.className =
                    "action-card";


                tarjeta.innerHTML = `

                    <span>
                        ▥
                    </span>

                    <div>

                        <h3>
                            ${nombre}
                        </h3>

                        <p>
                            ${cantidad} visitas
                        </p>

                    </div>

                `;


                contenedor.appendChild(
                    tarjeta
                );

            }
        );


        if (
            Object.keys(
                paginasAgrupadas
            ).length === 0
        ) {

            contenedor.innerHTML = `

                <p>
                    Todavía no hay visitas registradas.
                </p>

            `;

        }


    } catch (error) {

        console.error(
            "Error cargando estadísticas:",
            error
        );


        document.getElementById(
            "visitas"
        ).textContent =
            "Error";


        document.getElementById(
            "paginas"
        ).innerHTML = `

            <p>
                No se pudieron cargar
                las estadísticas.
            </p>

        `;

    }

}


cargarEstadisticas();