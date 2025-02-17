const sectionReiniciar = document.getElementById("reiniciar");
const sectionSeleccionarAtaque = document.getElementById("seleccionar_ataque");
const botonSeleccion = document.getElementById("seleccion");
const botonReinicio = document.getElementById("reinicio");

const sectionSeleccionarMascota = document.getElementById("selecionar_mascota");

const spanMascotaJugador = document.getElementById("nombreMascotaJugador");

const spanMascotaEnemigo = document.getElementById("nombreMascotaEnemigo");

const sectionMensaje = document.getElementById("resultado");
const ataqueDelJugador = document.getElementById("ataqueDelJugador");
const ataqueDelEnemigo = document.getElementById("ataqueDelEnemigo");

const spanVidasEnemigo = document.getElementById("vidasEnemigo");
const spanVidasJugador = document.getElementById("vidasJugador");

const contenedorTarjetas = document.getElementById("contenedorTarjetas");
const contenedorAtaques = document.getElementById("contenedorAtaques");
const sectionMapaDeCanva = document.getElementById("mapaDeCanava");
const Mapa = document.getElementById("mapa");


let jugadorId = null
let enemigoId = null
let Mokepones = [];
let MokeponesEnemigos = [];
let jugadaAtaque = [];
let jugadaAtaqueEnemigo = [];
let opcionDeMokepones;
let inputdragon ;
let inputcocodrilo ;
let inputgorila ;
let mascotaJugador;
let mascotaJugadorobjeto;
let ataquesMokepones;
let ataquesMokeponEnemigo;
let botonFuego;
let botonAgua ;
let botonTierra; 
let botones= [];
let iAtaqueJugador;
let iAtaqueEnemigo;
let resultado;
let victoriasJugador = 0;
let victoriasEnemigo = 0;
let vidasEnemigo = 3;
let vidasJugador = 3;
let lienzo = Mapa.getContext("2d");
let intervalo
let mapaBioma = new Image();
mapaBioma.src = "./cssImages/3d.jpg";
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20;
const anchoMaximoDelMapa = 350;

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20;
}


alturaQueBuscamos = anchoDelMapa * 600 / 800;

mapa.width = anchoDelMapa;
mapa.height = alturaQueBuscamos;    

class Mokepon{
    constructor(nombre, foto, vida,fotoMapa, id = null){
        this.id = id;
        this.nombre = nombre;
        this.foto = foto;
        this.vida = vida;
        this.ataques = [];
        this.ancho = 35;
        this.alto = 35;
        this.x = aleatorio(0, mapa.width - this.ancho);
        this.y = aleatorio(0, mapa.height - this.alto);
        this.mapaFoto = new Image();
        this.mapaFoto.src = fotoMapa;
        this.velocidadX = 0;
        this.velocidadY = 0;

    }
    pintarMokepon(){
        lienzo.drawImage(
             this.mapaFoto,
             this.x,
             this.y,
             this.ancho,
             this.alto
        ); 
    };
}

let dragon = new Mokepon("dragon", "./cssImages/dragon2.png", 3, "./cssImages/cDragon.png" );

let cocodrilo = new Mokepon("cocodrilo", "./cssImages/cocodrilo.png", 3, "./cssImages/cCocodrilo.png");

let gorila = new Mokepon("gorila", "./cssImages/gorila2.png", 3, "./cssImages/cGorila.png" );

const DRAGON_ATAQUES =[
    {nombre: "🔥",id: "fuego"},
    {nombre: "🔥",id: "fuego"},
    {nombre: "🔥",id: "fuego"},
    {nombre: "💧",id: "agua"},
    {nombre: "🌱",id: "tierra"},
]

dragon.ataques.push(...DRAGON_ATAQUES)


const COCODRILO_ATAQUES =[ 
    {nombre: "💧",id: "agua"},
    {nombre: "💧",id: "agua"},
    {nombre: "💧",id: "agua"},
    {nombre: "🔥",id: "fuego"},
    {nombre: "🌱",id: "tierra"},]

