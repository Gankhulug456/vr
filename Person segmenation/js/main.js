let params = {
  drawCount: 0,
  color: "#FFF"
};

let frameMaterial;
const WORLD_SIZE = 2000;
const WORLD_SIZE2 = 10000;
const WORLD_SIZE3 = 2000;
const WORLD_SIZE4 = 5000;
const WORLD_HALF = WORLD_SIZE / 2;
const MAX_PARTICLE_NUMBER = 10000;
let textureCube;
let pointCloud;
let pointCloud2;
let pointCloud3;
let particles = [];
let garage;
let light;
let sphere;

function setupThree() {
  gui
    .add(camera, "fov")
    .min(1)
    .max(179)
    .step(1)
    .onChange(updateCamera);

  //Glitch Space
  texture = new THREE.TextureLoader().load('assets/glitch.jpeg');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.offset.set(2, 2);
  texture.repeat.set(3, 3);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  plane = getPlane();
  plane.scale.set(3.5,2.15,1)
  plane2 = getPlane();
  plane2.scale.set(3.5,2.15,1)
  plane.position.set(0,950,4000)
  plane2.position.set(0,950,4000)
//  plane3 = getPlane()
//  plane3.scale.set(5,2.15,1)
//  plane3.position.set(0,950,6500)

//ENV
  const loader = new THREE.CubeTextureLoader();
  loader.setPath('assets/');
  textureCube = loader.load([
    'px.png', 'nx.png',
    'py.png', 'ny.png',
    'pz.png', 'nz.png'
  ]);
//ENV2
  loader.setPath('assets/Motion/');
  textureCube1 = loader.load([
    'px.png', 'nx.png',
    'py.png', 'ny.png',
    'pz.png', 'nz.png'
  ]);
  // OBJ + Refraction
  textureCube.mapping = THREE.CubeRefractionMapping;
  const cubeMaterial = new THREE.MeshPhongMaterial({
    color: 0xccddFF,
    envMap: textureCube,
    refractionRatio: 1,
    reflectivity: 0.95
  });
  loadOBJ("assets/Garage.obj", cubeMaterial);
  light = getLight();

//Scene
  scene.background = textureCube1;
//Scene and Particles

  pointCloud = getPoints(MAX_PARTICLE_NUMBER);
  frameMaterial = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    depthTest: false,
    uniforms: {
      pointCloudPosition: { value: pointCloud.geometry.attributes.position },
      pointCloudColor: { value: pointCloud.geometry.attributes.color },
      
      worldSize: { value: 5000 },
    },
  });
  sphere2 = getSphere2();
  sphere2.scale.set(7000.0, 7000.0, 7000.0);
  sphere = getSphere();
  sphere.scale.set(7600.0, 7600.0, 7600.0);
  sphere3 = getSphere();
  sphere3.scale.set(2000, 2000, 2000)
  sphere4 = getSphere()
  sphere4.scale.set(2000,2000,2000)
  sphere5 = getSphere()
  sphere5.scale.set(2000,2000,2000)

  frame1 = getFrame()
  frame1.scale.set(2100,1700,100)
  frame1.position.set(0,0,-1600)

  frame2 = getFrame()
  frame2.scale.set(2100,1700,100)
  frame2.position.set(-2500,0,100)
  frame2.rotation.set(0,PI/2,0)

  frame3 = getFrame()
  frame3.scale.set(2100,1700,100)
  frame3.position.set(2350,0,100)
  frame3.rotation.set(0,PI/2,0)

  pointCloud2 = getPoints(MAX_PARTICLE_NUMBER);
  frameMaterial = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    depthTest: false,
    uniforms: {
      pointCloudPosition: { value: pointCloud2.geometry.attributes.position },
      pointCloudColor: { value: pointCloud2.geometry.attributes.color },
      pointCloudRotation: { value: pointCloud2.geometry.attributes.rotation },
      worldSize: { value: 5000 },
    },
  });
  pointCloud2.rotation.set(0,PI/2,0)
  pointCloud2.position.set(-2400,0,100)
  pointCloud2.scale.set(1,1,1)

  pointCloud3 = getPoints(MAX_PARTICLE_NUMBER);
  frameMaterial = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    depthTest: false,
    uniforms: {
      pointCloudPosition: { value: pointCloud2.geometry.attributes.position },
      pointCloudColor: { value: pointCloud2.geometry.attributes.color },
      pointCloudRotation: { value: pointCloud2.geometry.attributes.rotation },
      worldSize: { value: 5000 },
    },
  });

  pointCloud3.rotation.set(0,PI/2,0)
  pointCloud3.position.set(2250,0,100)

}
//CAM Update
function updateCamera() {
  camera.updateProjectionMatrix();
}
//Update
function updateThree() {
  //OBJ modifier
  if (garage !== undefined) {
    garage.scale.x = 40.0;
    garage.scale.y = 40.0;
    garage.scale.z = 30.0;
    garage.position.y = -1200
  }
  //Light
  light.position.x = cos(frame * 0.01) * 100;
  light.position.y = sin(frame * 0.005) * 100;
  light.position.z = sin(frame * 0.01) * 100;

  //Sphere position
  sphere3.position.x = cos(frame * 0.02) * 10000 
  sphere3.position.y = sin(frame * 0.02) * 10000
  sphere3.position.z = sin(frame * 0.02) * 10000
  sphere4.position.x = cos(frame * 0.02) * 15000
  sphere4.position.y = sin(frame * 0.02) * 15000
  sphere4.position.z = cos(frame * 0.02) * 15000
  sphere5.position.x = cos(frame * 0.02) * 20000
  sphere5.position.y = sin(frame * 0.02) * 20000
  sphere5.position.z = sin(frame * 0.02) * 20000
  // Update Particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.age();
    if (!p.appearing && p.lifespan <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
  while (particles.length > MAX_PARTICLE_NUMBER) {
    particles.splice(0, 1);
  }

  // Update Points
  const position = pointCloud.geometry.attributes.position;
  const color = pointCloud.geometry.attributes.color;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const ptIndex = i * 3;
    // Position
    position.array[ptIndex + 0] = p.pos.x;
    position.array[ptIndex + 1] = p.pos.y;
    position.array[ptIndex + 2] = p.pos.z - 1500;
    // Color
    color.array[ptIndex + 0] = p.color.r;
    color.array[ptIndex + 1] = p.color.g;
    color.array[ptIndex + 2] = p.color.b;
  }
  position.needsUpdate = true;
  color.needsUpdate = true;
  pointCloud.geometry.setDrawRange(0, particles.length); // ***

//POINTS2
    // Update Points
    const position2 = pointCloud2.geometry.attributes.position;
    const color2 = pointCloud2.geometry.attributes.color;
    const rotation2 = pointCloud2.geometry.attributes.rotation;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const ptIndex = i * 3;
      // Position
      position2.array[ptIndex + 0] = p.pos.x;
      position2.array[ptIndex + 1] = p.pos.y; - 1000
      position2.array[ptIndex + 2] = p.pos.z - 0;
      // Color
      color2.array[ptIndex + 0] = p.color.r + random(0,0);
      color2.array[ptIndex + 1] = p.color.g + random(0,0.5);
      color2.array[ptIndex + 2] = p.color.b + random(0,0.5);

      rotation2.array[ptIndex + 0] = p.rotation.x1;
      rotation2.array[ptIndex + 1] = p.rotation.y1 -1000;
      rotation2.array[ptIndex + 2] = p.rotation.z1;

    }
    position2.needsUpdate = true;
    color2.needsUpdate = true;
    rotation2.needsUpdate = true;
    pointCloud2.geometry.setDrawRange(0, particles.length); // ***

