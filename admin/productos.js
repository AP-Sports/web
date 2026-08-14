console.log("productos.js cargado");

const form = document.getElementById("productForm");

if (form) {

    form.addEventListener("submit", async function(e) {

        e.preventDefault();


        const archivo =
            document.getElementById("imagenArchivo").files[0];


        let imagenURL = "";


        // SUBIR IMAGEN

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
                    "Error subiendo imagen:",
                    uploadError
                );

                alert(
                    "Error al subir imagen"
                );

                return;
            }


            const { data } =
                supabaseClient
                .storage
                .from("productos")
                .getPublicUrl(nombreArchivo);


            imagenURL =
                data.publicUrl;
        }


        // DATOS DEL PRODUCTO

        const nombre =
            document.getElementById("nombre").value.trim();


        // MENSAJE AUTOMÁTICO

        const mensaje =
            `Hola! Quisiera solicitar un presupuesto por "${nombre}".`;


        const producto = {

            nombre: nombre,

            descripcion:
                document.getElementById("descripcion").value.trim(),

            imagen: imagenURL,

            mensaje: mensaje,

            activo:
                document.getElementById("activo").checked

        };


        console.log(
            "Producto a guardar:",
            producto
        );


        // GUARDAR EN SUPABASE

        const { error } =
            await supabaseClient
            .from("productos")
            .insert([producto]);


        if (error) {

            console.error(error);

            alert(
                "Error guardando producto"
            );

            return;
        }


        alert(
            "Producto guardado correctamente"
        );


        window.location.href =
            "productos.html";

    });

}


// MOSTRAR NOMBRE DE LA IMAGEN

const inputImagen =
    document.getElementById("imagenArchivo");

const nombreImagen =
    document.getElementById("imagenNombre");


if (inputImagen) {

    inputImagen.addEventListener(
        "change",
        function() {

            if (this.files[0]) {

                nombreImagen.textContent =
                    this.files[0].name;

            } else {

                nombreImagen.textContent =
                    "No se seleccionó ninguna imagen";

            }

        }
    );

}