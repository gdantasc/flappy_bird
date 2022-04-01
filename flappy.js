function newElement(tagName, className) {
  const elem = document.createElement(tagName);
  elem.className = className;
  return elem;
}

function Barrier(reverse = false) {
  this.element = newElement("div", "barrier");

  const border = newElement("div", "border");
  const body = newElement("div", "body");
  this.element.appendChild(reverse ? body : border);
  this.element.appendChild(reverse ? border : body);

  this.setBarrierHeight = (barrierHeight) =>
    (body.style.height = `${barrierHeight}px`);
}

function PairOfBarriers(barrierHeight, opening, x) {
  this.element = newElement("div", "pair-of-barriers");

  this.superior = new Barrier(true);
  this.inferior = new Barrier(false);

  this.element.appendChild(this.superior.element);
  this.element.appendChild(this.inferior.element);

  this.drawOpening = () => {
    const superiorHeight = Math.random() * (barrierHeight - opening);
    const inferiorHeight = barrierHeight - opening - superiorHeight;
    this.superior.setBarrierHeight(superiorHeight);
    this.inferior.setBarrierHeight(inferiorHeight);
  };

  this.getX = () => parseInt(this.element.style.left.split("px")[0]);
  this.setX = (x) => (this.element.style.left = `${x}px`);
  this.getWidth = () => this.element.clientWidth;

  this.drawOpening();
  this.setX(x);
}

// const b = new PairOfBarriers(700, 200, 800);
// document.querySelector("[wm-flappy]").appendChild(b.element);

function Barriers(barrierHeight, barrierWidth, opening, space, notifyPoint) {
  this.pairs = [
    new PairOfBarriers(barrierHeight, opening, barrierWidth),
    new PairOfBarriers(barrierHeight, opening, barrierWidth + space),
    new PairOfBarriers(barrierHeight, opening, barrierWidth + space * 2),
    new PairOfBarriers(barrierHeight, opening, barrierWidth + space * 3),
  ];

  const displacement = 3;
  this.animate = () => {
    this.pairs.forEach((pair) => {
      pair.setX(pair.getX() - displacement);

      //quando o elemento sair da área do jogo
      if (pair.getX() < -pair.getWidth()) {
        pair.setX(pair.getX() + space * this.pairs.length);
        pair.drawOpening();
      }

      const middle = barrierWidth / 2;
      const crossedTheMiddle =
        pair.getX() + displacement >= middle && pair.getX() < middle;
      if (crossedTheMiddle) notifyPoint();
    });
  };
}

const barriers = new Barriers(700, 1200, 200, 400);
const areaDoJogo = document.querySelector("[wm-flappy]");
barriers.pairs.forEach((pair) => areaDoJogo.appendChild(pair.element));
setInterval(() => {
  barriers.animate();
}, 20);
