uniform float time;
uniform vec2 mouse;
uniform vec4 resolution;
uniform vec2 uThreshold;
uniform vec2 uTexSize;
uniform sampler2D uTex0;
uniform sampler2D uTex1;

vec2 mirrored(vec2 v) {
  vec2 m = mod(v, 2.0);
  return mix(m, 2.0 - m, step(1.0, m));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 vUv = (uv - 0.5) * resolution.zw + 0.5;

  vec4 tex1 = texture2D(uTex1, mirrored(vUv));// distortion map
  vec2 fake3d = vUv + mouse * (tex1.r - 0.5) / uThreshold;// distorted uv
  vec4 tex0 = texture2D(uTex0, mirrored(fake3d));
  gl_FragColor = tex0;
}