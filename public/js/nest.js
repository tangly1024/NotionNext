/* eslint-disable */

/**
 * 创建连接点
 * @param config
 */

const idNest = '__nest'
function createNest() {
  const e = document.getElementById(idNest)
  if(!e) return
  function n(e, n, t) {
    return e.getAttribute(n) || t
  }
  function t() {
    ;(u = i.width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth),
      (d = i.height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight)
  }
  function o() {
    c.clearRect(0, 0, u, d)
    const e = [s].concat(x)
    let n, t, i, l, r, w
    x.forEach(function (o) {
      for (
        o.x += o.xa,
          o.y += o.ya,
          o.xa *= o.x > u || o.x < 0 ? -1 : 1,
          o.ya *= o.y > d || o.y < 0 ? -1 : 1,
          c.fillRect(o.x - 0.5, o.y - 0.5, 1, 1),
          t = 0;
        t < e.length;
        t++
      )
        (n = e[t]),
          o !== n &&
            null !== n.x &&
            null !== n.y &&
            ((l = o.x - n.x),
            (r = o.y - n.y),
            (w = l * l + r * r),
            w < n.max &&
              (n === s &&
                w >= n.max / 2 &&
                ((o.x -= 0.03 * l), (o.y -= 0.03 * r)),
              (i = (n.max - w) / n.max),
              c.beginPath(),
              (c.lineWidth = i / 2),
              (c.strokeStyle = 'rgba(' + a.c + ',' + (i + 0.2) + ')'),
              c.moveTo(o.x, o.y),
              c.lineTo(n.x, n.y),
              c.stroke()))
      e.splice(e.indexOf(o), 1)
    }),
      m(o)
  }
  var i = document.createElement('canvas')
  i.id = id
  var a = (function () {
      const t = e
      return {
        z: n(t, 'zIndex', 0),
        o: n(t, 'opacity', 0.7),
        c: n(t, 'color', '0,0,0'),
        n: n(t, 'count', 99)
      }
    })(),
    c = i.getContext('2d')
  let u, d
  var m =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (e) {
      window.setTimeout(e, 1e3 / 45)
    }
  const l = Math.random
  var r,
    s = { x: null, y: null, max: 2e4 }
  ;(i.style.cssText =
    'position:fixed;top:0;left:0;pointer-events:none;z-index:' + a.z + ';opacity:' + a.o),
    (r = 'body'), e.appendChild(i),
    t(),
    (window.onresize = t),
    (window.onmousemove = function (e) {
      ;(e = e || window.event), (s.x = e.clientX), (s.y = e.clientY)
    }),
    (window.onmouseout = function () {
      ;(s.x = null), (s.y = null)
    })
  for (var x = [], w = 0; a.n > w; w++) {
    const e = l() * u,
      n = l() * d,
      t = 2 * l() - 1,
      o = 2 * l() - 1
    x.push({ x: e, y: n, xa: t, ya: o, max: 6e3 })
  }
  setTimeout(function () {
    o()
  }, 100)
}

function destroyNest() {
  const nest = document.getElementById(idNest)
  if (nest && nest.parentNode && nest.parentNode.contains(nest)) {
    nest.parentNode.removeChild(nest)
  }
}

window.createNest = createNest
window.destroyNest = destroyNest