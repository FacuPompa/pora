/*Arreglo para los articulos del carrito*/ 
let Carrito= [];

/*Reinicio del precio*/
let pennro= 0;

/*Funcion que actualiza el subtotal del producto*/         
function calcsubtotal(){
    //guardamos el valor actual del input en la variable
    const cant= parseInt(document.querySelector(".input-cant").value);
    //Multiplicamos esa variable por el precio del producto pasado a numero
    const subtotal= cant * pennro;
    //Mostramos en el modal
    document.getElementById("modal-subtotal").textContent = `$${subtotal}`; 
}

/*Cards de productos dinamicos*/
//Buscamos el archivo con los datos del chipa 
fetch('chipamio.json')
//Lo pasamos a objeto de javascript
.then(response => response.json())
//Le damos nombre al array
.then(chipas => {
    //Para cada elemento de "chipas" le vamos a dar el nombre "chipa" con el indice del array 
    chipas.forEach((chipa,i) => {
        //Creamos los id que se van a encontrar en el HTML
        let id= `card${i+1}`;
        //En card guardamos los id del HTML que coincide con los creado
        let card= document.getElementById(id);
        //Declaramos las variables para poder insertar los datos del objeto al documento html
        let img= card.querySelector("img");
        let tit= card.querySelector("h5");
        let des= card.querySelector(".card-text");
        let precio= card.querySelector(".card-precio");
        /*Insertamos la imagen*/ 
        img.src= chipa.imagen;
        img.alt= chipa.sabor;
        //Insrtamos titulo de la card
        tit.textContent= chipa.titulo;
        //Insertamos la descripcion
        des.textContent= chipa.Descripcion;
        //Insertamos el precio
        precio.textContent= chipa.precio;
        /*Modal eleccion de cantidad kg*/
        //Guardamos en la variable el boton que lanza el modal
        const BTNagcarrito= card.querySelector(".btnagc");
        BTNagcarrito.addEventListener("click",()=>{
            //Guardamos el modal en una variable
            const modal= document.getElementById("myModalCant");
            const inputcant= modal.querySelector(".input-cant");
            const penpalabra= chipa.precio;
            //Actualizamos la variable pennro
            pennro= parseInt(penpalabra.replace(/\D/g,""));
            const btoagregar = document.querySelector(".confirmar-agregar");
            //Ingresamos los datos
            modal.querySelector(".modal-title").textContent= chipa.titulo;
            modal.querySelector(".modal-precio").textContent= chipa.precio;
            //Reiniciamos el input cada vez que se abre y que se muestre el precio original
            inputcant.value= 1;
            calcsubtotal();
            //Boton para agregar todo el contenido al carrito(lo reemplazamos y redeclaramos para evitar fallos)
            btoagregar.replaceWith(btoagregar.cloneNode(true));
            const nuevobtonagregar= document.querySelector(".confirmar-agregar");
            //Agregamos el evento "click" al boton
            nuevobtonagregar.addEventListener("click",()=>{
                //Variables para guardar los nuevos valores
                const cant = parseInt(inputcant.value);
                const total= cant * pennro;
                //Agregamos un nuevo elemento al array Carrito
                Carrito.push({
                    producto: chipa.titulo,
                    cantidad: cant,
                    precioUnitario: chipa.precio,
                    precio: total,
                });
                //Mostramos el articulo recien guardado en el modal del carrito
                MosCarr();
            });
        });
    })
});

/*Funcion de los botones +/-*/ 
function masymenos(grupo,input,sumar,restar, subtotal = () =>{}){
    //Guardamos los parametros en las variables
    let g= document.querySelector(grupo);
    let i= g.querySelector(input);
    let s= g.querySelector(sumar);
    let r= g.querySelector(restar);
    //Agregamos eventos a los botones
    s.addEventListener("click",()=>{
        let valor= parseInt(i.value);
        i.value= valor + 1;
        //Llamamos a la funcion para actualizar el total cada vez que se presiona el boton +
        subtotal();
    });
    r.addEventListener("click",()=>{
        let valor= parseInt(i.value);
        if(valor > 1){
            i.value= valor - 1;
            //Llamamos a la funcion para actualizar el total cada vez que se presiona el boton -
            subtotal();
        }
    });
}

/*Funcion para mostrar los articulos en el modal del carrito*/
function MosCarr(){
    //Guardamos el cuerpo del modal en una variable
    const contenedor= document.querySelector(".producto-carrito");
    //Limpiamos para que no se dupliquen contenidos
    contenedor.innerHTML= "";
    //Mostramos un mensaje si esta vacio
    if(Carrito.length === 0){
        contenedor.innerHTML= "<p class='text-center'>El carrito esta vacio</p>";
        return;
    }
    Carrito.forEach((elementos,i)=>{
        const cuerpo= document.createElement("div");
        cuerpo.className= "mx-1 text-center border rounded divcreate";
        //Armamos el cuerpo del modal con los datos correctos del producto que confirmo comprar
        cuerpo.innerHTML=`
            <h5>${elementos.producto}</h5>
            <p>Cantidad: ${elementos.cantidad}kg</p>
            <p>Precio: ${elementos.precioUnitario}</p>
            <p>Total: $${elementos.precio}</p>
        `;
        contenedor.appendChild(cuerpo);
    });
};
//Invoacion fuera para mostrar que el carrito esta vacio en principio.
MosCarr();

//Llamamos a la funcion desde aca
masymenos("#myModalCant .grupo-cant",".input-cant",".btn-sumar-cant",".btn-restar-cant", calcsubtotal);
