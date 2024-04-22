window.toggleFullScreen = toggleFullScreen
function toggleFullScreen() {
  var iframe = document.getElementById('myIframe')

  if (!document.fullscreenElement) {
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen()
    } else if (iframe.mozRequestFullScreen) {
      /* Firefox */
      iframe.mozRequestFullScreen()
    } else if (iframe.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      iframe.webkitRequestFullscreen()
    } else if (iframe.msRequestFullscreen) {
      /* IE/Edge */
      iframe.msRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen()
    }
  }
}
