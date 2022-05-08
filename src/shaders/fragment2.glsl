// varying vec2 vUv;
// uniform float uTime;
// uniform sampler2D uTexture;

// void main() {
//   float time = uTime * 0.2;

//   vec2 uv = vUv;
//   uv.x += sin(uv.y) * 0.25;
//   vec2 repeat = vec2(3.0, 6.0);
//   uv = fract(uv * repeat + vec2(0.0, 0.8*time));
  
//   vec4 color = texture2D(uTexture, uv);
  
//   gl_FragColor = color;
// }


 varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform sampler2D uTexture;
  void main() {
    float time = uTime * 0.2;
    vec2 repeat = -vec2(12., 3.);
    vec2 uv = fract(vUv * repeat - vec2(time, 0.));
    vec3 texture = texture2D(uTexture, uv).rgb;
    // texture *= vec3(uv.x, uv.y, 0.);
    float fog = clamp(vPosition.z / 6., 1., 1.);
    vec3 fragColor = mix(vec3(0.0, 0.0, 0.0), texture, fog);
    gl_FragColor = vec4(fragColor, 1.);
  }