const SUPABASE_URL = "https://mqsfkeniyibnlyabrdfl.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_y4bBrmZzKcAr4zibLbM1ww_PHDxze87";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");

const loginError = document.getElementById("loginError");


loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email = emailInput.value.trim();

    const password = passwordInput.value;


    loginError.textContent = "";

    loginButton.disabled = true;

    loginButton.textContent = "Ingresando...";


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });


    if (error) {

        console.error(error);

        loginError.textContent =
            "Email o contraseña incorrectos.";

        loginButton.disabled = false;

        loginButton.textContent = "Ingresar";

        return;
    }


    if (data.session) {

        window.location.href = "index.html";

    }

});