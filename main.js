/*Funcion de los botones +/-*/ 
document.querySelectorAll(".grupo-botones").forEach(grupo => {
    let input = grupo.querySelector(".input");
    let btnSum= grupo.querySelector(".btn-sumar");
    let btnRes= grupo.querySelector(".btn-restar");

    btnSum.addEventListener("click", () => {
        let valor= parseInt(input.value);
        input.value= valor + 1;
    });
    btnRes.addEventListener("click",() => {
        let valor= parseInt(input.value);
        if (valor > 1){
            input.value= valor - 1;
        }
    });
});
