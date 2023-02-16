const letters = { start: 97, end: 112 };
let app;
class Particles extends THREE.Object3D {
  constructor(params) {
    super();

    this.data = params.data;
    this.particles = 80000;
    this.partcielsSize = 1;
    let geo = this.createGeometry();
    let mat = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide });

    let uniforms = {
      uTheta: { value: +2.8 / 10 * Math.PI },
      uTargetRate: { value: 0.92 },
      // uTime : {value : 0},
      uTime: { value: 0 } };

    mat = new THREE.RawShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById('shader-vs').textContent,
      fragmentShader: document.getElementById('shader-fs').textContent,
      depthTest: false,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending });

    let mesh = new THREE.Mesh(geo, mat);
    this.add(mesh);

    this.uniforms = uniforms;

  }
  createGeometry() {
    let geometry = new THREE.BufferGeometry();

    let indices = [];
    let position = [];
    let uvs = [];
    let data = [];
    let data2 = [];

    let ii;
    for (ii = 0; ii < this.particles; ii++) {
      let theta = THREE.Math.randFloat(0, Math.PI * 2);
      let speed = THREE.Math.randFloat(0.01, 0.5);
      let size = THREE.Math.randFloat(1, 10);
      let directionRandom = THREE.Math.randFloat(0, 1);
      for (let jj = 0; jj < 4; jj++) {
        let xPos = parseInt(jj / 2);
        let yPos = jj % 2;

        uvs.push(xPos);uvs.push(yPos);uvs.push(directionRandom);
        position.push(0);position.push(0);position.push(0);
        data.push(theta);
        data.push(speed);
        data.push(size);
        data.push(Math.random());
      }

      indices.push(ii * 4 + 0);
      indices.push(ii * 4 + 1);
      indices.push(ii * 4 + 2);
      indices.push(ii * 4 + 1);
      indices.push(ii * 4 + 3);
      indices.push(ii * 4 + 2);
    }

    let letterPosition = [];
    for (ii = 0; ii < this.data.length; ii++) {
      let letterData = this.data[ii];

      if (ii % 2 == 0) {
        letterPosition = [];
      }


      for (let jj = 0; jj < this.particles; jj++) {

        let randomUv = uvs[jj * 12 + 2];
        // console.log(randomUv);
        let random = THREE.Math.randInt(0, letterData.length);

        let xPos = letterData[random] % 64;
        let yPos = parseInt(letterData[random] / 64);

        for (let kk = 0; kk < 4; kk++) {
          if (ii % 2 == 0) {
            letterPosition[2 * (jj * 8 + 2 * kk)] = xPos / 64 + THREE.Math.randFloat(-1 / 64, 1 / 64);;
            letterPosition[2 * (jj * 8 + 2 * kk) + 1] = -yPos / 64 + 0.5 + THREE.Math.randFloat(-1 / 64, 1 / 64);;
          } else {
            letterPosition[2 * (jj * 8 + 2 * kk) + 2] = xPos / 64 + THREE.Math.randFloat(-1 / 64, 1 / 64);
            letterPosition[2 * (jj * 8 + 2 * kk) + 3] = -yPos / 64 + 0.5 + THREE.Math.randFloat(-1 / 64, 1 / 64);;
          }
        }
      }

      if (ii % 2 == 1) {
        letterPosition = new Float32Array(letterPosition);
        geometry.addAttribute(`letterPosition${(ii - 1) / 2}`, new THREE.BufferAttribute(letterPosition, 4));
      }

    }

    indices = new Uint16Array(indices);
    position = new Float32Array(position);
    uvs = new Float32Array(uvs);
    data = new Float32Array(data);
    // data2 = new Float32Array(data2);

    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 3));
    geometry.addAttribute('data', new THREE.BufferAttribute(data, 4));
    // geometry.addAttribute('data2', new THREE.BufferAttribute(data2, 1));

    console.log(geometry);

    return geometry;
  }
  update() {
    this.uniforms.uTheta.value -= 1 / 40;
    // this.uniforms.uTheta.value += Math.PI * 2
  }
  keydown(value) {
    let count = -1;
    let targetValue = -2 * Math.PI * count - value / 26 * Math.PI * 2;

    while (Math.abs(this.uniforms.uTheta.value - targetValue) > Math.PI) {
      count++;
      console.log(Math.abs(this.uniforms.uTheta.value - targetValue));
      targetValue = -Math.PI * 2 * count - value / 26 * Math.PI * 2;
    }

    TweenMax.to(this.uniforms.uTargetRate, 1, { value: 1.0 });
    TweenMax.to(this.uniforms.uTheta, 0.6, { value: targetValue });
  }
  keyup() {
    TweenMax.killTweensOf([this.uniforms.uTargetRate]);
    TweenMax.to(this.uniforms.uTargetRate, 1.0, { value: 0.92 });
  }}


