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
    let total = agregados.reduce((acc, item) => acc + (item.gramos / 500), 0);
    if (total > 0) {
        cartCount.style.display = "inline-block";
        cartCount.textContent = "+" + total;
    } else {
        cartCount.style.display = "none";
        cartCount.textContent = "0";
    }
}

function agregarAlCarrito(event) {
    event.preventDefault();
    const index = parseInt(event.target.dataset.index);
    const found = agregados.find(item => item.index === index);
    if (found) {
        found.gramos += 500;
    } else {
        agregados.push({ index, gramos: 500 });
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
        found.gramos += 500;
        actualizarCarritoModal();
        actualizarCartCount();
    }
}

function restarUno(event) {
    event.preventDefault();
    const index = parseInt(event.target.dataset.index);
    const found = agregados.find(item => item.index === index);
    if (found && found.gramos > 500) {
        found.gramos -= 500;
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

    if (agregados.length === 0) {
        modalBody.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    let total = 0;
    agregados.forEach(item => {
        const chipa = chipasData[item.index];
        total += item.gramos;

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
        info.innerHTML = `<strong>${chipa.sabor}</strong><br>${item.gramos}g`;

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
    totalDiv.innerHTML = `<strong>Total: ${total}g</strong>`;
    modalBody.appendChild(totalDiv);
    
}

document.addEventListener("DOMContentLoaded", actualizarCartCount);

document.getElementById("myModal").addEventListener("show.bs.modal", actualizarCarritoModal);
