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



    const producto = {


        nombre:
        document.getElementById("nombre").value.trim(),


        descripcion:
        document.getElementById("descripcion").value.trim(),


        imagen:
        imagenURL,


        mensaje:
        document.getElementById("mensaje").value.trim(),


        activo:
        document.getElementById("activo").checked


    };



    console.log(
        "Producto a guardar:",
        producto
    );



    const { error } =
        await supabaseClient
        .from("productos")
        .insert([producto]);



    if(error) {


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

const inputImagen =
    document.getElementById("imagenArchivo");


const nombreImagen =
    document.getElementById("imagenNombre");


if(inputImagen){

    inputImagen.addEventListener(
        "change",
        function(){

            if(this.files[0]){

                nombreImagen.textContent =
                    this.files[0].name;

            }

        }
    );

}
