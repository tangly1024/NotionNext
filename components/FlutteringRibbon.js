/* eslint-disable */
import { useEffect } from 'react'
const  id = 'canvasFlutteringRibbon'
export const FlutteringRibbon = () => {
     const destroyRibbon = ()=>{
    const ribbon = document.getElementById(id)
      if(ribbon && ribbon.parentNode){
        ribbon.parentNode.removeChild(ribbon)
      }
  }
  
  useEffect(() => {
    createFlutteringRibbon()
        return () => destroyRibbon()

  }, [])
    return <></>
}

export default FlutteringRibbon


/**
 * 创建连接点
 * @param config
 */
function createFlutteringRibbon() {
  'object' == typeof window &&
    (window.Ribbons = (function () {
      const t = window,
        i = document.body,
        n = document.documentElement
      var o = function () {
        if (1 === arguments.length) {
          if (Array.isArray(arguments[0])) {
            const t = Math.round(o(0, arguments[0].length - 1))
            return arguments[0][t]
          }
          return o(0, arguments[0])
        }
        return 2 === arguments.length
          ? Math.random() * (arguments[1] - arguments[0]) + arguments[0]
          : 0
      }
      const s = function (o) {
          const s = Math.max(
              0,
              t.innerWidth || n.clientWidth || i.clientWidth || 0
            ),
            e = Math.max(
              0,
              t.innerHeight || n.clientHeight || i.clientHeight || 0
            )
          return {
            width: s,
            height: e,
            ratio: s / e,
            centerx: s / 2,
            centery: e / 2,
            scrollx:
              Math.max(0, t.pageXOffset || n.scrollLeft || i.scrollLeft || 0) -
              (n.clientLeft || 0),
            scrolly:
              Math.max(0, t.pageYOffset || n.scrollTop || i.scrollTop || 0) -
              (n.clientTop || 0)
          }
        },
        e = function (t, i) {
          ;(this.x = 0), (this.y = 0), this.set(t, i)
        }
      e.prototype = {
        constructor: e,
        set: function (t, i) {
          ;(this.x = t || 0), (this.y = i || 0)
        },
        copy: function (t) {
          return (this.x = t.x || 0), (this.y = t.y || 0), this
        },
        multiply: function (t, i) {
          return (this.x *= t || 1), (this.y *= i || 1), this
        },
        divide: function (t, i) {
          return (this.x /= t || 1), (this.y /= i || 1), this
        },
        add: function (t, i) {
          return (this.x += t || 0), (this.y += i || 0), this
        },
        subtract: function (t, i) {
          return (this.x -= t || 0), (this.y -= i || 0), this
        },
        clampX: function (t, i) {
          return (this.x = Math.max(t, Math.min(this.x, i))), this
        },
        clampY: function (t, i) {
          return (this.y = Math.max(t, Math.min(this.y, i))), this
        },
        flipX: function () {
          return (this.x *= -1), this
        },
        flipY: function () {
          return (this.y *= -1), this
        }
      }
      const h = function (t) {
        ;(this._canvas = null),
          (this._context = null),
          (this._sto = null),
          (this._width = 0),
          (this._height = 0),
          (this._scroll = 0),
          (this._ribbons = []),
          (this._options = {
            colorSaturation: '80%',
            colorBrightness: '60%',
            colorAlpha: 0.65,
            colorCycleSpeed: 6,
            verticalPosition: 'center',
            horizontalSpeed: 150,
            ribbonCount: 5,
            strokeSize: 5,
            parallaxAmount: -0.5,
            animateSections: !0
          }),
          (this._onDraw = this._onDraw.bind(this)),
          (this._onResize = this._onResize.bind(this)),
          (this._onScroll = this._onScroll.bind(this)),
          this.setOptions(t),
          this.init()
      }
      return (
        (h.prototype = {
          constructor: h,
          setOptions: function (t) {
            if ('object' == typeof t)
              for (const i in t)
                t.hasOwnProperty(i) && (this._options[i] = t[i])
          },
          init: function () {
            try {
              ;(this._canvas = document.createElement('canvas')),
                (this._canvas.id = id),
                (this._canvas.style.display = 'block'),
                (this._canvas.style.position = 'fixed'),
                (this._canvas.style.margin = '0'),
                (this._canvas.style.padding = '0'),
                (this._canvas.style.border = '0'),
                (this._canvas.style.outline = '0'),
                (this._canvas.style.left = '0'),
                (this._canvas.style.top = '0'),
                (this._canvas.style.width = '100%'),
                (this._canvas.style.height = '100%'),
                (this._canvas.style['z-index'] = '0'),
                (this._canvas.style['pointer-events'] = 'none'),
                this._onResize(),
                (this._context = this._canvas.getContext('2d')),
                this._context.clearRect(0, 0, this._width, this._height),
                (this._context.globalAlpha = this._options.colorAlpha),
                window.addEventListener('resize', this._onResize),
                window.addEventListener('scroll', this._onScroll),
                document.body.appendChild(this._canvas)
            } catch (t) {
              return void console.warn('Canvas Context Error: ' + t.toString())
            }
            this._onDraw()
          },
          addRibbon: function () {
            const t = Math.round(o(1, 9)) > 5 ? 'right' : 'left'
            let i = 1e3
            const n = 200,
              s = 0 - n,
              h = this._width + n
            let a = 0,
              r = 0
            const l = 'right' === t ? s : h
            let c = Math.round(o(0, this._height))
            ;/^(top|min)$/i.test(this._options.verticalPosition)
              ? (c = 0 + n)
              : /^(middle|center)$/i.test(this._options.verticalPosition)
              ? (c = this._height / 2)
              : /^(bottom|max)$/i.test(this._options.verticalPosition) &&
                (c = this._height - n)
            const p = [],
              _ = new e(l, c),
              d = new e(l, c)
            let u = null,
              b = Math.round(o(0, 360)),
              f = 0
            for (; !(i <= 0); ) {
              if (
                (i--,
                (a = Math.round(
                  (1 * Math.random() - 0.2) * this._options.horizontalSpeed
                )),
                (r = Math.round(
                  (1 * Math.random() - 0.5) * (0.25 * this._height)
                )),
                (u = new e()),
                u.copy(d),
                'right' === t)
              ) {
                if ((u.add(a, r), d.x >= h)) break
              } else if ('left' === t && (u.subtract(a, r), d.x <= s)) break
              p.push({
                point1: new e(_.x, _.y),
                point2: new e(d.x, d.y),
                point3: u,
                color: b,
                delay: f,
                dir: t,
                alpha: 0,
                phase: 0
              }),
                _.copy(d),
                d.copy(u),
                (f += 4),
                (b += this._options.colorCycleSpeed)
            }
            this._ribbons.push(p)
          },
          _drawRibbonSection: function (t) {
            if (t) {
              if (t.phase >= 1 && t.alpha <= 0) return !0
              if (t.delay <= 0) {
                if (
                  ((t.phase += 0.02),
                  (t.alpha = 1 * Math.sin(t.phase)),
                  (t.alpha = t.alpha <= 0 ? 0 : t.alpha),
                  (t.alpha = t.alpha >= 1 ? 1 : t.alpha),
                  this._options.animateSections)
                ) {
                  const i = 0.1 * Math.sin(1 + (t.phase * Math.PI) / 2)
                  'right' === t.dir
                    ? (t.point1.add(i, 0),
                      t.point2.add(i, 0),
                      t.point3.add(i, 0))
                    : (t.point1.subtract(i, 0),
                      t.point2.subtract(i, 0),
                      t.point3.subtract(i, 0)),
                    t.point1.add(0, i),
                    t.point2.add(0, i),
                    t.point3.add(0, i)
                }
              } else t.delay -= 0.5
              const i = this._options.colorSaturation,
                n = this._options.colorBrightness,
                o =
                  'hsla(' +
                  t.color +
                  ', ' +
                  i +
                  ', ' +
                  n +
                  ', ' +
                  t.alpha +
                  ' )'
              this._context.save(),
                0 !== this._options.parallaxAmount &&
                  this._context.translate(
                    0,
                    this._scroll * this._options.parallaxAmount
                  ),
                this._context.beginPath(),
                this._context.moveTo(t.point1.x, t.point1.y),
                this._context.lineTo(t.point2.x, t.point2.y),
                this._context.lineTo(t.point3.x, t.point3.y),
                (this._context.fillStyle = o),
                this._context.fill(),
                this._options.strokeSize > 0 &&
                  ((this._context.lineWidth = this._options.strokeSize),
                  (this._context.strokeStyle = o),
                  (this._context.lineCap = 'round'),
                  this._context.stroke()),
                this._context.restore()
            }
            return !1
          },
          _onDraw: function () {
            for (let t = 0, i = this._ribbons.length; t < i; ++t)
              this._ribbons[t] || this._ribbons.splice(t, 1)
            this._context.clearRect(0, 0, this._width, this._height)
            for (let t = 0; t < this._ribbons.length; ++t) {
              const i = this._ribbons[t],
                n = i.length
              let o = 0
              for (let t = 0; t < n; ++t) this._drawRibbonSection(i[t]) && o++
              o >= n && (this._ribbons[t] = null)
            }
            this._ribbons.length < this._options.ribbonCount &&
              this.addRibbon(),
              requestAnimationFrame(this._onDraw)
          },
          _onResize: function (t) {
            const i = s(t)
            ;(this._width = i.width),
              (this._height = i.height),
              this._canvas &&
                ((this._canvas.width = this._width),
                (this._canvas.height = this._height),
                this._context &&
                  (this._context.globalAlpha = this._options.colorAlpha))
          },
          _onScroll: function (t) {
            const i = s(t)
            this._scroll = i.scrolly
          }
        }),
        h
      )
    })())
  new Ribbons({
    colorSaturation: '60%',
    colorBrightness: '50%',
    colorAlpha: 0.5,
    colorCycleSpeed: 5,
    verticalPosition: 'random',
    horizontalSpeed: 200,
    ribbonCount: 3,
    strokeSize: 0,
    parallaxAmount: -0.2,
    animateSections: !0
  })
}
