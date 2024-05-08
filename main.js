const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.defaultColor = color; 
        this.color = color;
        this.text = text;
        this.velocityX = Math.random() * 5 - 2; // velocidad random para el eje X
        this.velocityY = Math.random() * 5 - 2; // velocidad random para el eje Y
    }

    draw(Context) {
        Context.beginPath();
        Context.fillText(this.text, this.posX, this.posY);
        Context.strokeStyle = this.color; // Establece el color del contorno
        Context.textAlign = 'center'; // Centra el texto en el eje X
        Context.font = '30px Arial';
        Context.lineWidth = 3; //Tamaño de la linea de los circulos
        Context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false); //las coordenadas del centro del círculo (this.posX, this.posY), el radio del círculo (this.radius), el ángulo inicial (0), el ángulo final (Math.PI * 2, que representa un círculo completo) y la dirección del dibujo (false para dibujar en sentido horario).
        Context.stroke(); //traza el contorno del círculo en el lienzo.
        Context.closePath(); //Cierra el trazado de camino actual
    }

    update() {
        // actualiza la posición del círculo
        this.posX += this.velocityX;
        this.posY += this.velocityY;
        
        // comprueba colisiones con los bordes del canvas
        if (this.posX + this.radius >= canvas.width || this.posX - this.radius <= 0) {
            this.velocityX *= -1;
        }
        if (this.posY + this.radius >= canvas.height || this.posY - this.radius <= 0) {
            this.velocityY *= -1;
        }
        
        // asegura que el círculo permanezca dentro del canvas
        this.posX = Math.min(Math.max(this.posX, this.radius), canvas.width - this.radius);
        this.posY = Math.min(Math.max(this.posY, this.radius), canvas.height - this.radius);
    }
}


let arrayCircle = [];

for (let i = 0; i < 10; i++) {
    let randomX = Math.random() * window_width; 
    let randomY = Math.random() * window_height; 
    let randomRadius = Math.floor(Math.random() * 100 + 25); // Radio de los círculos va de 1 a 99
    let color = i % 2 === 0 ? 'green' : 'red'; // Alterna entre verde y rojo
    let miCirculo = new Circle(randomX, randomY, randomRadius, color, i + 1);
    arrayCircle.push(miCirculo);
}



function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas en todo momento
    for (let i = 0; i < arrayCircle.length; i++) {
        arrayCircle[i].update(); // Actualiza la posición de los círculos
        arrayCircle[i].draw(ctx); // Dibuja los círculos
    }

    // Verifica colisiones
    for (let i = 0; i < arrayCircle.length; i++) {
        for (let j = i + 1; j < arrayCircle.length; j++) {
            if (checkCollision(arrayCircle[i], arrayCircle[j])) {
                handleCollision(arrayCircle[i], arrayCircle[j]);
            }
        }
    }

    requestAnimationFrame(animate); // Llama el próximo frame
}




// Función para manejar la colisión entre dos círculos
function handleCollision(miCirculo1, miCirculo2) {
    const dx = miCirculo1.posX - miCirculo2.posX;
    const dy = miCirculo1.posY - miCirculo2.posY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const over = miCirculo1.radius + miCirculo2.radius - dist;
    // Evita la superposición
    const angulo = Math.atan2(dy, dx);
    const moveX = over * Math.cos(angulo);
    const moveY = over * Math.sin(angulo);
    miCirculo1.posX += moveX / 2;
    miCirculo1.posY += moveY / 2;
    miCirculo2.posX -= moveX / 2;
    miCirculo2.posY -= moveY / 2;
    // Realizaimular el rebote
    const tempVelocityX = miCirculo1.velocityX;
    const tempVelocityY = miCirculo1.velocityY;
    miCirculo1.velocityX = miCirculo2.velocityX;
    miCirculo1.velocityY = miCirculo2.velocityY;
    miCirculo2.velocityX = tempVelocityX;
    miCirculo2.velocityY = tempVelocityY;


   // Cambia los colores de los círculos al rebotar
   const newColor = miCirculo1.color === 'green' ? 'red' : 'green';
   miCirculo1.color = newColor;
   miCirculo2.color = newColor;

}

// Función para verificar colisiones entre dos círculos
function checkCollision(miCirculo1, miCirculo2) {
    const dx = miCirculo1.posX - miCirculo2.posX;
    const dy = miCirculo1.posY - miCirculo2.posY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    return dist <= miCirculo1.radius + miCirculo2.radius;
}

animate(); // Comienza la animación