class App {
  constructor(params) {
    this.params = params || {};
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.x = 1000 / 1.5;
    this.camera.position.z = 300 / 1.5;
    this.camera.position.y = 300 / 1.5;
    this.camera.lookAt(new THREE.Vector3());

    this.scene = new THREE.Scene();

    // this.mesh = this.createMesh();
    // this.scene.add(this.mesh);
    this._createLetters();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true });

    this.dom = this.renderer.domElement;

    this.clock = new THREE.Clock();
    this.control = new THREE.OrbitControls(this.camera);

    this.resize();
  }

  _createLetters() {
    let ii;
    this.canvases = [];
    let size = 64;
    for (ii = 0; ii <= 9; ii++) {
      let canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      let ctx = canvas.getContext('2d');

        ctx.fillStyle = '#000';
        ctx.font = `${size - 5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ii, canvas.width / 2, canvas.height / 2 - 0);

      this.canvases.push(ctx);
    }

    this.letterDatas = [];

    this.canvases.forEach((canvas, index) => {
      let canvasData = canvas.getImageData(0, 0, size, size);
      this.letterDatas.push([]);

      for (let jj = 0; jj < canvasData.data.length; jj += 4) {
        let data = canvasData.data[jj + 3];
        if (data > 0) {
          this.letterDatas[index].push(jj / 4);
        }
      }

    });

    this.particles = new Particles({ data: this.letterDatas });
    this.scene.add(this.particles);

  }

  _addGui() {
    this.gui = new dat.GUI();
    this.gui.add(this.particles.uniforms.uTheta, 'value', 0.0, Math.PI * 2).step('0.01');
  }

  createMesh() {
    let geometry = new BoxGeometry(200, 200, 200);
    let shaderMaterial = new ShaderMaterial({
      vertexShader: glslify('../shaders/shader.vert'),
      fragmentShader: glslify('../shaders/shader.frag') });

    // let mat = new MeshBasicMaterial({ color : 0xff0000})
    let mesh = new Mesh(geometry, shaderMaterial);
    return mesh;
  }

  animateIn() {
    TweenMax.ticker.addEventListener('tick', this.loop, this);
  }

  loop() {
    let delta = this.clock.getDelta();
    this.particles.uniforms.uTime.value += delta;
    this.particles.update();

    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.02;


    this.renderer.render(this.scene, this.camera);
    if (this.stats) this.stats.update();

  }

  animateOut() {
    TweenMax.ticker.removeEventListener('tick', this.loop, this);
  }

  onMouseMove(mouse) {

  }

  onKeyDown(ev) {
    console.log(ev.which);
    if (ev.which >= 65 && ev.which <= 78) {
      // let target = ev.which -  65;
      // this.particles.keydown(target);
    }


    switch (ev.which) {
      case 27:
        this.isLoop = !this.isLoop;
        if (this.isLoop) {
          this.clock.stop();
          TweenMax.ticker.addEventListener('tick', this.loop, this);
        } else {
          this.clock.start();
          TweenMax.ticker.removeEventListener('tick', this.loop, this);
        }
        break;}

  }
  onKeyup(ev) {
    this.particles.keyup();
  }
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  destroy() {

  }}




(() => {
  init();
  start();
})();

function init() {
  app = new App({
    isDebug: false });


  document.body.appendChild(app.dom);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function start() {
  app.animateIn();
}


function onDocumentMouseMove(event) {
  // event.preventDefault();

  let mouseX = event.clientX / window.innerWidth * 2 - 1;
  let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  app.onMouseMove({ x: mouseX, y: mouseY });
}

window.addEventListener('resize', function () {
  app.resize();
});

window.addEventListener('keydown', function (ev) {
  console.log("keydown");
  app.onKeyDown(ev);
});
window.addEventListener('keyup', function (ev) {
  app.onKeyup(ev);
});