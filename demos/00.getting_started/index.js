import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// 场景
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, specular: 0xffffff, shininess: 30 });

const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, -20);

// 随机创建大量的模型,测试渲染性能
// const num = 10000;
// for (let i = 0; i < num; i++) {
//   const geometry = new THREE.BoxGeometry(5, 5, 5);
//   const material = new THREE.MeshLambertMaterial({
//     color: 0x00ffff,
//   });
//   const mesh = new THREE.Mesh(geometry, material);
//   // 随机生成长方体xyz坐标
//   const x = (Math.random() - 0.5) * 200;
//   const y = (Math.random() - 0.5) * 200;
//   const z = (Math.random() - 0.5) * 200;
//   mesh.position.set(x, y, z);
//   scene.add(mesh); // 模型对象插入场景中
// }

// 辅助坐标系
// const axesHelper = new THREE.AxesHelper(20);
// scene.add(axesHelper);

// 光源
const light1 = new THREE.PointLight(0xffffff, 20);
light1.position.set(10, 10, 10);
// light1.target = mesh;
const light2 = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light1);
scene.add(light2);

const dirLightHelper = new THREE.PointLightHelper(light1, 2, 0x00ff00);
scene.add(dirLightHelper);
scene.add(mesh);

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// 相机
const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
camera.position.set(20, 20, 20);

camera.lookAt(mesh.position);

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffcd);
renderer.setSize(WIDTH, HEIGHT);

// 添加到页面
document.body.appendChild(renderer.domElement);

// 控件
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => {
  console.log(camera.position, camera.rotation);
});

// 响应窗口变化
window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// 性能监控
const stats = new Stats();
document.body.appendChild(stats.dom);

// GUI 可视化调试
const gui = new GUI();
const meshFolder = gui.addFolder('MESH');
meshFolder.close();
const lightFolder = gui.addFolder('LIGHT');
meshFolder.add(mesh.position, 'x', -100, 100).onChange(function (value) {
  mesh.rotateY(value * 0.01);
});
meshFolder.add(mesh.position, 'y', -100, 100);
meshFolder.add(mesh.position, 'z', -100, 100);
meshFolder
  .addColor(mesh.material, 'color')
  .onChange(function (value) {
    mesh.material.color.set(value);
  })
  .name('模型颜色');

lightFolder.add(light1, 'intensity', 0, 100).name('点光源强度').step(5);

function render() {
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
