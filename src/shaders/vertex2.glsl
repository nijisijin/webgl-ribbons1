// varying vec2 vUv;
// uniform float uTime;

// void main() {
//   vUv = uv;

//   float time = uTime * 1.0;

//   vec3 transformed = position;
//   transformed.z += sin(position.x + time);

//   gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 3.0);
// }

varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
