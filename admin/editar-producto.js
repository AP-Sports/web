const params = new URLSearchParams(
    window.location.search
);

const id = params.get("id");

const form = document.getElementById("editProductForm");


let productoActual = null;



async function cargarProducto() {


    const { data, error } = await supabaseClient

        .from("productos")

        .select("*")

        .eq("id", id)

        .single();



    if(error){

        console.error(error);

        alert("Error cargando producto");

        return;

    }



    productoActual = data;



    document.getElementById("nombre").value =
        data.nombre;


    document.getElementById("descripcion").value =
        data.descripcion;


    document.getElementById("mensaje").value =
        data.mensaje || "";


    document.getElementById("activo").checked =
        data.activo;


}




form.addEventListener(
"submit",
async function(e){


    e.preventDefault();



    let imagenURL =
        productoActual.imagen || "";



    const archivo =
        document.getElementById("imagenArchivo").files[0];



    // Si eligió una imagen nueva

    if(archivo){



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



        if(uploadError){


            console.error(uploadError);

            alert(
                "Error subiendo imagen"
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




    const { error } =
        await supabaseClient

        .from("productos")

        .update(producto)

        .eq("id", id);




    if(error){


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



});



cargarProducto();

const inputImagen = document.getElementById("imagenArchivo");
const textoImagen = document.getElementById("imagenNombre");


inputImagen.addEventListener("change", function(){

    if(this.files.length > 0){

        textoImagen.textContent =
            "Imagen seleccionada: " + this.files[0].name;

    } else {

        textoImagen.textContent =
            "No se seleccionó una nueva imagen";

    }

});