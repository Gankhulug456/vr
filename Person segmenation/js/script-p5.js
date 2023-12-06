
let cam;
let segmenter;
let segmentationData = [];

function setup() {
  let videoWidth = 640; // Set the actual width of your video feed
  let videoHeight = 480; // Set the actual height of your video feed
  let canvas = createCanvas(videoWidth, videoHeight);
  canvas.parent("container-p5");
  background(50);
  frameRate(30);
  cam = createCapture(VIDEO, camReady);
  cam.size(videoWidth, videoHeight);
  cam.hide();
  initThree();
  //canvas.hide()
}

function draw() {
  getSegmentation();
  background(0);
  image(cam, 0, 0);
  noStroke();
  fill(255);
  const gridSize = 10;
  cam.loadPixels();
  particles = [];

  //Particle Grid
  for (let y = 0; y < cam.height; y += gridSize) {
    for (let x = 0; x < cam.width; x += gridSize) {
      const index = (x + y * cam.width) * 4;
      const segIndex = segmentationData[index];
      text(segIndex, x, y);
      const x3D = map(x, 0, cam.width, -WORLD_HALF, WORLD_HALF);
      const y3D = map(y, 0, cam.height, WORLD_HALF, -WORLD_HALF);
      const z3D = 0; // You can set the z-coordinate as needed
      const r = cam.pixels[index + 0] / 255;
      const g = cam.pixels[index + 1] / 255;
      const b = cam.pixels[index + 2] / 255;
      const x1 = 0
      const y1 = 0
      const z1 = 0


      if (segIndex != 0) {
        // Particles


        const tParticle = new Particle()
          .setPosition(x3D, y3D, z3D)
          .setRotation(x1,y1,z1)
          .setColor(r, g, b)
          .setVelocity(0, random(-0.2, -0.1), random(-0.1, 0.1));
        particles.push(tParticle);
      }
    }
  }

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.move();
    p.age();
    if (!p.appearing && p.lifespan <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
}


//CAM and Segmentation
function camReady() {
  console.log("Webcam Ready!");
  loadBodySegmentationModel();
}

async function loadBodySegmentationModel() {
  const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
  const segmenterConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation'
  };
  segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
  console.log("Model Loaded!");
}
async function getSegmentation() {
  if (segmenter == undefined) return;
  const segmentationConfig = {
    flipHorizontal: false
  };
  const segmentation = await segmenter.segmentPeople(cam.elt, segmentationConfig);
  if (segmentation.length > 0) {
    let result = await segmentation[0].mask.toImageData();
    segmentationData = result.data;;
  }
}