const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';
class Particule {
    constructor(x,y,directionX,directionY,size,color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    drawParticule(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    moveParticule(){
        (this.x > canvas.width || this.x < 0) && (this.directionX = -this.directionX);
        (this.y > canvas.height || this.y < 0) && (this.directionY = -this.directionY);
        this.x += this.directionX;
        this.y += this.directionY;
        this.drawParticule();
    }
}

let particulesArray = [];

const randomDirection = () => {
    const randomBoolean = Math.round(Math.random());
    return randomBoolean ? Math.random() : - Math.random();
}

const createParticules = () => {
    particulesArray = [];
    const number = (canvas.width * canvas.height) / 7000;
    for (let i = 0; i < number; i++) {
        const x = Math.random()*(innerWidth - 20) + 10;
        const y = Math.random()*(innerHeight - 20) + 10;
        const directionX = randomDirection();
        const directionY = randomDirection();
        particulesArray.push(new Particule(x,y,directionX,directionY,1.5,'rgb(255,255,255)'));
    }
}
createParticules();

const joinParticules = () => {
    particulesArray.map(e => {
        particulesArray.map(el => {
            const a = e.x - el.x;
            const b = e.y - el.y;
            const hypothenuse = Math.sqrt(a**2 + b**2);
            if (hypothenuse < 95 && e !== el) {
                ctx.moveTo(e.x, e.y);
                ctx.lineTo(el.x, el.y);
                ctx.stroke();
                ctx.strokeStyle = `rgba(255,255,255,${1-(hypothenuse / 115)})`;
                ctx.lineWidth = 0.02;
            }
        });
    })
}

const animateParticules = () => {
    ctx.clearRect(0,0,innerWidth,innerHeight);
    particulesArray.map(e => e.moveParticule());
    joinParticules();
    requestAnimationFrame(animateParticules);
}

animateParticules();

const getDimensions = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticules();
}
getDimensions();

window.addEventListener('resize',getDimensions);