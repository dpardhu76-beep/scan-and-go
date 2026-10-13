import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely neutralize html5-qrcode's RenderedCameraImpl onabort throwing bug and media interruptions
if (typeof window !== 'undefined') {
  // 1. Intercept window error events for RenderedCameraImpl onabort()
  window.addEventListener('error', (event) => {
    const errorMsg = String(event.message || event.error || '');
    if (errorMsg.includes('RenderedCameraImpl') || errorMsg.includes('onabort() called')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return true;
    }
  });

  const prevOnError = window.onerror;
  window.onerror = function (msg, url, line, col, error) {
    const errorMsg = String(msg || error || '');
    if (errorMsg.includes('RenderedCameraImpl') || errorMsg.includes('onabort() called')) {
      return true;
    }
    if (typeof prevOnError === 'function') {
      return prevOnError.call(this, msg, url, line, col, error);
    }
    return false;
  };

  // 2. Intercept unhandledrejection for media play() interruption on unmount
  window.addEventListener('unhandledrejection', (event) => {
    const errorText = String(event.reason?.message || event.reason || '');
    if (
      event.reason?.name === 'AbortError' ||
      errorText.includes('The play() request was interrupted') ||
      errorText.includes('media was removed from the document') ||
      errorText.includes('RenderedCameraImpl') ||
      errorText.includes('onabort() called')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  // 3. Patch HTMLMediaElement.prototype.onabort to catch the thrown string from html5-qrcode
  try {
    const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'onabort');
    if (desc && desc.set) {
      const originalSet = desc.set;
      Object.defineProperty(HTMLMediaElement.prototype, 'onabort', {
        set(fn) {
          if (typeof fn === 'function') {
            const safeFn = function (this: HTMLMediaElement, ev: Event) {
              try {
                return fn.call(this, ev);
              } catch (err) {
                if (String(err).includes('RenderedCameraImpl')) {
                  // Safely absorb the html5-qrcode abort throw
                  return;
                }
                throw err;
              }
            };
            originalSet.call(this, safeFn);
          } else {
            originalSet.call(this, fn);
          }
        },
        get: desc.get,
        configurable: true,
      });
    }
  } catch {
    // Ignore prototype patch if restricted
  }
}

createRoot(document.getElementById('root')!).render(<App />);
