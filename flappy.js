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

function Bird(gameHeight) {
  let flying = false;

  this.element = newElement("img", "bird");
  this.element.src = "assets/passaro.png";

  this.getY = () => parseInt(this.element.style.bottom.split("px")[0]);
  this.setY = (y) => (this.element.style.bottom = `${y}px`);

  window.onkeydown = (e) => (flying = true);
  window.onkeyup = (e) => (flying = false);

  this.animate = () => {
    const newY = this.getY() + (flying ? 8 : -5);
    const maxHeight = gameHeight - this.element.clientHeight;

    if (newY <= 0) {
      this.setY(0);
    } else if (newY >= maxHeight) {
      this.setY(maxHeight);
    } else {
      this.setY(newY);
    }
  };

  this.setY(gameHeight / 2);
}

function Progress() {
  this.element = newElement("span", "progress");
  this.updatePoints = (points) => {
    this.element.innerHTML = points;
  };
  this.updatePoints(0);
}

// const barriers = new Barriers(700, 1200, 200, 400);
// const bird = new Bird(700);
// const areaDoJogo = document.querySelector("[wm-flappy]");
// areaDoJogo.appendChild(bird.element);
// areaDoJogo.appendChild(new Progress().element);
// barriers.pairs.forEach((pair) => areaDoJogo.appendChild(pair.element));
// setInterval(() => {
//   barriers.animate();
//   bird.animate();
// }, 20);

function FlappyBird() {
  let points = 0;

  const areaDoJogo = document.querySelector("[wm-flappy]");
  const gameHeight = areaDoJogo.clientHeight;
  const gameWidth = areaDoJogo.clientWidth;

  const progress = new Progress();
  const barriers = new Barriers(gameHeight, gameWidth, 200, 400, () =>
    progress.updatePoints(++points)
  );
  const bird = new Bird(gameWidth);

  areaDoJogo.appendChild(progress.element);
  areaDoJogo.appendChild(bird.element);
  barriers.pairs.forEach((pair) => areaDoJogo.appendChild(pair.element));

  this.start = () => {
    //loop do jogo
    const timer = setInterval(() => {
      barriers.animate();
      bird.animate();
    }, 20);
  };
}

new FlappyBird().start();
