/* global Node */
export default class WindowServices {
  static getZIndexMax (zIndexDefualt = 2000) {
    let zIndex = WindowServices.zIndexRecursion(document.querySelector('body'), Number.NEGATIVE_INFINITY)

    if (zIndex >= zIndexDefualt) {
      if (zIndex < Number.POSITIVE_INFINITY) { zIndex++ } // To be one level higher that the highest element on a page
    } else {
      zIndex = zIndexDefualt
    }

    return zIndex
  }

  static zIndexRecursion (element, zIndexMax) {
    if (element) {
      let zIndexValues = [
        window.getComputedStyle(element).getPropertyValue('z-index'),
        element.style.getPropertyValue('z-index')
      ]
      for (const zIndex of zIndexValues) {
        if (zIndex && zIndex !== 'auto') {
          zIndexMax = Math.max(zIndexMax, zIndex)
        }
      }
      for (let node of element.childNodes) {
        let nodeType = node.nodeType
        if (nodeType === Node.ELEMENT_NODE || nodeType === Node.DOCUMENT_NODE || nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          zIndexMax = WindowServices.zIndexRecursion(node, zIndexMax)
        }
      }
    }
    return zIndexMax
  }

  static draggableSettings () {
    return {
      inertia: true,
      autoScroll: false,
      restrict: {
        restriction: document.body,
        elementRect: { top: 0.5, left: 0.5, bottom: 0.5, right: 0.5 }
      },
      ignoreFrom: 'input, textarea, a[href], select, option',
      onmove: WindowServices.dragMoveListener
    }
  }

  static dragMoveListener (event) {
    const target = event.target
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    target.style.webkitTransform = `translate(${x}px, ${y}px)`
    target.style.transform = `translate(${x}px, ${y}px)`

    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }
}
