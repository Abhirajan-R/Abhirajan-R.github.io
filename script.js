import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const body = document.body;
const toggle = document.getElementById("themeToggle");
const icon = toggle.querySelector(".toggle-icon");
const label = toggle.querySelector(".toggle-label");

function setTheme(light) {
  body.classList.toggle("light", light);
  icon.textContent = light ? "☀" : "☾";
  label.textContent = light ? "Dark" : "Light";
  localStorage.setItem("portfolio-theme", light ? "light" : "dark");
}
setTheme(localStorage.getItem("portfolio-theme") === "light");
toggle.addEventListener("click", () => setTheme(!body.classList.contains("light")));

const canvas = document.getElementById("robotCanvas");
const stage = document.getElementById("robotStage");

if (canvas && stage) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0d, 0.055);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(4.7, 3.1, 7.4);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.rotateSpeed = 0.7;
  controls.zoomSpeed = 0.65;
  controls.panSpeed = 0.3;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 10;
  controls.minPolarAngle = Math.PI * 0.30;
  controls.maxPolarAngle = Math.PI * 0.70;
  controls.target.set(0, 1.1, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;

  const accent = new THREE.Color(0xbba6ff);
  const metal = new THREE.MeshStandardMaterial({
    color: 0xbdbbc4, metalness: 0.85, roughness: 0.27
  });
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x222228, metalness: 0.9, roughness: 0.25
  });
  const violetMetal = new THREE.MeshStandardMaterial({
    color: 0x6e5a9f, metalness: 0.75, roughness: 0.25
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: accent, emissive: accent, emissiveIntensity: 2.5,
    metalness: 0.2, roughness: 0.2
  });
  const blackMat = new THREE.MeshStandardMaterial({
    color: 0x09090c, metalness: 0.6, roughness: 0.25
  });

  const robot = new THREE.Group();
  scene.add(robot);
  robot.position.y = -1.25;

  function box(w,h,d,mat,x,y,z,rx=0,ry=0,rz=0) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d,3,3,3), mat);
    m.position.set(x,y,z); m.rotation.set(rx,ry,rz);
    m.castShadow = true; m.receiveShadow = true;
    robot.add(m); return m;
  }
  function cyl(r,depth,mat,x,y,z,rx=0,ry=0,rz=0,segments=32) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r,r,depth,segments),mat);
    m.position.set(x,y,z); m.rotation.set(rx,ry,rz);
    m.castShadow = true; m.receiveShadow = true;
    robot.add(m); return m;
  }
  function sphere(r,mat,x,y,z) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r,32,20),mat);
    m.position.set(x,y,z); m.castShadow = true; robot.add(m); return m;
  }

  // Body
  box(2.25, 2.45, 1.35, metal, 0, 1.55, 0, 0, 0, 0);
  box(1.75, 1.0, 1.48, darkMetal, 0, 1.62, 0.02);
  box(0.95, 0.72, 0.10, blackMat, 0, 1.95, 0.76);
  box(0.50, 0.055, 0.055, glowMat, 0, 1.98, 0.82);
  box(0.32, 0.055, 0.055, glowMat, 0, 1.82, 0.82);

  // Head and neck
  cyl(0.42, 0.36, darkMetal, 0, 2.78, 0, Math.PI/2, 0, 0);
  box(1.75, 1.30, 1.30, metal, 0, 3.48, 0);
  box(1.12, 0.38, 0.10, blackMat, 0, 3.52, 0.68);
  box(0.22, 0.12, 0.055, glowMat, -0.30, 3.52, 0.75);
  box(0.22, 0.12, 0.055, glowMat, 0.30, 3.52, 0.75);
  cyl(0.045, 0.45, darkMetal, 0, 4.28, 0, 0, 0);
  sphere(0.10, glowMat, 0, 4.53, 0);

  // Shoulders, arms and grippers
  for (const s of [-1,1]) {
    const x = s * 1.48;
    sphere(0.31, violetMetal, x, 2.30, 0);
    box(0.48, 1.45, 0.55, metal, x, 1.45, 0, 0, 0, s * 0.06);
    sphere(0.30, darkMetal, x, 0.70, 0);
    box(0.55, 0.70, 0.60, metal, x, 0.18, 0);
    box(0.18, 0.48, 0.20, darkMetal, x - s*0.22, -0.28, 0);
    box(0.18, 0.48, 0.20, darkMetal, x + s*0.22, -0.28, 0);
  }

  // Wheels
  for (const x of [-1.05, 1.05]) {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68,0.68,0.42,40),
      darkMetal
    );
    wheel.rotation.z = Math.PI/2;
    wheel.position.set(x,-0.35,0);
    wheel.castShadow = true;
    robot.add(wheel);
    cyl(0.43, 0.44, violetMetal, x, -0.35, 0, Math.PI/2, 0, 0);
    cyl(0.15, 0.47, glowMat, x, -0.35, 0, Math.PI/2, 0, 0, 24);
  }

  // Small antenna fins
  box(0.12,0.55,0.08,violetMetal,-0.62,4.22,0,0,0,-0.15);
  box(0.12,0.55,0.08,violetMetal,0.62,4.22,0,0,0,0.15);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(4.2, 96),
    new THREE.MeshBasicMaterial({
      color: 0x8065c9, transparent: true, opacity: 0.07,
      side: THREE.DoubleSide
    })
  );
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -1.05;
  scene.add(ground);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(2.3,2.32,96),
    new THREE.MeshBasicMaterial({color:0xbba6ff, transparent:true, opacity:.32, side:THREE.DoubleSide})
  );
  ring.rotation.x = -Math.PI/2;
  ring.position.y = -1.02;
  scene.add(ring);

  // Lighting
  scene.add(new THREE.HemisphereLight(0xffffff, 0x302846, 2.0));
  const key = new THREE.DirectionalLight(0xffffff, 4.2);
  key.position.set(4,7,6); key.castShadow = true; scene.add(key);
  const rim = new THREE.PointLight(0xbba6ff, 18, 10);
  rim.position.set(-4,3,3); scene.add(rim);
  const fill = new THREE.PointLight(0x7e72a7, 10, 9);
  fill.position.set(4,1,-4); scene.add(fill);

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // Smoothly resume auto-rotation after interaction.
  let resumeTimer;
  controls.addEventListener("start", () => {
    controls.autoRotate = false;
    clearTimeout(resumeTimer);
  });
  controls.addEventListener("end", () => {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => controls.autoRotate = true, 1600);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    robot.position.y = -1.25 + Math.sin(t * 1.35) * 0.045;
    ring.rotation.z = t * 0.16;
    controls.update();
    renderer.render(scene,camera);
  }
  animate();
}

// Reveal animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.animate(
        [{opacity:0, transform:"translateY(24px)"},{opacity:1, transform:"translateY(0)"}],
        {duration:700, easing:"cubic-bezier(.2,.7,.2,1)", fill:"forwards"}
      );
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.12});
document.querySelectorAll(".section, .project-card, .timeline-item, .credential").forEach(el => observer.observe(el));
