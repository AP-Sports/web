const SUPABASE_URL = "https://mqsfkeniyibnlyabrdfl.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_y4bBrmZzKcAr4zibLbM1ww_PHDxze87";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================
   PROTEGER PANEL
========================= */

async function checkSession() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (!session) {

        window.location.href = "login.html";

        return false;
    }


    return true;
}


/* =========================
   INICIAR PANEL
========================= */

async function initAdmin() {

    const authenticated = await checkSession();


    if (!authenticated) {
        return;
    }


    // Mostrar panel después de validar sesión
    document.body.classList.remove("auth-checking");


    setupMenu();

    setupLogout();

}


/* =========================
   MENÚ MÓVIL
========================= */

function setupMenu() {

    const menuToggle =
        document.getElementById("menuToggle");

    const menuClose =
        document.getElementById("menuClose");

    const sidebar =
        document.querySelector(".sidebar");



    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            function () {

                sidebar.classList.add("open");

            }
        );

    }



    if (menuClose) {

        menuClose.addEventListener(
            "click",
            function () {

                sidebar.classList.remove("open");

            }
        );

    }



    const menuOverlay =
        document.getElementById("menuOverlay");


    if (menuOverlay) {

        menuOverlay.addEventListener(
            "click",
            function () {

                sidebar.classList.remove("open");

            }
        );

    }


}


/* =========================
   CERRAR SESIÓN
========================= */

function setupLogout() {

    const logoutButton =
        document.querySelector(".logout-btn");



    if (!logoutButton) {
        return;
    }



    logoutButton.addEventListener(
        "click",
        async function () {


            logoutButton.disabled = true;


            logoutButton.textContent =
                "Cerrando sesión...";



            const { error } =
                await supabaseClient.auth.signOut();



            if (error) {

                console.error(error);


                logoutButton.disabled = false;


                logoutButton.textContent =
                    "Cerrar sesión";


                return;

            }



            window.location.href = "login.html";


        }
    );

}


/* =========================
   EJECUTAR
========================= */

initAdmin();