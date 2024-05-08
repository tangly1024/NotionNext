// 这里编写自定义js脚本；将被静态引入到页面中
<!--live2d start-->
    <!-- Load TweenLite -->
    <script src="https://file.qwq.link/live2d/TweenLite.js"></script>

    <!-- Copyrighted cubism SDK -->
    <script src="https://file.qwq.link/live2d/live2dcubismcore.min.js"></script>
    <!-- Load Pixi (dependency for cubism 2/4 integrated loader) -->
    <script src="https://file.qwq.link/live2d/pixi.min.js"></script>
    <!-- Load cubism 4 integrated loader -->
    <script src="https://file.qwq.link/live2d/cubism4.min.js"></script>

    <!-- Load pio and alternative loader -->
    <link href="https://file.qwq.link/live2d/pio.css" rel="stylesheet"
          type="text/css"/>
    <script src="https://file.qwq.link/live2d/pio.js"></script>
    <script src="https://file.qwq.link/live2d/pio_sdk4.js"></script>
    <!-- 嘉然 -->
    <script src="https://file.qwq.link/live2d/model/Diana/load.js"></script>

    <!--live2d 夜间模式控件-->
    <script>
        function toggleNightMode() {
            if ( $('body').hasClass('dark')) {
                $('body').removeClass('dark');
            } else {
                $('body').addClass('dark');
            }
        }
    </script>
    <style>
        #pio {
            width: 14rem !important;
            height: 14rem !important;
        }

        #pio-container {
            width: auto !important;
            z-index: 999;
        }

        .pio-action {
            top: unset !important;
            transform: translateX(20px);
            overflow: hidden;
        }

        .pio-container .pio-dialog {
            top: -5em !important;
        }
    </style>
<!--live2d end-->
