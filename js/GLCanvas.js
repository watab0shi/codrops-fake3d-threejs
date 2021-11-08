import * as THREE from 'three'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import imageLady0 from '../img/lady.jpg';
import imageLady1 from '../img/lady-map.jpg';
import imageBall0 from '../img/ball.jpg';
import imageBall1 from '../img/ball-map.jpg';
import imageMount0 from '../img/mount.jpg';
import imageMount1 from '../img/mount-map.jpg';
import imageCanyon0 from '../img/canyon.jpg';
import imageCanyon1 from '../img/canyon-map.jpg';

const texLoader = new THREE.TextureLoader();

const loadTexture = (url) => {
  return new Promise((resolve, reject) => {
    texLoader.load(url, resolve, undefined, reject);
  });
}

/**
 * WebGLレンダラー作成
 * @param {number} width 
 * @param {number} height 
 * @param {number} dpr 
 * @returns {THREE.WebGLRenderer}
 */
const createRenderer = (width, height, dpr) => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  renderer.setPixelRatio(Math.min(dpr, 2))
  renderer.setSize(width, height)
  renderer.setClearColor(0x000000, 0.0)
  renderer.outputEncoding = THREE.sRGBEncoding
  return renderer
}

/**
 * WebGL Canvas
 */
class GLCanvas {
  /**
   * 
   * @param {Object} param 
   * @param {HTMLElement} param.containerElement 
   */
  constructor({ containerElement }) {
    this._containerElement = containerElement
    this._init()
  }

  /**
   * 初期化
   */
  async _init() {
    this._width = this._containerElement.clientWidth
    this._height = this._containerElement.clientHeight
    this._renderer = createRenderer(this._width, this._height, window.devicePixelRatio)
    this._canvas = this._renderer.domElement
    this._containerElement.appendChild(this._canvas)
    this._camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10)
    this._scene = new THREE.Scene()
    this._time = 0
    this._mouse = new THREE.Vector2(0.5, 0.5)
    this._imageURLArr = []
    switch (document.body.getAttribute('class')) {
      case 'demo-1':
        this._imageURLArr.push(imageLady0, imageLady1)
        break
      case 'demo-2':
        this._imageURLArr.push(imageBall0, imageBall1)
        break
      case 'demo-3':
        this._imageURLArr.push(imageMount0, imageMount1)
        break
      case 'demo-4':
        this._imageURLArr.push(imageCanyon0, imageCanyon1)
        break
    }

    this._textureArr = await Promise.all(this._imageURLArr.map(loadTexture))
    this._addObjects()
  }

  /**
   * シーンにオブジェクトを追加
   */
  _addObjects() {
    this._imageAspect = this._textureArr[0].image.naturalWidth / this._textureArr[0].image.naturalHeight
    const w = this._width
    const h = this._height
    const a1 = (h / w < this._imageAspect) ? 1 : (w / h) * this._imageAspect
    const a2 = (h / w < this._imageAspect) ? (h / w) * this._imageAspect : 1
    this._material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      uniforms: {
        time: { value: this.time },
        mouse: { value: new THREE.Vector2(0, 0) },
        resolution: { value: new THREE.Vector4(this._width, this._height, a1, a2) },
        uThreshold: { value: new THREE.Vector2(35, 15) },
        uTex0: { value: this._textureArr[0] },
        uTex1: { value: this._textureArr[1] },
      },
      transparent: true,
      vertexShader,
      fragmentShader,
    })
    this._geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
    this._plane = new THREE.Mesh(this._geometry, this._material)
    this._scene.add(this._plane)
    this._initialized = true
  }

  /**
   * レンダリング
   * @param {DOMHighResTimeStamp} time 
   */
  render(time) {
    if (!this._initialized) {
      return
    }
    this._time = time
    this._material.uniforms.time.value = this._time
    this._material.uniforms.mouse.value.lerp(this._mouse, 0.1)
    this._renderer.render(this._scene, this._camera)
  }

  /**
   * マウス位置更新
   * @param {number} x 
   * @param {number} y 
   */
  setMouse(x, y) {
    if (!this._initialized) {
      return
    }
    this._mouse.set(x, y);
  }

  /**
   * リサイズ
   */
  resize() {
    if (!this._initialized) {
      return
    }
    this._width = this._containerElement.clientWidth
    this._height = this._containerElement.clientHeight
    const w = this._width
    const h = this._height
    const a1 = (h / w < this._imageAspect) ? 1 : (w / h) * this._imageAspect
    const a2 = (h / w < this._imageAspect) ? (h / w) * this._imageAspect : 1
    this._material.uniforms.resolution.value.set(this._width, this._height, a1, a2)
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this._renderer.setSize(this._width, this._height)
    this._camera.aspect = this._width / this._height
    this._camera.updateProjectionMatrix()
  }
}

export {
  GLCanvas,
}