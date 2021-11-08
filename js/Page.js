import { GLCanvas } from './GLCanvas';

class Page {
  /**
   * @param {Object} param 
   * @param {HTMLElement} param.element 
   */
  constructor({ element }) {
    this._element = element;
    this._canvas = new GLCanvas({
      containerElement: this._element.querySelector('#gl')
    });
    this._requestID = null

    this._boundOnAnimationFrame = this._onAnimationFrame.bind(this)
    this._boundOnMouseMove = this._onMouseMove.bind(this)
    this._boundOnResize = this._onResize.bind(this)

    this._addEventListeners()
    this._onAnimationFrame(performance.now())
  }

  /**
   * イベントリスナー登録
   */
  _addEventListeners() {
    window.addEventListener('mousemove', this._boundOnMouseMove)
    window.addEventListener('resize', this._boundOnResize)
  }

  /**
   * イベントリスナー登録削除
   */
  _removeEventListeners(){
    if (this._requestID !== null) {
      window.cancelAnimationFrame(this._requestID)
    }
    window.removeEventListener('mousemove', this._boundOnMouseMove)
    window.removeEventListener('resize', this._boundOnResize)
  }

  /**
   * RAFループ
   * @param {DOMHighResTimeStamp} time 
   */
  _onAnimationFrame(time) {
    const sec = time / 1000
    this._canvas.render(sec)
    this._requestID = window.requestAnimationFrame(this._boundOnAnimationFrame)
  }

  /**
   * マウス移動時
   */
  _onMouseMove({ clientX, clientY }) {
    const x = clientX / window.innerWidth
    const y = 1 - (clientY / window.innerHeight)
    this._canvas.setMouse(x, y)
  }

  /**
   * リサイズ時
   */
  _onResize() {
    this._canvas.resize()
  }

  /**
   * 削除
   */
  destroy() {
    this._removeEventListeners()
  }
}

export {
  Page,
}
