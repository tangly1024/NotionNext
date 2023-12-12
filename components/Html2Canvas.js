import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'

/**
 * 网页截图海报功能
 * @param {*} props
 * @returns
 */

export default function Html2Canvas(props) {
  const { post } = props;
  const enable = siteConfig('POSTER_SCREENSHOT_ENABLE');
  const cdnUrl = siteConfig('POSTER_SCREENSHOT_HTML2CANVAS_CDN_URL');
  const [img, setImg] = useState('');
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showButton, setShowButton] = useState(false);
  const selectionRef = useRef(null);

  const onSelection = () => {
    const selection = document.getSelection();
    selectionRef.current = selection;

    if (selection && selection.toString().length > 0) {
      const rangeRect = selection.getRangeAt(0).getBoundingClientRect();
      setButtonPosition({
        x: rangeRect.x + window.pageXOffset,
        y: rangeRect.bottom + window.pageYOffset
      });
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  // 使用Lodash的debounce函数，延迟执行500毫秒
  const debouncedOnSelection = debounce(onSelection, 500);

  useEffect(() => {
    if (enable && post) {
      loadHtml2Canvas();

      document.addEventListener('selectionchange', debouncedOnSelection);
    }

    return () => document.removeEventListener('selectionchange', debouncedOnSelection);
  }, [debouncedOnSelection]);

  const captureScreenshot = () => {
    const html2canvas = window?.html2canvas;

    if (html2canvas && selectionRef.current) {
      const selectedText = selectionRef.current.toString();

      // Check if there is selected text
      if (selectedText.length > 0) {
        const canvas = document.createElement('canvas');
        const scale = 2; // You can adjust the scale as needed
        const context = canvas.getContext('2d');

        // Get bounding box of the selected text
        const rangeRect = selectionRef.current.getRangeAt(0).getBoundingClientRect();

        canvas.width = rangeRect.width * scale;
        canvas.height = rangeRect.height * scale;

        context.scale(scale, scale);

        // Offset the canvas to match the selected text position
        const offsetX = rangeRect.x - document.documentElement.scrollLeft;
        const offsetY = rangeRect.y - document.documentElement.scrollTop;
        context.translate(-offsetX, -offsetY);

        // Use html2canvas to capture the selected text
        html2canvas(document.body, {
          canvas: canvas,
          scale: scale,
          useCORS: true
        }).then((canvas) => {
          const dataURL = canvas.toDataURL('image/png');
          setImg(dataURL);

          // You can display the image in a modal or perform other actions here
          console.log('截图生成成功:', dataURL);
        });
      }
    }
  };

  const loadHtml2Canvas = async () => {
    console.log('初始化海报');
    await loadExternalResource(cdnUrl, 'js');
  };

  return (
        <div>
            {showButton && (
                <div className='w-screen flex justify-center py-2' style={{ position: 'absolute', left: buttonPosition.x, top: buttonPosition.y }}>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md cursor-pointer"
                        onClick={captureScreenshot}
                    >
                        截图分享
                    </button>
                </div>
            )}
            <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Screenshot" className="max-w-full" />
            </div>
        </div>
  );
}
