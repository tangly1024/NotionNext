/* eslint-disable */

/**
 * 创建鼠标特效
 * @param options
 */
function createMouseCanvas() {
  // 创建一个类
  const _createClass = (function () {
    function n(t, e) {
      for (let i = 0; i < e.length; i++) {
        const n = e[i]
        ;(n.enumerable = n.enumerable || !1),
          (n.configurable = !0),
          'value' in n && (n.writable = !0),
          Object.defineProperty(t, n.key, n)
      }
    }
    return function (t, e, i) {
      return e && n(t.prototype, e), i && n(t, i), t
    }
  })()

  // 抛出一个类型错误（TypeError），指出类（或构造函数）不能被直接调用为函数，而应该使用 new 关键字来创建实例。
  function _classCallCheck(t, e) {
    if (!(t instanceof e))
      throw new TypeError('Cannot call a class as a function')
  }

  // 模拟 jquery 中的 offset 函数
  function getOffset(element) {
    const rect = element.getBoundingClientRect()
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    }
  }

  // 模拟 jquery 中的 extend 函数
  function deepExtend(out) {
    out = out || {}
    for (let i = 1; i < arguments.length; i++) {
      const obj = arguments[i]
      if (!obj) continue
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (
            typeof obj[key] === 'object' &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
          ) {
            // 如果属性值是对象但不是数组，递归合并
            out[key] = deepExtend(out[key], obj[key])
          } else {
            // 直接覆盖属性值
            out[key] = obj[key]
          }
        }
      }
    }
    return out
  }

  const e =
    (_createClass(t, [
      {
        key: 'init',
        value: function (t) {
          // 这一段代码的目的是确保浏览器支持 requestAnimationFrame 和 cancelAnimationFrame 这两个函数
          !(function () {
            for (
              var a = 0, t = ['webkit', 'moz'], e = 0;
              e < t.length && !window.requestAnimationFrame;
              ++e
            )
              (window.requestAnimationFrame =
                window[t[e] + 'RequestAnimationFrame']),
                (window.cancelAnimationFrame =
                  window[t[e] + 'CancelAnimationFrame'] ||
                  window[t[e] + 'CancelRequestAnimationFrame'])
            window.requestAnimationFrame ||
              (window.requestAnimationFrame = function (t, e) {
                const i = new Date().getTime()
                const n = Math.max(0, 16.7 - (i - a))
                const o = window.setTimeout(function () {
                  t(i + n)
                }, n)
                return (a = i + n), o
              }),
              window.cancelAnimationFrame ||
                (window.cancelAnimationFrame = function (t) {
                  clearTimeout(t)
                })
          })()

          // t 是要合并的对象
          if (t) {
            this.defaults = deepExtend(this.defaults, t)
          }

          // 创建一个新的 canvas 元素
          const canvas = document.createElement('canvas')

          // 设置 canvas 的 id 和样式
          canvas.id = 'vixcityCanvas'
          canvas.style.position = 'fixed'
          canvas.style.left = '0px'
          canvas.style.top = '0px'
          canvas.style.zIndex = '2147483647'
          canvas.style.pointerEvents = 'none'

          // 将 canvas 添加到 body 元素中
          document.body.appendChild(canvas)

          // 判断类型，并调用相应的绘画函数
          const i = this.defaults.type
          i >= 1 &&
            i < 11 &&
            this.mouseType1(this.defaults.type, this.defaults.color),
            i == 11 && this.mouseType2(),
            i == 12 && this.mouseType3()
        }
      },
      {
        key: 'mouseType1',
        value: function (type, color) {
          let n
          let o
          let a
          let h
          const canvasDom = document.getElementById('vixcityCanvas')
          // 获取 2D 渲染上下文
          const ctx = canvasDom.getContext('2d')
          const l = []
          const c = {
            n: 100,
            c: 222,
            bc: '#fff',
            r: 0.9,
            o: 0.05,
            a: 1,
            s: 20
          }
          let d = 0
          let f = 0
          let u = 0
          let y = 0
          let w = 0
          let p = 0
          let v = 0
          g()
          var getColor
          let x = 360 * Math.random()
          var getColor = color || 'hsl(' + x + ',100%,80%)'
          window.addEventListener('resize', function () {
            g()
          })
          function g() {
            ;(n = window.innerWidth),
              (o = window.innerHeight),
              (canvasDom.width = n),
              (canvasDom.height = o),
              (a = n / 2),
              (h = o / 2)
          }
          window.addEventListener('mousemove', function (t) {
            ;(a = t.pageX - getOffset(canvasDom).left),
              (h = t.pageY - getOffset(canvasDom).top),
              type == 4 &&
                (Math.random() <= 0.5
                  ? ((d = Math.random() <= 0.5 ? -10 : n + 10),
                    (f = Math.random() * o))
                  : ((f = Math.random() <= 0.5 ? -10 : o + 10),
                    (d = Math.random() * n)),
                (u = 8 * (Math.random() - 0.5)),
                (y = 8 * (Math.random() - 0.5))),
              type == 1 || type == 2 || type == 3
                ? l.push({ x: a, y: h, r: c.r, o: 1, v: 0 })
                : type == 4
                  ? l.push({
                      x: a,
                      y: h,
                      r: c.r,
                      o: 1,
                      v: 0,
                      wx: d,
                      wy: f,
                      vx2: u,
                      vy2: y
                    })
                  : type == 6 &&
                    l.push({
                      x: a + 30 * (Math.random() - 0.5),
                      y: h + 30 * (Math.random() - 0.5),
                      o: 1,
                      wx: a,
                      wy: h
                    })
          }),
            (function t() {
              if (type == 1) {
                ctx.clearRect(0, 0, n, o)
                for (var e = 0; e < l.length; e++)
                  (ctx.globalAlpha = l[e].o),
                    (ctx.fillStyle = getColor),
                    ctx.beginPath(),
                    ctx.arc(l[e].x, l[e].y, l[e].r, 0, 2 * Math.PI),
                    ctx.closePath(),
                    ctx.fill(),
                    (l[e].r += c.r),
                    (l[e].o -= c.o),
                    l[e].o <= 0 && (l.splice(e, 1), e--)
              } else if (type == 2)
                for (ctx.clearRect(0, 0, n, o), e = 0; e < l.length; e++)
                  (ctx.globalAlpha = l[e].o),
                    (ctx.fillStyle = getColor),
                    ctx.beginPath(),
                    (l[e].r = 10),
                    (ctx.shadowBlur = 20),
                    (ctx.shadowColor = getColor),
                    ctx.arc(l[e].x, l[e].y, l[e].r, 0, 2 * Math.PI),
                    ctx.closePath(),
                    ctx.fill(),
                    (ctx.shadowBlur = 0),
                    (l[e].o -= c.o),
                    (l[e].v += c.a),
                    (l[e].y += l[e].v),
                    (l[e].y >= o + l[e].r || l[e].o <= 0) &&
                      (l.splice(e, 1), e--)
              else if (type == 3)
                for (
                  w += 5, ctx.clearRect(0, 0, n, o), e = 0;
                  e < l.length;
                  e++
                )
                  (ctx.globalAlpha = l[e].o),
                    (ctx.fillStyle = getColor),
                    ctx.beginPath(),
                    (ctx.shadowBlur = 20),
                    (ctx.shadowColor = getColor),
                    (l[e].r = 20 * (1 - l[e].y / o)),
                    ctx.arc(l[e].x, l[e].y, l[e].r, 0, 2 * Math.PI),
                    ctx.closePath(),
                    ctx.fill(),
                    (ctx.shadowBlur = 0),
                    (l[e].o = l[e].y / o),
                    (l[e].v += c.a),
                    (l[e].y -= c.s),
                    (l[e].x += 10 * Math.cos((l[e].y + w) / 100)),
                    (l[e].y <= 0 - l[e].r || l[e].o <= 0) &&
                      (l.splice(e, 1), e--)
              else if (type == 4)
                for (ctx.clearRect(0, 0, n, o), e = 0; e < l.length; e++)
                  (ctx.globalAlpha = l[e].o),
                    (ctx.fillStyle = getColor),
                    ctx.beginPath(),
                    (ctx.shadowBlur = 20),
                    (ctx.shadowColor = getColor),
                    (l[e].vx2 += (a - l[e].wx) / 1e3),
                    (l[e].vy2 += (h - l[e].wy) / 1e3),
                    (l[e].wx += l[e].vx2),
                    (l[e].wy += l[e].vy2),
                    (l[e].o -= c.o / 2),
                    (l[e].r = 10),
                    ctx.arc(l[e].wx, l[e].wy, l[e].r, 0, 2 * Math.PI),
                    ctx.closePath(),
                    ctx.fill(),
                    (ctx.shadowBlur = 0),
                    l[e].o <= 0 && (l.splice(e, 1), e--)
              else if (type == 5)
                c.c || (m = 'hsl(' + (x += 0.1) + ',100%,80%)'),
                  ctx.clearRect(0, 0, n, o),
                  (p += 10),
                  (ctx.globalAlpha = 1),
                  (ctx.fillStyle = getColor),
                  (ctx.shadowBlur = 20),
                  (ctx.shadowColor = getColor),
                  ctx.beginPath(),
                  ctx.arc(
                    a + 50 * Math.cos((p * Math.PI) / 180),
                    h + 50 * Math.sin((p * Math.PI) / 180),
                    10,
                    0,
                    2 * Math.PI
                  ),
                  ctx.closePath(),
                  ctx.fill(),
                  ctx.beginPath(),
                  ctx.arc(
                    a + 50 * Math.cos(((p + 180) * Math.PI) / 180),
                    h + 50 * Math.sin(((p + 180) * Math.PI) / 180),
                    10,
                    0,
                    2 * Math.PI
                  ),
                  ctx.closePath(),
                  ctx.fill(),
                  ctx.beginPath(),
                  ctx.arc(
                    a + 50 * Math.cos(((p + 90) * Math.PI) / 180),
                    h + 50 * Math.sin(((p + 90) * Math.PI) / 180),
                    10,
                    0,
                    2 * Math.PI
                  ),
                  ctx.closePath(),
                  ctx.fill(),
                  ctx.beginPath(),
                  ctx.arc(
                    a + 50 * Math.cos(((p + 270) * Math.PI) / 180),
                    h + 50 * Math.sin(((p + 270) * Math.PI) / 180),
                    10,
                    0,
                    2 * Math.PI
                  ),
                  ctx.closePath(),
                  ctx.fill(),
                  (ctx.shadowBlur = 0)
              else if (type == 6)
                for (ctx.clearRect(0, 0, n, o), e = 0; e < l.length; e++)
                  (ctx.globalAlpha = l[e].o),
                    (ctx.strokeStyle = getColor),
                    ctx.beginPath(),
                    (ctx.lineWidth = 2),
                    ctx.moveTo(l[e].x, l[e].y),
                    ctx.lineTo(
                      (l[e].wx + l[e].x) / 2 + 20 * Math.random(),
                      (l[e].wy + l[e].y) / 2 + 20 * Math.random()
                    ),
                    ctx.lineTo(l[e].wx, l[e].wy),
                    ctx.closePath(),
                    ctx.stroke(),
                    (l[e].o -= c.o),
                    l[e].o <= 0 && (l.splice(e, 1), e--)
              else if (type == 7)
                for (
                  ctx.clearRect(0, 0, n, o),
                    l.length < 2 * c.n &&
                      ((v = 2 * Math.random() * Math.PI),
                      l.push({
                        x: a + 100 * (Math.random() - 0.5) * Math.cos(v),
                        y: h + 100 * (Math.random() - 0.5) * Math.cos(v),
                        o: 1,
                        h: v
                      })),
                    e = 0;
                  e < l.length;
                  e++
                )
                  (ctx.globalAlpha = l[e].o),
                    (ctx.fillStyle = getColor),
                    ctx.beginPath(),
                    (l[e].x += (a - l[e].x) / 10),
                    (l[e].y += (h - l[e].y) / 10),
                    ctx.arc(l[e].x, l[e].y, 1, 0, 2 * Math.PI),
                    ctx.closePath(),
                    ctx.fill(),
                    (l[e].o -= c.o),
                    l[e].o <= 0 &&
                      ((l[e].h = 2 * Math.random() * Math.PI),
                      (l[e].x =
                        a + 100 * (Math.random() - 0.5) * Math.cos(l[e].h)),
                      (l[e].y =
                        h + 100 * (Math.random() - 0.5) * Math.sin(l[e].h)),
                      (l[e].o = 1))
              else if (type == 8)
                for (
                  ctx.clearRect(0, 0, n, o),
                    ctx.fillStyle = getColor,
                    a % 4 == 0
                      ? (a += 1)
                      : a % 4 == 2
                        ? --a
                        : a % 4 == 3 && (a -= 2),
                    h % 4 == 0
                      ? (h += 1)
                      : h % 4 == 2
                        ? --h
                        : h % 4 == 3 && (h -= 2),
                    e = a - 60;
                  e < a + 60;
                  e += 4
                )
                  for (let i = h - 60; i < h + 60; i += 4)
                    Math.sqrt(Math.pow(a - e, 2) + Math.pow(h - i, 2)) <= 60 &&
                      ((ctx.globalAlpha =
                        1 -
                        Math.sqrt(Math.pow(a - e, 2) + Math.pow(h - i, 2)) /
                          60),
                      Math.random() < 0.2 && ctx.fillRect(e, i, 3, 3))
              else if (type == 9)
                for (
                  ctx.clearRect(0, 0, n, o),
                    ctx.fillStyle = getColor,
                    a % 4 == 0
                      ? (a += 1)
                      : a % 4 == 2
                        ? --a
                        : a % 4 == 3 && (a -= 2),
                    h % 4 == 0
                      ? (h += 1)
                      : h % 4 == 2
                        ? --h
                        : h % 4 == 3 && (h -= 2),
                    l.length < c.n &&
                      l.push({ x: a, y: h, xv: 0, yv: 0, o: 1 }),
                    e = 0;
                  e < l.length;
                  e++
                )
                  l[e].xv == 0 && l[e].yv == 0
                    ? Math.random() < 0.5
                      ? Math.random() < 0.5
                        ? (l[e].xv = 3)
                        : (l[e].xv = -3)
                      : Math.random() < 0.5
                        ? (l[e].yv = 3)
                        : (l[e].yv = -3)
                    : l[e].xv == 0
                      ? Math.random() < 0.66 &&
                        ((l[e].yv = 0),
                        Math.random() < 0.5 ? (l[e].xv = 3) : (l[e].xv = -3))
                      : l[e].yv == 0 &&
                        Math.random() < 0.66 &&
                        ((l[e].xv = 0),
                        Math.random() < 0.5 ? (l[e].yv = 3) : (l[e].yv = -3)),
                    (l[e].o -= c.o / 2),
                    (ctx.globalAlpha = l[e].o),
                    (l[e].x += l[e].xv),
                    (l[e].y += l[e].yv),
                    ctx.fillRect(l[e].x, l[e].y, 3, 3),
                    l[e].o <= 0 && (l.splice(e, 1), e--)
              else if (type == 10)
                for (
                  ctx.clearRect(0, 0, n, o),
                    ctx.fillStyle = getColor,
                    l.push({ x: a, y: h, xv: 2, yv: 1, o: 1 }),
                    e = 0;
                  e < l.length;
                  e++
                )
                  (l[e].o -= c.o / 10),
                    (ctx.globalAlpha = l[e].o),
                    (l[e].x += 4 * (Math.random() - 0.5)),
                    --l[e].y,
                    ctx.fillRect(l[e].x, l[e].y, 2, 2),
                    l[e].o <= 0 && (l.splice(e, 1), e--)
              window.requestAnimationFrame(t)
            })()
        }
      },
      {
        key: 'mouseType2',
        value: function () {
          let t
          let o
          let a
          let h = window.innerWidth
          let s = window.innerHeight
          const i = 70
          let r = 1
          const l = 1
          const c = 1.5
          const n = 25
          let d = 0.5 * h
          let f = 0.5 * s
          let u = !1
          function e(t) {
            ;(d = t.clientX - 0.5 * (window.innerWidth - h)),
              (f = t.clientY - 0.5 * (window.innerHeight - s))
          }
          function y(t) {
            u = !0
          }
          function w(t) {
            u = !1
          }
          function p(t) {
            t.touches.length == 1 &&
              (t.preventDefault(),
              (d = t.touches[0].pageX - 0.5 * (window.innerWidth - h)),
              (f = t.touches[0].pageY - 0.5 * (window.innerHeight - s)))
          }
          function v(t) {
            t.touches.length == 1 &&
              (t.preventDefault(),
              (d = t.touches[0].pageX - 0.5 * (window.innerWidth - h)),
              (f = t.touches[0].pageY - 0.5 * (window.innerHeight - s)))
          }
          function m() {
            ;(h = window.innerWidth),
              (s = window.innerHeight),
              (t.width = h),
              (t.height = s)
          }
          function x() {
            u ? (r += 0.02 * (c - r)) : (r -= 0.02 * (r - l)),
              (r = Math.min(r, c)),
              o.clearRect(0, 0, o.canvas.width, o.canvas.height)
            for (let t = 0, e = a.length; t < e; t++) {
              const i = a[t]
              const n = { x: i.position.x, y: i.position.y }
              ;(i.offset.x += i.speed),
                (i.offset.y += i.speed),
                (i.shift.x += (d - i.shift.x) * i.speed),
                (i.shift.y += (f - i.shift.y) * i.speed),
                (i.position.x =
                  i.shift.x + Math.cos(t + i.offset.x) * (i.orbit * r)),
                (i.position.y =
                  i.shift.y + Math.sin(t + i.offset.y) * (i.orbit * r)),
                (i.position.x = Math.max(Math.min(i.position.x, h), 0)),
                (i.position.y = Math.max(Math.min(i.position.y, s), 0)),
                (i.size += 0.01 * (i.targetSize - i.size)),
                Math.round(i.size) == Math.round(i.targetSize) &&
                  (i.targetSize = 1 + 2 * Math.random()),
                o.beginPath(),
                (o.fillStyle = i.fillColor),
                (o.strokeStyle = i.fillColor),
                (o.lineWidth = i.size),
                o.moveTo(n.x, n.y),
                o.lineTo(i.position.x, i.position.y),
                o.stroke(),
                o.arc(
                  i.position.x,
                  i.position.y,
                  i.size / 2,
                  0,
                  2 * Math.PI,
                  !0
                ),
                o.fill()
            }
            window.requestAnimationFrame(x)
          }
          ;(t = document.getElementById('vixcityCanvas')) &&
            t.getContext &&
            ((o = t.getContext('2d')),
            window.addEventListener('mousemove', e, !1),
            window.addEventListener('mousedown', y, !1),
            window.addEventListener('mouseup', w, !1),
            document.addEventListener('touchstart', p, !1),
            document.addEventListener('touchmove', v, !1),
            window.addEventListener('resize', m, !1),
            (function () {
              a = []
              for (let t = 0; t < n; t++) {
                const e = {
                  size: 1,
                  position: { x: d, y: f },
                  offset: { x: 0, y: 0 },
                  shift: { x: d, y: f },
                  speed: 0.01 + 0.04 * Math.random(),
                  targetSize: 1,
                  fillColor:
                    '#' +
                    ((9453632 * Math.random() + 11184810) | 0).toString(16),
                  orbit: 0.5 * i + 0.5 * i * Math.random()
                }
                a.push(e)
              }
            })(),
            m(),
            x())
        }
      },
      {
        key: 'mouseType3',
        value: function () {
          // 获取窗口的高度
          const windowHeight =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight

          // 创建一个新的 div 元素
          const vixcityDiv = document.createElement('div')

          // 设置 div 的 id 和样式
          vixcityDiv.id = 'vixcityDiv'
          vixcityDiv.style.position = 'fixed'
          vixcityDiv.style.width = '100%'
          vixcityDiv.style.height = windowHeight + 'px'
          vixcityDiv.style.left = '0px'
          vixcityDiv.style.top = '0px'
          vixcityDiv.style.zIndex = '2147483647'
          vixcityDiv.style.pointerEvents = 'none'

          // 将 div 添加到 body 元素中
          document.body.appendChild(vixcityDiv),
            new ((function () {
              function i(t) {
                return document.getElementById(t)
              }
              function t(t, e) {
                ;(this.config = e || {}),
                  (this.obj = i(t)),
                  (n = this.config.speed || 4),
                  (o = this.config.animR || 1),
                  (a = {
                    x: 0.5 * i(t).offsetWidth,
                    y: 0.5 * i(t).offsetHeight
                  }),
                  this.setXY(),
                  this.start()
              }
              let n
              let o
              let a
              const r = []
              let l = 0
              t.prototype = {
                setXY: function () {
                  let t, e
                  this.obj,
                    (t = 'mousemove'),
                    (e = function (t) {
                      ;(t = t || window.event),
                        (a.x = t.clientX),
                        (a.y = t.clientY)
                    }),
                    window.addEventListener
                      ? window.addEventListener(t, e, !1)
                      : window.attachEvent('on' + t, function () {
                          e.call(window)
                        })
                },
                start: function () {
                  Math.PI
                  let t
                  let e
                  const i = this.config.fn
                  r[l++] = t = new c(null, 0, 0)
                  for (let n = 0; n < 360; n += 20)
                    for (let o = t, a = 10; a < 35; a += 1) {
                      const h = i(n, a).x
                      const s = i(n, a).y
                      ;(r[l++] = e = new c(o, h, s)), (o = e)
                    }
                  setInterval(function () {
                    for (let t = 0; t < l; t++) r[t].run()
                  }, 16)
                }
              }
              var c = function (t, e, i) {
                const n = document.createElement('span')
                ;(this.css = n.style),
                  (this.css.backgroundColor = '#2D8CF0'),
                  (this.css.width = '2px'),
                  (this.css.height = '2px'),
                  (this.css.position = 'absolute'),
                  (this.css.left = '-1000px'),
                  (this.css.zIndex = 1e3 - l),
                  document.getElementById('vixcityDiv').appendChild(n),
                  (this.ddx = 0),
                  (this.ddy = 0),
                  (this.PX = 0),
                  (this.PY = 0),
                  (this.x = 0),
                  (this.y = 0),
                  (this.x0 = 0),
                  (this.y0 = 0),
                  (this.cx = e),
                  (this.cy = i),
                  (this.parent = t)
              }
              return (
                (c.prototype.run = function () {
                  this.parent
                    ? ((this.x0 = this.parent.x), (this.y0 = this.parent.y))
                    : ((this.x0 = a.x), (this.y0 = a.y)),
                    (this.x = this.PX +=
                      (this.ddx +=
                        (this.x0 - this.PX - this.ddx + this.cx) / o) / n),
                    (this.y = this.PY +=
                      (this.ddy +=
                        (this.y0 - this.PY - this.ddy + this.cy) / o) / n),
                    (this.css.left = Math.round(this.x) + 'px'),
                    (this.css.top = Math.round(this.y) + 'px')
                }),
                t
              )
            })())('vixcityDiv', {
              speed: 4,
              animR: 2,
              fn: function (t, e) {
                return {
                  x: (e / 4) * Math.cos(t),
                  y: (e / 4) * Math.sin(t)
                }
              }
            })
        }
      },
      {
        key: 'cnblogs',
        get: function () {
          return { canvase: '#vixcityCanvas' }
        }
      }
    ]),
    t)

  // 赋值 给一个默认值
  function t() {
    _classCallCheck(this, t),
      (this.defaults = { type: 1, color: !1 }),
      (this.version = '0.0.1')
  }

  return function drawGoodCanvas(options) {
    new e().init(options)
  }
}
window.createMouseCanvas = createMouseCanvas
