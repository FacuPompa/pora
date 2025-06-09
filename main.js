fetch('chipa.json')
.then(response => response.json())
.then(chipas =>{

chipas.forEach((chipa,i) => {

let id= `card${i+1}`;
let card=document.getElementById(id);

//inserta la imagen del chipa
let img=card.querySelector("img");
img.src=chipa.img;
img.alt=chipa.sabor;

//inserta nombre del chipa
let nbre=card.querySelector("h5");
nbre.textContent=chipa.sabor;

//inserta descripcion
let desc=card.querySelector("p");
desc.textContent=chipa.descripcion;

//insertar pdf

    });   
})
