import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
// 引入three提供的字体
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/8.png');
// fonts
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
  const textBox = new TextGeometry('up or die!', {
    font: font,
    size: 0.5, // 字体大小，默认值为100。
    height: 0.2, // 挤出文本的厚度。默认值为50。
    curveSegments: 2, // （表示文本的）曲线上点的数量。默认值为12。
    bevelEnabled: true, // 是否开启斜角，默认为false。
    bevelThickness: 0.03, // 文本上斜角的深度，默认值为20。
    bevelSize: 0.02, // 斜角与原始文本轮廓之间的延伸距离。默认值为8。
    bevelOffset: 0,
    bevelSegments: 4 // 斜角的分段数。默认值为3。
  });
  // textBox.computeBoundingBox(); // 文字geometry的边界盒子
  // console.log(textBox.boundingBox);
  // textBox.translate(
  //   // 将他移到中心位置
  //   // 0.02 为 bevelSize
  //   -(textBox.boundingBox.max.x - 0.02) * 0.5,
  //   -(textBox.boundingBox.max.y - 0.02) * 0.5,
  //   // 0.03 为 bevelThickness
  //   -(textBox.boundingBox.max.z - 0.03) * 0.5
  // );

  textBox.center(); // three提供的快速居中的方法
  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture
  });
  // material.wireframe = true;
  const text = new THREE.Mesh(textBox, material);
  scene.add(text);

  console.time('donuts');
  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.3, 20, 45); // 创建基础geometry十分消耗gpu，所以不要放在循环中
  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    scene.add(donut);
  }
  console.timeEnd('donuts');
}); // 加载方式区别于纹理
/**
 * Object
 */
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());

// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
