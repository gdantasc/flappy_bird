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

function areSuperimposed(elementA, elementB) {
  const a = elementA.getBoundingClientRect();
  const b = elementB.getBoundingClientRect();

  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;
  return horizontal && vertical;
}

function collided(bird, barriers) {
  let collided = false;
  barriers.pairs.forEach((pairOfBarriers) => {
    if (!collided) {
      const superior = pairOfBarriers.superior.element;
      const inferior = pairOfBarriers.inferior.element;
      collided =
        areSuperimposed(bird.element, superior) ||
        areSuperimposed(bird.element, inferior);
    }
  });
  return collided;
}

function setGameOver() {
  const gameArea = document.querySelector("[wm-flappy]");
  const gameOverMsg = newElement("div", "gameOver");
  const newGameMsg = newElement("p", "gameOverP");

  gameOverMsg.innerHTML = "GAME OVER";
  newGameMsg.innerHTML = "Press any key to reload";

  gameArea.appendChild(gameOverMsg);
  gameArea.appendChild(newGameMsg);
}

function FlappyBird() {
  let points = 0;

  const gameArea = document.querySelector("[wm-flappy]");
  const gameHeight = gameArea.clientHeight;
  const gameWidth = gameArea.clientWidth;

  const progress = new Progress();
  const barriers = new Barriers(gameHeight, gameWidth, 200, 400, () =>
    progress.updatePoints(++points)
  );
  const bird = new Bird(gameWidth);

  gameArea.appendChild(progress.element);
  gameArea.appendChild(bird.element);
  barriers.pairs.forEach((pair) => gameArea.appendChild(pair.element));

  this.start = () => {
    const timer = setInterval(() => {
      barriers.animate();
      bird.animate();

      if (collided(bird, barriers)) {
        clearInterval(timer);
        setGameOver();
        setTimeout(() => {
          window.onkeydown = (e) => location.reload();
        }, 500);
      }
    }, 20);
  };
}

new FlappyBird().start();
