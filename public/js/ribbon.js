/* eslint-disable */
/**
 * 创建连接点
 * @param config
 */
const idRibbon = 'canvasRibbon'
function createRibbon() {
  !(function () {
    const t = document.getElementById('__next')
    const e = {
      z: n(t, 'zIndex', 0),
      a: n(t, 'alpha', 0.6),
      s: n(t, 'size', 90),
      c: t.getAttribute('data-click')
    }
    function n(t, e, n) {
      return Number(t.getAttribute(e)) || n
    }
    const i = document.createElement('canvas'),
      o = i.getContext('2d'),
      c = window.devicePixelRatio || 1,
      a = window.innerWidth,
      l = window.innerHeight,
      d = e.s
    i.id = '__next'
    let r, s
    const u = Math
    let h = 0
    const g = 2 * u.PI,
      f = u.cos,
      m = u.random
    function x() {
      for (
        o.clearRect(0, 0, a, l),
          r = [
            { x: 0, y: 0.7 * l + d },
            { x: 0, y: 0.7 * l - d }
          ];
        r[1].x < a + d;

      )
        y(r[0], r[1])
    }
    function y(t, e) {
      o.beginPath(), o.moveTo(t.x, t.y), o.lineTo(e.x, e.y)
      const n = e.x + (2 * m() - 0.25) * d,
        i = b(e.y)
      o.lineTo(n, i),
        o.closePath(),
        (h -= g / -50),
        (o.fillStyle =
          '#' +
          (
            ((127 * f(h) + 128) << 16) |
            ((127 * f(h + g / 3) + 128) << 8) |
            (127 * f(h + (g / 3) * 2) + 128)
          ).toString(16)),
        o.fill(),
        (r[0] = r[1]),
        (r[1] = { x: n, y: i })
    }
    function b(t) {
      return (s = t + (2 * m() - 1.1) * d), s > l || s < 0 ? b(t) : s
    }
    ;(i.width = a * c),
      (i.height = l * c),
      o.scale(c, c),
      (o.globalAlpha = e.a),
      (i.style.cssText =
        'opacity: ' +
        e.a +
        ';position:fixed;top:0;left:0;z-index: ' +
        e.z +
        ';width:100%;height:100%;pointer-events:none;'),
      document.getElementsByTagName('body')[0].appendChild(i),
      'false' !== e.c && ((document.onclick = x), (document.ontouchstart = x)),
      x()
  })()
}

function destroyRibbon() {
  const ribbon = document.getElementById(idRibbon)
  if (ribbon && ribbon.parentNode && ribbon.parentNode.contains(ribbon)) {
    ribbon.parentNode.removeChild(ribbon)
  }
}

window.createRibbon = createRibbon
window.destroyRibbon = destroyRibbon
