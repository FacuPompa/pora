/*Agregamos el array del carrito*/
let Carrito = []; 

/*Funcionalidad de los botones +/-*/
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

/*Funcion para actualizar el precio*/
//Variable que reincia el precio
let precioennumero= 1;
function calsubtotal(){
  //Guardar el valor del input(pasado a entero) en una variable
  let valor= parseInt(document.querySelector(".input-cant").value);
  //Guardamos la multiplicaion
  let subtotal= valor * precioennumero;
  //Mostramos en el cuerpo del modal el precio del subtotal
  document.getElementById("modal-subtotal").textContent= `$${subtotal}`;
}

//carga json de cards
fetch('chipa.json')
  // convierte objeto
  .then(response => response.json())

  // se ejecuta la funcion con el arreglo de chipas
  .then(chipas => {

    let container = document.getElementById("chipa-container");

    // variable para acumular texto html
    let card = "";

    // Recorre cada objeto chipa del arreglo
    chipas.forEach((chipa,i)=> {
      // agrega card al html
      card += `
        <div class="col-md-6 mb-4">
          <div class="card">
            <!--img chipa -->
            <img src="${chipa.img}" class="card-img-top cardimg" alt="${chipa.sabor}">
            <div class="card-body">
              <!-- sabor -->
              <h5 class="card-title">${chipa.sabor}</h5>
              <!-- descripcion -->
              <p class="card-text">${chipa.descripcion}</p>
              <!-- boton que podria añadir pdf -->
              <a href="#" class="btn btn-primary">Ver más</a>
              <button type="button" class="btn btn-primary btnagc" data-index="${i}" data-bs-toggle="modal" data-bs-target="#myModalCant">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      `;
    });
    // inserta cards
    container.innerHTML = card;

    //Guardamo los botones "Agregar al carrito" en una variable
    let btnacarrito= document.querySelectorAll(".btnagc");
    //Bucamos todos los botones de las cards
    btnacarrito.forEach((bton) =>{
      //Agregamos el evento click
      bton.addEventListener("click",() => {

        //Guardamos los datos de las cards en variables
        let indice= parseInt(bton.dataset.index);
        let chipa= chipas[indice];

        //Guardamos el modal en una variable
        let modal= document.getElementById("myModalCant");
        let input= modal.querySelector(".input-cant");
        let precio= chipa.precio;
        let precioint= parseInt(precio.replace(/\D/g,""));
        let btonCA= modal.querySelector(".confirmar-agregar");

        //Actualizamos el precio segun el producto seleccionado
        precioennumero= precioint;

        //Armamos el cuerpo del modal con los datos correspondientes
        modal.querySelector(".modal-title").textContent= chipa.sabor;
        modal.querySelector(".modal-precio").textContent= chipa.precio;

        //Reiniciamos el input cada vez que se haga click
        input.value= 1;
        calsubtotal();

        //Boton para agregar el producto al carrito con todos sus datos(REEMPLAZAMOS Y REDECLARAMOS para evitar fallos)
        btonCA.replaceWith(btonCA.cloneNode(true));
        let nbtonCA= modal.querySelector(".confirmar-agregar");

        nbtonCA.addEventListener("click",() => {

          //Guardamos los nuevos datos en variable
          let cant= parseInt(input.value);
          let total= cant * precioint;

          //Guardamos el producto en el array carrito
          Carrito.push({
            producto: chipa.sabor,
            cantidad: cant,
            precioOriginal: chipa.precio,
            precioTotal: total,
          });

          //mostramos el producto en el carrito
          mosCarr();
          
        });
      });
    });
  });

masymenos(calsubtotal);

/*Funcion para mostrar los articulos en el modal del carrito*/ 
function mosCarr(){
  //Guardamos el cuerpo del modal del carrito en una variable
  let container= document.querySelector(".producto-carrito");
  //Limpiamos para que no haya errores
  container.innerHTML= "";
  //Mensaje para mostrar que le carrito esta vacio
  if (Carrito.length === 0){
    container.innerHTML= "<p> Carrito Vacio </p>"
  }
  //Recorremos el arreglo carrito y le damos cuerpo al modal
  Carrito.forEach((elemento,i) =>{
    let cuerpo= document.createElement("div");
    cuerpo.className= "mx-1 text-center border rounded divcreate";
    //Armamos el cuerpo
    cuerpo.innerHTML= `
      <h5>${elemento.producto}</h5>
      <p>Cantidad: ${elemento.cantidad}</p>
      <p>Precio: ${elemento.precioOriginal}</p>
      <p>SubTotal: $${elemento.precioTotal}</p>
    `;
    container.appendChild(cuerpo);
  });
}

//Invocamos la funcion para mostrar en un principio que el carrito esta vacio
mosCarr();


// carga json de comentarios
fetch('reseñas.json')
  .then(response2 => response2.json()) //convierte objeto
  .then(objetos => { // arreglo de objetos
    let divid = document.getElementById("reseñasdiv");
    //variable acumulativa
    let cargar = "";

    // recorre cada objeto del arreglo
    objetos.forEach(reseñas => {

      // si el numero es par, se añade otro slide al carrusel
      if (reseñas.nro % 2 === 0) {
        // si la primera reseña es == se agrega active
        if (reseñas.nro === 0) {
          cargar += `
            <div class="carousel-item active">
              <div class="row g-4 justify-content-center">`;
        } else {
          // si no se cumple no se agrega class active
          cargar += `
            <div class="carousel-item">
              <div class="row g-4 justify-content-center">`;
        }
      }

      // acumula o concatena info de las reseñas
      cargar += `
        <div class="col-md-6">
          <div style="background-color: #839a42c9;" class="card ">
            <div class="card-body text-center d-flex flex-column justify-content-between" style="min-height: 220px;">
              <h5 class="card-title fw-bold text-dark">${reseñas.nombre}</h5>
              <p class="card-text text-muted">${reseñas.comentario}</p>
              <div class="text-warning fs-5">${reseñas.estrellas}</div>
            </div>
          </div>
        </div>`;

      // si el nro es impar cierra los div
      if (reseñas.nro % 2 !== 0) {
        cargar += `
              </div>
            </div>`;
      }
    });

    // inserta las cards
    divid.innerHTML = cargar;
  });



