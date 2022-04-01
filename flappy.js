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

// const b = new Barrier(true);
// b.setBarrierHeight(200);
// document.querySelector("[wm-flappy]").appendChild(b.element);

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

const b = new PairOfBarriers(700, 200, 800);

document.querySelector("[wm-flappy]").appendChild(b.element);
