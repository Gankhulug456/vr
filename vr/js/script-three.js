console.log("three.js Version: " + THREE.REVISION);

let container, gui, stats;
let scene, camera, renderer;
let controls;
let time, frame = 0;

function initThree() {
  scene = new THREE.Scene();
  //Camera
  const fov = 140;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 100000;
  camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  camera.position.z = 20000

  //Camera
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  gui = new dat.GUI();
  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.domElement);
  document.body.appendChild( VRButton.createButton( renderer ) );
  setupThree(); // Assuming this function is implemented in your code
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  stats.update();
  time = performance.now();
  frame++;
  
  camera.position.x = sin(frame * 0.005) * 500
  camera.rotation.y = sin(frame * 0.01) * 0.1
  x = 20
if(camera.position.z <= 1500){
    x = 0
 }  camera.position.z -= x

  updateThree(); // Assuming this function is implemented in your code

  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight; 

  camera.updateProjectionMatrix();
  renderer.setSize(window.outerWidth, window.outerHeight);
  renderer.xr.enabled = true;
});
renderer.setAnimationLoop( function () {

	renderer.render( scene, camera );

} );