cocodrilo.ataques.push(...COCODRILO_ATAQUES)
   

   
const GORILA_ATAQUES =[
    {nombre: "🌱",id: "tierra"},
    {nombre: "🌱",id: "tierra"},
    {nombre: "🌱",id: "tierra"},
    {nombre: "💧",id: "agua"},
    {nombre: "🔥",id: "fuego"},]

gorila.ataques.push(...GORILA_ATAQUES)

    
Mokepones.push(dragon, cocodrilo, gorila);



function inicio() {
    sectionReiniciar.style.display = "none";
    sectionSeleccionarAtaque.style.display = "none";
    sectionMapaDeCanva.style.display = "none";

    Mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
        <input type="radio" name="mascota" id=${mokepon.nombre} />
                <label class="tarjetaDeMokepon"for=${mokepon.nombre}>${mokepon.nombre}
                    <img src=${mokepon.foto} alt=${mokepon.nombre}>
                </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones;
        
         inputdragon = document.getElementById("dragon");
         inputcocodrilo = document.getElementById("cocodrilo");
         inputgorila= document.getElementById("gorila");
    })

    botonSeleccion.addEventListener("click", seleccionarMascotaJugador);
    
    botonReinicio.addEventListener("click", reiniciarJuego);

    unirseAlJuego();

}

function unirseAlJuego() {
    fetch("http://192.168.1.18:8080/unirse")
        .then(function (res){
            if (res.ok) {
                 res.text()
                   .then(function (respuesta) {
                    console.log(respuesta)
                    jugadorId = respuesta;
                  })
                }

        })
}


function seleccionarMascotaJugador() {
    
   
    if (inputdragon.checked) {
        spanMascotaJugador.innerHTML = inputdragon.id;
        mascotaJugador = inputdragon.id;
    } else if (inputcocodrilo.checked) {
        spanMascotaJugador.innerHTML = inputcocodrilo.id;
        mascotaJugador = inputcocodrilo.id;

    } else if (inputgorila.checked) {
        spanMascotaJugador.innerHTML = inputgorila.id;
        mascotaJugador = inputgorila.id;

    } else {
        alert("Selecciona un personaje");
        return
    }
    sectionSeleccionarMascota.style.display = "none";

    seleccionarElement(mascotaJugador);

    extraerAtaque(mascotaJugador);
    sectionMapaDeCanva.style.display = "flex"; 
    iniciarMapa();
 
    
}


function seleccionarElement(mascotaJugador){
    fetch (`http://192.168.1.18:8080/mokepon/${jugadorId}`, {
          method: "post",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
              mokepon: mascotaJugador
          })

    })
}  




function extraerAtaque(mascotaJugador) {
    let ataques
    for (let i = 0; i < Mokepones.length; i++) {
        if (Mokepones[i].nombre == mascotaJugador) {
            ataques = Mokepones[i].ataques;
        }
    }
    mostrarAtaques(ataques);
}

function mostrarAtaques(ataques){
    ataques.forEach((ataque) => {
        ataquesMokepones = `
        <button id=${ataque.id} class="ataques BAtaque"> ${ataque.nombre}</button>`;

        contenedorAtaques.innerHTML += ataquesMokepones;

    });
     botonFuego = document.getElementById("fuego");
     botonAgua = document.getElementById("agua") 
     botonTierra = document.getElementById("tierra")
     botones = document.querySelectorAll(".BAtaque");


   



}

function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener("click", (e) => {
           if (e.target.textContent == " 🔥") {
               jugadaAtaque.push ("FUEGO")
               console.log(jugadaAtaque)
               boton.style.backgroundColor = "#112F58"
               boton.disabled = true;
            } else if (e.target.textContent == " 💧") {
                jugadaAtaque.push ("AGUA")
                console.log(jugadaAtaque)
                boton.style.backgroundColor = "#112F58"
                boton.disabled = true;

            } else {
                jugadaAtaque.push ("TIERRA");
                console.log(jugadaAtaque)
                boton.style.backgroundColor = "#112F58"
                boton.disabled = true;

            }    
            if (jugadaAtaque.length === 5) {
            enviarAtaques()
        }
    })
})

}

function enviarAtaques() {
   fetch(`http://192.168.1.18:8080/mokepon/${jugadorId}/ataques`, {
         method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ataques: jugadaAtaque
            })

   }) 

