//carga json
fetch('chipa.json')
  // convierte objeto
  .then(response => response.json())

  // se ejecuta la funcion con el arreglo de chipas
  .then(chipas => {

    let container = document.getElementById("chipa-container");

    // variable para acumular texto html
    let card = "";

    // Recorre cada objeto chipa del arreglo
    chipas.forEach(chipa => {

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
            </div>
          </div>
        </div>
      `;
    });

    // inserta cards
    container.innerHTML = card;
  });


//cargar comentarios 
// carga archivo
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

