var ww = window.innerWidth,
    wh = window.innerHeight;

var renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas")
});
renderer.setClearColor(0x000000);
renderer.setSize(ww, wh);

var scene = new THREE.Scene();

var camera = new THREE.OrthographicCamera( ww / - 2, ww / 2, wh / 2, wh / - 2, 1, 1000 );
camera.position.set(0, 0, 1);

// ===============
//WRAP WITH PARTICLES
// ===============
var wrapMatShader = new THREE.ShaderMaterial({
  uniforms: {
      mouse: { type: "vec2", value: new THREE.Vector2(0,0) },
      mouse2: { type: "vec2", value: new THREE.Vector2(0,0) },
      ww: { type: "float", value: ww },
      wh: { type: "float", value: wh },
      uTime: { type: "float", value: 0 },
  },
  vertexShader: document.getElementById("wrapVertexShader").textContent,
  fragmentShader: document.getElementById("wrapFragmentShader").textContent,
  transparent: true
});

var options = {
  particlesQuantity : 500000
};
var bufferWrapGeom = new THREE.BufferGeometry();
var wrapGeom,positions;
function wrapSceneWithParticles(){
  wrapGeom = new THREE.Geometry();
  positions = new Float32Array(options.particlesQuantity * 3);
  for (var i = 0; i < options.particlesQuantity; i++) {
    var vector = new THREE.Vector3(0,0,0);
    vector.applyMatrix4( new THREE.Matrix4().makeTranslation((Math.random()-0.5)*(ww*1.2), (Math.random()-0.5)*(wh*1.2), Math.random()*-800));
    vector.vx = (Math.random()-0.5)*20;
		vector.vy = (Math.random()-0.5)*20;
    wrapGeom.vertices.push(vector);
    //Add to attributes
    vector.toArray(positions, i * 3);
    var speed = new THREE.Vector2(Math.random(), Math.random());
  }
  bufferWrapGeom.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  wrap = new THREE.Points(bufferWrapGeom, wrapMatShader);
  scene.add(wrap);
}

var mouse = new THREE.Vector3(0,0,0);
var mouse2 = new THREE.Vector3(0,0,0);
window.addEventListener("mousemove", function(e) {
  mouse.x = (e.clientX - ww*0.5);
  mouse.y = (wh*0.5 - e.clientY);
  wrapMatShader.uniforms.mouse.value.x = mouse.x;
  wrapMatShader.uniforms.mouse.value.y = mouse.y;
  e.preventDefault();
  return false;
});
document.querySelector("canvas").addEventListener("touchmove", function(e) {
  if(e.touches.length >= 1){
    mouse.x = (e.touches[0].clientX - ww*0.5);
    mouse.y = (wh*0.5 - e.touches[0].clientY);
    wrapMatShader.uniforms.mouse.value.x = mouse.x;
    wrapMatShader.uniforms.mouse.value.y = mouse.y;
  }
  if(e.touches.length >= 2){
    mouse2.x = (e.touches[1].clientX - ww*0.5);
    mouse2.y = (wh*0.5 - e.touches[1].clientY);
    wrapMatShader.uniforms.mouse2.value.x = mouse2.x;
    wrapMatShader.uniforms.mouse2.value.y = mouse2.y;
  }
  e.preventDefault();
  return false;
});
document.querySelector("canvas").addEventListener("touchend", function(e) {
  mouse2.x = 0;
  mouse2.y = 0;
  wrapMatShader.uniforms.mouse2.value.x = mouse2.x;
  wrapMatShader.uniforms.mouse2.value.y = mouse2.y;
});
//On resize of the scren, reset the scene parameters
window.addEventListener("resize", function() {
  ww = window.innerWidth;
  wh = window.innerHeight;
  camera.aspect = ww / wh;
  camera.updateProjectionMatrix();
  renderer.setSize(ww, wh);
  
  wrapMatShader.uniforms.ww.value = ww;
  wrapMatShader.uniforms.wh.value = wh;
});

// ========  
//RENDER
// ========  
function render(a) {
  requestAnimationFrame(render);
  
  wrapMatShader.uniforms.uTime.value = a;
  
  renderer.render(scene, camera);
}


//Create the particles wrap
wrapSceneWithParticles();
requestAnimationFrame(render);