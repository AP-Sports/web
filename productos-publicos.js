const SUPABASE_URL =
    "https://mqsfkeniyibnlyabrdfl.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_y4bBrmZzKcAr4zibLbM1ww_PHDxze87";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );



async function cargarProductos() {


    const { data, error } =
        await supabaseClient
            .from("productos")
            .select("*")
            .eq("activo", true);



    if (error) {

        console.error(
            "Error cargando productos:",
            error
        );

        return;

    }



    const contenedor =
        document.getElementById(
            "catalogGrid"
        );



    contenedor.innerHTML = "";



    data.forEach(producto => {



        const tarjeta = `


        <article class="catalog-card">


            <img 
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >



            <div class="catalog-info">


                <h3>
                    ${producto.nombre}
                </h3>



                <p>
                    ${producto.descripcion}
                </p>



<a 
href="https://api.whatsapp.com/send?phone=541130093257&text=${encodeURIComponent(producto.mensaje)}"
target="_blank">

Solicitar presupuesto →

</a>



            </div>


        </article>


        `;



        contenedor.innerHTML += tarjeta;


    });


}



cargarProductos();