intervalo = setInterval(obtenerAtaques, 50);

}

function obtenerAtaques() {
   fetch(`http://192.168.1.18:8080/mokepon/${enemigoId}/ataques`) 
         .then(function (res) {
              if (res.ok) {
                res.json()
                .then(function ({ataques}) {
                     if (ataques.length === 5) {
                        jugadaAtaqueEnemigo = ataques
                          resultadoFinal()
                     }
                })
              }
         })
}

function seleccionarMascotaEnemigo(enemigo) {
   

    spanMascotaEnemigo.innerHTML = enemigo.nombre;
    ataquesMokeponEnemigo = enemigo.ataques;
    secuenciaAtaque();
}


function seleccionarAtaqueEnemigo() {
    console.log("ataque enemigo", ataquesMokeponEnemigo) ;
    
    let ataqueEnemigo = aleatorio(0, ataquesMokeponEnemigo.length - 1);

    if (ataqueEnemigo == 0 || ataqueEnemigo == 1) {
        jugadaAtaqueEnemigo.push ("FUEGO");
    } else if (ataqueEnemigo == 3 || ataqueEnemigo == 4) {
        jugadaAtaqueEnemigo.push ("AGUA");
    } else {
        jugadaAtaqueEnemigo.push ("TIERRA");
    }
    console.log(jugadaAtaqueEnemigo)

    iniciarpelea();
}

function iniciarpelea() {
     if (jugadaAtaque.length === 5 ) {
        resultadoFinal();
     }
}


function iAmbosOponentes(jugador, enemigo) {
    iAtaqueJugador = jugadaAtaque[jugador];
    iAtaqueEnemigo = jugadaAtaqueEnemigo[enemigo];
}

function actualizarVidas() {
    if (resultado == "GANASTE") {
        spanVidasJugador.innerHTML = ++victoriasJugador;
    } else if (resultado == "PERDISTE") {
        spanVidasEnemigo.innerHTML = ++victoriasEnemigo;
    }
}

function resultadoFinal() {
    clearInterval(intervalo)
   

    for (let i = 0; i < jugadaAtaque.length; i++) {
        iAmbosOponentes(i, i);
        if (iAtaqueJugador === iAtaqueEnemigo) {
            crearMensaje("EMPATE");
            resultado = "EMPATE";
            actualizarVidas();
        } else if (
            (iAtaqueJugador === "FUEGO" && iAtaqueEnemigo === "TIERRA") ||
            (iAtaqueJugador === "AGUA" && iAtaqueEnemigo === "FUEGO") ||
            (iAtaqueJugador === "TIERRA" && iAtaqueEnemigo === "AGUA")
        ) {
            crearMensaje("GANASTE");
            resultado = "GANASTE";
            actualizarVidas();
        } else {
            crearMensaje("PERDISTE");
            resultado = "PERDISTE";
            actualizarVidas();
        }
        revisarVidas();
    }
    
   
    
}
function crearMensaje() {
    let nuevoAtaqueDelJugador = document.createElement("p");
    let nuevoAtaqueDelEnemigo = document.createElement("p");

    sectionMensaje.innerHTML = resultado;
    nuevoAtaqueDelJugador.innerHTML = iAtaqueJugador;
    nuevoAtaqueDelEnemigo.innerHTML = iAtaqueEnemigo;

    ataqueDelJugador.appendChild(nuevoAtaqueDelJugador);
    ataqueDelEnemigo.appendChild(nuevoAtaqueDelEnemigo);

   
}

function revisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("Empate, no hay ganador.");
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("¡Felicidades, ganaste!");
    }else 
        crearMensajeFinal("¡Lo siento, perdiste!");
}

function crearMensajeFinal(resultadoF) {
    sectionMensaje.innerHTML = resultadoF;

    

    sectionReiniciar.style.display = "block";
}

