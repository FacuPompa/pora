let Carrito = []; 

function masymenos(subtotal = () =>{}){
  let grupo= document.querySelector(".grupo-cant");
  let btonsumar= grupo.querySelector(".btn-sumar-cant");
  let btonrestar= grupo.querySelector(".btn-restar-cant");
  let inputcant= grupo.querySelector(".input-cant");

  btonsumar.addEventListener("click", () => {
    let valorinput= parseInt(inputcant.value);
    inputcant.value= valorinput + 1;
    subtotal();
  });

  btonrestar.addEventListener("click",() => {
    let valorinput= parseInt(inputcant.value);
    if (valorinput > 1){
      inputcant.value= valorinput - 1;
      subtotal();
    }
  });
}

let precioennumero= 1;
function calsubtotal(){
  let valor= parseInt(document.querySelector(".input-cant").value);
  let subtotal= valor * precioennumero;
  document.getElementById("modal-subtotal").textContent= `$${subtotal}`;
}


fetch('chipa.json')
  .then(response => response.json())
  .then(chipas => {

    let container = document.getElementById("chipa-container");
    let card = "";
    chipas.forEach((chipa,i)=> {
      card += `
        <div class=" col-12 col-md-6 mb-4">
          <div class="card">
            <!--img chipa -->
            <img src="${chipa.img}" class="card-img-top cardimg" alt="${chipa.sabor}">
            <div class="card-body">
              <!-- sabor -->
              <h5 class="card-title">${chipa.sabor}</h5>
              <!-- descripcion -->
              <p class="card-text">${chipa.descripcion}</p>
              <!-- boton que podria añadir pdf -->
              <a href="${chipa.pdf}" class="btn btn-primary" style="margin-right: 14px;">Ver más</a>
              <button type="button" class="btn btn-primary btnagc" data-index="${i}" data-bs-toggle="modal" data-bs-target="#myModalCant">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = card;

    let btnacarrito= document.querySelectorAll(".btnagc");
    btnacarrito.forEach((bton) =>{
      bton.addEventListener("click",() => {

        let indice= parseInt(bton.dataset.index);
        let chipa= chipas[indice];
        let modal= document.getElementById("myModalCant");
        let input= modal.querySelector(".input-cant");
        let precio= chipa.precio;
        let precioint= parseInt(precio.replace(/\D/g,""));
        let btonCA= modal.querySelector(".confirmar-agregar");
        precioennumero= precioint;
        modal.querySelector(".modal-title").textContent= chipa.sabor;
        modal.querySelector(".modal-precio").textContent= chipa.precio;
        input.value= 1;
        calsubtotal();
        btonCA.replaceWith(btonCA.cloneNode(true));
        let nbtonCA= modal.querySelector(".confirmar-agregar");

        nbtonCA.addEventListener("click",() => {
          let cant = parseInt(input.value);
          let total = cant * precioint;
          let existente = Carrito.find(item => item.producto === chipa.sabor);

          if (existente) {
            existente.cantidad += cant;
            existente.precioTotal += total;
          } else {
            Carrito.push({
              producto: chipa.sabor,
              cantidad: cant,
              precioOriginal: chipa.precio,
              precioTotal: total,
              imagen: chipa.img,
            });
          }
          mosCarr();
        });
      });
    });
  });

masymenos(calsubtotal);

function mosCarr(){
  let container = document.querySelector(".producto-carrito");
  container.innerHTML = "";
  if (Carrito.length === 0){
    container.innerHTML = "<h5 class='d-flex justify-content-center align-content-center mb-0'> Carrito Vacio </h5>";
    return;
  }
  Carrito.forEach((elemento, i) => {
    let cuerpo = document.createElement("div");
    cuerpo.className = "mb-3 px-3 py-2 text-center border rounded divcreate";
    cuerpo.innerHTML = `
      <div class="row align-items-center">
        <div class="col-3">
          <img src="${elemento.imagen}" alt="${elemento.producto}" class="img-fluid rounded" style="max-height:60px;">
        </div>
        <div class="col-6">
          <h6 class="mb-1">${elemento.producto}</h6>
          <div class="small text-muted">Cantidad: ${elemento.cantidad}</div>
          <div class="small text-muted">Precio unitario: ${elemento.precioOriginal}</div>
        </div>
        <div class="col-3">
          <div class="fw-bold text-success">Total: $${elemento.precioTotal}</div>
        </div>
      </div>
    `;
    container.appendChild(cuerpo);
  });
}

mosCarr();

// carga json de comentarios
fetch('reseñas.json')
  .then(response2 => response2.json())
  .then(objetos => {
    let divid = document.getElementById("reseñasdiv");
    let cargar = "";

for (let i = 0; i < objetos.length; i += 2) {
  cargar += `
    <div class="carousel-item${i === 0 ? ' active' : ''}">
      <div class="row g-4 justify-content-center mx-auto">
        <div class="col-12 col-md-6 mb-3 mb-md-0">
          <div class="card border-0 p-3 h-100" style="background:#a0bd51e0;">
            <div class="card-body text-center d-flex flex-column justify-content-between" style="min-height: 220px;">
              <div>
                <h5 class="card-title fw-bold mb-2 text-white">${objetos[i].nombre}</h5>
                <div class="fs-5 mb-2" style="color:#FAC172;">${objetos[i].estrellas}</div>
              </div>
              <p class="card-text mb-0 text-white" style="font-size: 1rem;">${objetos[i].comentario}</p>
            </div>
          </div>
        </div>
        ${objetos[i+1] ? `
        <div class="col-12 col-md-6 d-none d-md-block">
          <div class="card border-0 p-3 h-100" style="background:#a0bd51e0;">
            <div class="card-body text-center d-flex flex-column justify-content-between" style="min-height: 220px;">
              <div>
                <h5 class="card-title fw-bold mb-2 text-white">${objetos[i+1].nombre}</h5>
                <div class="fs-5 mb-2" style="color:#FAC172;">${objetos[i+1].estrellas}</div>
              </div>
              <p class="card-text mb-0 text-white" style="font-size: 1rem;">${objetos[i+1].comentario}</p>
            </div>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}
    divid.innerHTML = cargar;
  });

function mostrarToast(mensaje, exito = true) {
  const toast = document.getElementById('toastCompra');
  const toastMsg = document.getElementById('toastCompraMsg');
  toastMsg.textContent = mensaje;
  toast.classList.remove('bg-success', 'bg-danger');
  toast.classList.add(exito ? 'bg-success' : 'bg-danger');
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
};

// manejo compra
document.getElementById("btncomprar").addEventListener("click", function() {
    if (Carrito.length === 0) {
        mostrarToast("El carrito está vacío. Agregá productos antes de comprar.", false);
    } else {
        mostrarToast("¡Compra realizada con éxito!", true);
        Carrito = [];
        mosCarr();
    }
});
