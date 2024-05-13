// 这里编写自定义js脚本；将被静态引入到页面中
//下面的内容是我新添加的：
class CreatePattern {
    constructor(el, x, y, config = {}) {
        this.root = el
        this.x = x
        this.y = y
        this.options = {
            type: 'aixin',
            quantity: 10,
            distanceMax: 100,
            distanceMin: 20,
            palette: ['f9f383', 'eb125f', '6eff8a', '66ffff'],
            ...config,
        }
        this.growUp()
    }

    giveBirthToAChild() {
        const initialStyles = document.createElement('i')
        const randomColor =
            this.options.palette[Math.floor(Math.random() * this.options.palette.length)]
        //必须写成个函数每次调用一次保证得到不同的值
        const randomTranslateValue = () =>
            (Math.random() < 0.5 ? -1 : 1) *
            (this.options.distanceMin +
                Math.random() * (this.options.distanceMax - this.options.distanceMin))

        this.root.append(initialStyles)
        initialStyles.classList.add(this.options.type)
        setTimeout(() => {
            initialStyles.style.cssText = `background-color:#${randomColor};
            left:${this.x}px;top:${this.y}px;
            z-index:999;
            transform: translate(${randomTranslateValue()}px,${randomTranslateValue()}px) scale(0)`
        }, 0)
        setTimeout(() => {
            initialStyles.remove()
        }, 700)
    }

    growUp() {
        for (let i = 0; i < this.options.quantity; i++) this.giveBirthToAChild()
    }
}

const el = document.createElement('div')

addEventListener('load', () => {
    document.body.append(el)

    document.addEventListener('click', function (e) {
        new CreatePattern(el, e.pageX, e.pageY)
    })
})
