const params = new URLSearchParams(
    window.location.search
);

const id = params.get("id");

const form =
    document.getElementById("editProductForm");

let productoActual = null;


// CARGAR PRODUCTO

async function cargarProducto() {

    const { data, error } =
        await supabaseClient
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();


    if (error) {

        console.error(error);

        alert(
            "Error cargando producto"
        );

        return;
    }


    productoActual = data;


    document.getElementById("nombre").value =
        data.nombre;


    document.getElementById("descripcion").value =
        data.descripcion;


    document.getElementById("activo").checked =
        data.activo;

}


// GUARDAR CAMBIOS

form.addEventListener(
    "submit",
    async function(e) {

        e.preventDefault();


        // IMAGEN ACTUAL

        let imagenURL =
            productoActual.imagen || "";


        // IMAGEN NUEVA

        const archivo =
            document
            .getElementById("imagenArchivo")
            .files[0];


        if (archivo) {

            const nombreArchivo =
                Date.now() + "-" + archivo.name;


            const { error: uploadError } =
                await supabaseClient
                .storage
                .from("productos")
                .upload(
                    nombreArchivo,
                    archivo
                );


            if (uploadError) {

                console.error(
                    uploadError
                );

                alert(
                    "Error subiendo imagen"
                );

                return;
            }


            const { data } =
                supabaseClient
                .storage
                .from("productos")
                .getPublicUrl(
                    nombreArchivo
                );


            imagenURL =
                data.publicUrl;
        }


        // NOMBRE ACTUAL

        const nombre =
            document
            .getElementById("nombre")
            .value
            .trim();


        // MENSAJE AUTOMÁTICO

        const mensaje =
            `Hola! Quisiera solicitar un presupuesto por "${nombre}".`;


        // PRODUCTO

        const producto = {

            nombre: nombre,

            descripcion:
                document
                .getElementById("descripcion")
                .value
                .trim(),

            imagen:
                imagenURL,

            mensaje:
                mensaje,

            activo:
                document
                .getElementById("activo")
                .checked

        };


        console.log(
            "Producto actualizado:",
            producto
        );


        // ACTUALIZAR SUPABASE

        const { error } =
            await supabaseClient
            .from("productos")
            .update(producto)
            .eq("id", id);


        if (error) {

            console.error(error);

            alert(
                "Error actualizando producto"
            );

            return;
        }


        alert(
            "Producto actualizado correctamente"
        );


        window.location.href =
            "productos.html";

    }
);


// CARGAR

cargarProducto();


// MOSTRAR NOMBRE DE IMAGEN

const inputImagen =
    document.getElementById(
        "imagenArchivo"
    );

const textoImagen =
    document.getElementById(
        "imagenNombre"
    );


if (inputImagen) {

    inputImagen.addEventListener(
        "change",
        function() {

            if (this.files.length > 0) {

                textoImagen.textContent =
                    "Imagen seleccionada: " +
                    this.files[0].name;

            } else {

                textoImagen.textContent =
                    "No se seleccionó una nueva imagen";

            }

        }
    );

}
