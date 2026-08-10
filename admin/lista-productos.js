console.log("lista-productos.js cargado");


const productsContainer =
    document.querySelector(".products-admin");


if (productsContainer) {

    cargarProductos();

}


async function cargarProductos() {


    const { data, error } = await supabaseClient

        .from("productos")

        .select("*")

        .order("id", { ascending: false });


    if (error) {

        console.error(
            "Error cargando productos:",
            error
        );

        productsContainer.innerHTML = `
            <p>
                Error al cargar los productos.
            </p>
        `;

        return;

    }


    if (!data || data.length === 0) {

        productsContainer.innerHTML = `
            <p>
                Todavía no hay productos cargados.
            </p>
        `;

        return;

    }


    productsContainer.innerHTML = "";


    data.forEach(function (producto) {


        const card =
            document.createElement("div");


        card.className =
            "product-admin-card";


        const whatsappURL =
            "https://api.whatsapp.com/send?phone=541130093257&text=" +
            encodeURIComponent(
                producto.mensaje || ""
            );


        card.innerHTML = `

            <div class="product-admin-image">

                ${producto.imagen

                ? `
<img
    src="${producto.imagen}"
    alt="${producto.nombre}"
>
                      `

                : `
                        <div class="no-image">
                            Sin imagen
                        </div>
                      `
            }

            </div>


            <div class="product-admin-info">

                <h3>
                    ${producto.nombre}
                </h3>


                <p>
                    ${producto.descripcion}
                </p>


                <small>
                    ID: ${producto.id}
                </small>


                ${producto.mensaje

                ? `
                        <div class="product-whatsapp">

                            <a
                                href="${whatsappURL}"
                                target="_blank"
                                class="whatsapp-product-btn"
                            >
                                Consultar por WhatsApp
                            </a>

                        </div>
                      `

                : ""
            }

            </div>


            <div class="product-admin-status">

    <span class="${producto.activo ? "active" : "inactive"}">
        ${producto.activo ? "Activo" : "Oculto"}
    </span>


    <div class="product-actions">

        <button 
            class="edit-btn"
            onclick="editarProducto(${producto.id})"
        >
            ✏ Editar
        </button>


        <button 
            class="delete-btn"
            onclick="eliminarProducto(${producto.id})"
        >
            🗑 Eliminar
        </button>

    </div>

</div>

        `;


        productsContainer.appendChild(card);

    });

}

async function eliminarProducto(id) {


    const confirmar =
        confirm("¿Seguro que querés eliminar este producto?");


    if (!confirmar) {

        return;

    }


    const { error } = await supabaseClient

        .from("productos")

        .delete()

        .eq("id", id);



    if (error) {

        console.error(error);

        alert("Error al eliminar producto");

        return;

    }


    alert("Producto eliminado correctamente");


    cargarProductos();

}



function editarProducto(id) {


    window.location.href =
        "editar-producto.html?id=" + id;


}