//POINTS3
        // Update Points
        const position3 = pointCloud3.geometry.attributes.position;
        const color3 = pointCloud3.geometry.attributes.color;
        const rotation3 = pointCloud3.geometry.attributes.rotation;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const ptIndex = i * 3;
          // Position
          position3.array[ptIndex + 0] = p.pos.x;
          position3.array[ptIndex + 1] = p.pos.y; - 1000
          position3.array[ptIndex + 2] = p.pos.z - 0;
          // Color
          color3.array[ptIndex + 0] = p.color.r + random(0,0.5);
          color3.array[ptIndex + 1] = p.color.g + random(0,0.5);
          color3.array[ptIndex + 2] = p.color.b;
    
          rotation3.array[ptIndex + 0] = p.rotation.x1;
          rotation3.array[ptIndex + 1] = p.rotation.y1 -1000;
          rotation3.array[ptIndex + 2] = p.rotation.z1;
    
        }
        position3.needsUpdate = true;
        color3.needsUpdate = true;
        rotation3.needsUpdate = true;
        pointCloud3.geometry.setDrawRange(0, particles.length); // ***

//Glitch Space
  let posArray = plane.geometry.attributes.position.array;
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let xOffset = (x + 1000) * 0.5 + frame * 0.02;
    let yOffset = (y + 1000) * 0.5 + frame * 0.02;
    let amp = 15;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3.1;

    posArray[i + 5] = noiseValue; 
  }
  plane.geometry.attributes.position.needsUpdate = true;
      
}

//Glitch Space
function getPlane() {
  let geometry = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 150, 150);
  let material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide,
    map: texture,
    depthTest: true
  });
  let mesh = new THREE.Mesh(geometry, material);
  const sprite = new THREE.Sprite( material );
  scene.add( sprite )
  scene.add(mesh);
  return mesh;
}

//Light
function getLight() {
  const light = new THREE.PointLight(0xFFFFFF, 10, 3000, 0.05);
  scene.add(light);
  return light;
}
//Points
function getPoints(number) {
  const vertices = new Float32Array(number * 3);
  const colors = new Float32Array(number * 3);
  const rotation2 = new Float32Array(number * 3)
  // geometry
  const geometry = new THREE.BufferGeometry();
  // attributes
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('rotation', new THREE.Float32BufferAttribute(rotation2, 3));

  // draw range
  const drawCount = number; // draw the whole objects
  geometry.setDrawRange(0, drawCount);
  // geometry
  const material = new THREE.PointsMaterial({
    transparent: true,
    opacity: 1,
    vertexColors: true,
    size: 15,
    sizeAttenuation: true,
    depthTest: true,
  });
  // Points
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}
//Garage OBJ
function loadOBJ(filepath, material) {
  const loader = new OBJLoader();
  loader.load(
    filepath,
    function(obj) {
      garage = obj;
      for (let child of garage.children) {
        child.material = material;
      }
      scene.add(garage);
    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(err) {
      console.error('An error happened');
    }
  );
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    envMap: textureCube1,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return mesh;
}
function getSphere2() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    envMap: textureCube,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

function getFrame(){
  const geometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshPhongMaterial({
  })
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)
  return mesh
}


//Transition
//Multiple canvases
