const SUPABASE_URL =
    "https://mqsfkeniyibnlyabrdfl.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_y4bBrmZzKcAr4zibLbM1ww_PHDxze87";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


const FUNCTION_URL =
    "https://mqsfkeniyibnlyabrdfl.supabase.co/functions/v1/dynamic-responder";


/* =========================
   PROTEGER PANEL
========================= */

async function checkSession() {

    const {
        data: { session }
    } =
        await supabaseClient
            .auth
            .getSession();


    if (!session) {

        window.location.href =
            "login.html";

        return false;
    }


    return true;
}


/* =========================
   CARGAR VISITAS
========================= */

async function cargarVisitasInicio() {

    const elemento =
        document.getElementById(
            "totalVisitas"
        );


    if (!elemento) {
        return;
    }


    try {

        const {
            data: {
                session
            }
        } =
            await supabaseClient
                .auth
                .getSession();


        if (!session) {
            return;
        }


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
            "Estadísticas del inicio:",
            datos
        );


        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                datos.message ||
                "Error cargando estadísticas"
            );

        }


        elemento.textContent =
            datos.visitas ?? "0";


    } catch (error) {

        console.error(
            "Error cargando visitas:",
            error
        );


        elemento.textContent =
            "—";

    }

}


/* =========================
   CARGAR PRODUCTOS
========================= */

async function cargarProductosInicio() {

    const elemento =
        document.getElementById(
            "totalProductos"
        );


    if (!elemento) {
        return;
    }


    try {

        const {
            count,
            error
        } =
            await supabaseClient
                .from("productos")
                .select("*", {
                    count: "exact",
                    head: true
                });


        if (error) {

            throw error;

        }


        elemento.textContent =
            count ?? "0";


    } catch (error) {

        console.error(
            "Error cargando productos:",
            error
        );


        elemento.textContent =
            "—";

    }

}


/* =========================
   CARGAR PRODUCTOS ACTIVOS
========================= */

async function cargarProductosActivos() {

    const elemento =
        document.getElementById(
            "productosActivos"
        );


    if (!elemento) {
        return;
    }


    try {

        const {
            count,
            error
        } =
            await supabaseClient
                .from("productos")
                .select("*", {
                    count: "exact",
                    head: true
                })
                .eq("activo", true);


        if (error) {

            throw error;

        }


        elemento.textContent =
            count ?? "0";


    } catch (error) {

        console.error(
            "Error cargando productos activos:",
            error
        );


        elemento.textContent =
            "—";

    }

}


/* =========================
   INICIAR PANEL
========================= */

async function initAdmin() {

    const authenticated =
        await checkSession();


    if (!authenticated) {
        return;
    }


    document.body.classList.remove(
        "auth-checking"
    );


    setupMenu();

    setupLogout();

    cargarVisitasInicio();

    cargarProductosInicio();

    cargarProductosActivos();

}


/* =========================
   MENÚ MÓVIL
========================= */

function setupMenu() {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    const menuClose =
        document.getElementById(
            "menuClose"
        );


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            function () {

                sidebar.classList.add(
                    "open"
                );

            }
        );

    }


    if (menuClose) {

        menuClose.addEventListener(
            "click",
            function () {

                sidebar.classList.remove(
                    "open"
                );

            }
        );

    }


    const menuOverlay =
        document.getElementById(
            "menuOverlay"
        );


    if (menuOverlay) {

        menuOverlay.addEventListener(
            "click",
            function () {

                sidebar.classList.remove(
                    "open"
                );

            }
        );

    }

}


/* =========================
   CERRAR SESIÓN
========================= */

function setupLogout() {

    const logoutButton =
        document.querySelector(
            ".logout-btn"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        async function () {

            logoutButton.disabled =
                true;


            logoutButton.textContent =
                "Cerrando sesión...";


            const { error } =
                await supabaseClient
                    .auth
                    .signOut();


            if (error) {

                console.error(
                    error
                );


                logoutButton.disabled =
                    false;


                logoutButton.textContent =
                    "Cerrar sesión";


                return;

            }


            window.location.href =
                "login.html";

        }
    );

}


/* =========================
   EJECUTAR
========================= */

initAdmin();