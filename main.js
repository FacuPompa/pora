let chipasData = [];
const agregados = [];

fetch('./chipa.json')
.then(response => response.json())
.then(chipas => {
    chipasData = chipas;
    const row = document.querySelector("#productos .row");
    row.innerHTML = "";
    chipas.forEach((chipa, i) => {
        const card = createCard(chipa.sabor, chipa.descripcion, chipa.img, i);
        row.appendChild(card);
    });
    document.getElementById("cart-btn-mobile").disabled = false;
    document.getElementById("cart-btn-desktop").disabled = false;
})
.catch(error => {
    console.error("Error cargando los productos:", error);
});

function createCard(sabor, descripcion, imgSrc, index) {
    const col = document.createElement("div");
    col.className = "col-md-6 mb-4";

    const card = document.createElement("div");
    card.className = "card";
    card.id = `chipa-${index + 1}`;

    const img = document.createElement("img");
    img.className = "card-img-top cardimg";
    img.src = imgSrc;
    img.alt = sabor;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const h5 = document.createElement("h5");
    h5.className = "card-title";
    h5.textContent = `Chipá ${sabor}`;

    const p = document.createElement("p");
    p.className = "card-text";
    p.textContent = descripcion;

    const btn = document.createElement("a");
    btn.href = "#";
    btn.className = "btn btn-primary";
    btn.textContent = "Agregar al carrito";
    btn.dataset.index = index;
    btn.addEventListener("click", agregarAlCarrito);

    cardBody.appendChild(h5);
    cardBody.appendChild(p);
    cardBody.appendChild(btn);
    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);

    return col;
}

function actualizarCartCount() {
    const cartCount = document.getElementById("cart-count");
    const cartCountDesktop = document.getElementById("cart-count-desktop");
    let total = agregados.reduce((acc, item) => acc + (item.gramos / 100), 0);
    if (total > 0) {
        if (cartCount) {
            cartCount.style.display = "inline-block";
            cartCount.textContent = "+" + total;
        }
        if (cartCountDesktop) {
            cartCountDesktop.style.display = "inline-block";
            cartCountDesktop.textContent = "+" + total;
        }
    } else {
        if (cartCount) {
            cartCount.style.display = "none";
            cartCount.textContent = "0";
        }
        if (cartCountDesktop) {
            cartCountDesktop.style.display = "none";
            cartCountDesktop.textContent = "0";
        }
    }
}

function agregarAlCarrito(event) {
    event.preventDefault();
    const index = parseInt(event.target.dataset.index);
    const found = agregados.find(item => item.index === index);
    if (found) {
        found.gramos += 100;
    } else {
        agregados.push({ index, gramos: 100 });
    }
    actualizarCarritoModal();
    actualizarCartCount();
}

function vaciarCarrito() {
    agregados.length = 0;
    actualizarCarritoModal();
    actualizarCartCount();
}

function agregarUno(event) {
    event.preventDefault();
    const index = parseInt(event.target.dataset.index);
    const found = agregados.find(item => item.index === index);
    if (found) {
        found.gramos += 100;
        actualizarCarritoModal();
        actualizarCartCount();
    }
}

function restarUno(event) {
    event.preventDefault();
    const index = parseInt(event.target.dataset.index);
    const found = agregados.find(item => item.index === index);
    if (found && found.gramos > 100) {
        found.gramos -= 100;
    } else {
        const idx = agregados.findIndex(item => item.index === index);
        if (idx !== -1) agregados.splice(idx, 1);
    }
    actualizarCarritoModal();
    actualizarCartCount();
}
function eliminarItem(event) {
    event.preventDefault();
    const index = parseInt(event.target.dataset.index);
    const idx = agregados.findIndex(item => item.index === index);
    if (idx !== -1) agregados.splice(idx, 1);
    actualizarCarritoModal();
    actualizarCartCount();
}

function actualizarCarritoModal() {
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = "";

    if (!chipasData || chipasData.length === 0) {
        modalBody.innerHTML = "<p>Cargando productos...</p>";
        return;
    }

    if (agregados.length === 0) {
        modalBody.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    let totalGramos = 0;
    let totalPrecio = 0;
    agregados.forEach(item => {
        const chipa = chipasData[item.index];
        totalGramos += item.gramos;

        const precioPor100g = Number(chipa.precio);
        const cantidadPaquetes = item.gramos / 100;
        const precioItem = precioPor100g * cantidadPaquetes;
        totalPrecio += precioItem;

        const div = document.createElement("div");
        div.className = "d-flex align-items-center mb-3";

        const img = document.createElement("img");
        img.src = chipa.img;
        img.alt = chipa.sabor;
        img.style.width = "60px";
        img.style.height = "60px";
        img.style.objectFit = "cover";
        img.className = "me-3 rounded";

        const info = document.createElement("div");
        info.className = "flex-grow-1";
        info.innerHTML = `<strong>${chipa.sabor}</strong><br>${item.gramos}g<br><span class="text-success">Precio: $${precioItem.toFixed(0)}</span>`;

        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group ms-3";
        btnGroup.role = "group";

        const btnRestar = document.createElement("button");
        btnRestar.className = "btn btn-outline-secondary btn-sm";
        btnRestar.textContent = "-";
        btnRestar.dataset.index = item.index;
        btnRestar.addEventListener("click", restarUno);

        const btnSumar = document.createElement("button");
        btnSumar.className = "btn btn-outline-secondary btn-sm";
        btnSumar.textContent = "+";
        btnSumar.dataset.index = item.index;
        btnSumar.addEventListener("click", agregarUno);

        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn btn-outline-danger btn-sm";
        btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';
        btnEliminar.dataset.index = item.index;
        btnEliminar.addEventListener("click", eliminarItem);

        btnGroup.appendChild(btnRestar);
        btnGroup.appendChild(btnSumar);

        div.appendChild(img);
        div.appendChild(info);
        div.appendChild(btnGroup);

        modalBody.appendChild(div);
    });

    // muestra total
    const totalDiv = document.createElement("div");
    totalDiv.className = "mt-4 text-end";
    totalDiv.innerHTML = `<strong>Total: ${totalGramos}g</strong><br><strong>Total: $${totalPrecio.toFixed(0)}</strong>`;
    modalBody.appendChild(totalDiv);
}

function mostrarToast(mensaje, exito = true) {
    const toast = document.getElementById('toastCompra');
    const toastMsg = document.getElementById('toastCompraMsg');
    toastMsg.textContent = mensaje;
    toast.classList.remove('bg-success', 'bg-danger');
    toast.classList.add(exito ? 'bg-success' : 'bg-danger');
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// manejo compra
document.getElementById("btncomprar").addEventListener("click", function() {
    if (agregados.length === 0) {
        mostrarToast("El carrito está vacío. Agregá productos antes de comprar.", false);
    } else {
        mostrarToast("¡Compra realizada con éxito!", true);
        vaciarCarrito();
    }
});

document.addEventListener("DOMContentLoaded", actualizarCartCount);

document.getElementById("myModal").addEventListener("show.bs.modal", actualizarCarritoModal);
