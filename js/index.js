import 'regenerator-runtime/runtime';
import { Page } from './Page';

/**
 * 初期化
 */
const init = () => {
  new Page({
    element: document.querySelector('main')
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
