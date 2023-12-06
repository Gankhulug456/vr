class Particle {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    this.color = { r: random(0, 1), g: random(0, 1), b: random(0, 1) };
    this.appearing = true;
    this.rotation = createVector()
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setRotation(x1, y1, z1) {
    this.rotation = createVector(x1, y1, z1);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = createVector(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = createVector(w, h, d);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    return this;
  }
  setColor(r, g, b) {
    this.color.r = random(0,1);
    this.color.g = g;
    this.color.b = b;
    return this;
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  adjustVelocity(amount) {
    this.vel.mult(1 + amount);
  }
  applyForce(f) {
    if (this.mass <= 0) {
      console.log("! Wrong mass");
      return;
    }
    let force = p5.Vector.div(f, this.mass);
    this.acc.add(force);
  }
  disappear() {
    if (this.appearing) {
      this.appearing = false; 
      this.vel.mult(0); 
    }
  }
  age() {
    if (!this.appearing) {
      this.pos.z -= 1; 
      if (this.pos.z < -WORLD_HALF) {
        this.pos.z = -WORLD_HALF;
        this.appearing = true; 
        this.pos.x = random(-WORLD_HALF, WORLD_HALF); 
        this.pos.y = random(-WORLD_HALF, WORLD_HALF);
      }
    }
  }
}