function reiniciarJuego() {
    location.reload();
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function pintarcanvas (){

    mascotaJugadorobjeto.x = mascotaJugadorobjeto.x + mascotaJugadorobjeto.velocidadX;
    mascotaJugadorobjeto.y = mascotaJugadorobjeto.y + mascotaJugadorobjeto.velocidadY;

    lienzo.clearRect(0, 0, Mapa.width, Mapa.height);
    lienzo.drawImage(mapaBioma, 
        0, 
        0, 
        Mapa.width, 
        Mapa.height);
    mascotaJugadorobjeto.pintarMokepon();

    enviarposicion(mascotaJugadorobjeto.x, mascotaJugadorobjeto.y);

   MokeponesEnemigos.forEach(function(mokepon){
        mokepon.pintarMokepon();
        revisarColision(mokepon);
   })

  
}


function enviarposicion(x, y) {
    fetch(`http://192.168.1.18:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
             x,
             y 
        })
    })
    .then(function (res){
        if (res.ok){
            res.json()
            .then(function({ enemigos}) {
                console.log(enemigos)
                MokeponesEnemigos = enemigos.map(function(enemigo){
                    let mokeponEnemigo = null
                    const mokeponNombre = enemigo.mokepon.nombre || ""
                    if (mokeponNombre == "dragon"){
                        mokeponEnemigo = new Mokepon("dragon", "./cssImages/dragon2.png", 3, "./cssImages/cDragon.png", enemigo.id);
                    } else if (mokeponNombre == "cocodrilo"){
                        mokeponEnemigo = new Mokepon("cocodrilo", "./cssImages/cocodrilo.png", 3, "./cssImages/cCocodrilo.png", enemigo.id); 

                    } else if (mokeponNombre == "gorila"){
                        mokeponEnemigo = new Mokepon("gorila", "./cssImages/gorila2.png", 3, "./cssImages/cGorila.png", enemigo.id);
                    }

                    mokeponEnemigo.x = enemigo.x
                    mokeponEnemigo.y = enemigo.y

                    return mokeponEnemigo

                })
            })
        }
    })
}



    

function botonDerrecha (){
    mascotaJugadorobjeto.velocidadX =  5;
   
}
function botonIzquierda (){
    mascotaJugadorobjeto.velocidadX = - 5;
} 
function botonArriba (){
    mascotaJugadorobjeto.velocidadY = - 5;
}
function botonAbajo (){
    mascotaJugadorobjeto.velocidadY = + 5;
}  

function detenerMovimiento (){
    mascotaJugadorobjeto.velocidadX = 0;
    mascotaJugadorobjeto.velocidadY = 0;
}

function presionarTecla (evento){
    switch (evento.key) {
        case "ArrowRight":
            botonDerrecha();
            break;
        case "ArrowLeft":
            botonIzquierda();
            break;
        case "ArrowUp":
            botonArriba();
            break;
        case "ArrowDown":
            botonAbajo();
            break;  
    }
}

function iniciarMapa (){
   
    mascotaJugadorobjeto = obtenerObjetoMascota(mascotaJugador);
    
    intervalo = setInterval(pintarcanvas, 50);
    window.addEventListener("keydown", presionarTecla);
    window.addEventListener("keyup", detenerMovimiento);

}

function obtenerObjetoMascota (){
    for (let i = 0; i < Mokepones.length; i++) {
        if (Mokepones[i].nombre == mascotaJugador) {
            return Mokepones[i];
        }
    }
}

function revisarColision(enemigo) {
    const arribaMascota = mascotaJugadorobjeto.y;
    const abajoMascota = mascotaJugadorobjeto.y + mascotaJugadorobjeto.alto;
    const izquierdaMascota = mascotaJugadorobjeto.x;
    const derechaMascota = mascotaJugadorobjeto.x + mascotaJugadorobjeto.ancho;

    const arribaEnemigo = enemigo.y;
    const abajoEnemigo = enemigo.y + enemigo.alto;
    const izquierdaEnemigo = enemigo.x;
    const derechaEnemigo = enemigo.x


    if (
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return
    }

    detenerMovimiento();
    clearInterval(intervalo);
    console.log("se detecto colision");

    enemigoId = enemigo.id;
    
    sectionSeleccionarAtaque.style.display = "flex";
    sectionMapaDeCanva.style.display = "none";
    seleccionarMascotaEnemigo(enemigo);



}






window.addEventListener("load", inicio);
