import React, { useState, useEffect } from 'react'
import { Map } from 'react-amap'
import BLOG from '@/blog.config'

const AMapComponent = ({ onLocationChange }) => {
  const [loading, setLoading] = useState(true)
  const [mapInstance, setMapInstance] = useState(null)
  const [location, setLocation] = useState({
    coords: [118.7969, 32.0603],
    zoom: 11
  })

  // 使用浏览器定位
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            // 使用高德地图 API 反向地理编码获取详细地址
            const response = await fetch(
              `https://restapi.amap.com/v3/geocode/regeo?key=${BLOG.AMAP_KEY}&location=${longitude},${latitude}&extensions=base`
            )
            const data = await response.json()

            if (data.status === '1' && data.regeocode) {
              const addressComponent = data.regeocode.addressComponent
              const newLocation = {
                coords: [longitude, latitude],
                province: addressComponent.province,
                city: addressComponent.city,
                district: addressComponent.district,
                formatted_address: data.regeocode.formatted_address
              }

              setLocation(prev => ({ ...prev, coords: newLocation.coords }))
              onLocationChange && onLocationChange(newLocation)

              // 如果地图实例已存在，更新地图视图
              if (mapInstance) {
                createMarker(mapInstance, newLocation.coords)
                mapInstance.setStatus({
                  animateEnable: true,
                  dragEnable: true
                })
                mapInstance.flyTo({
                  zoom: 17,
                  center: newLocation.coords,
                  pitch: 60,
                  rotation: 45,
                  duration: 1800,
                  easing: 'Cubic-InOut'
                })
              }
            }
          } catch (error) {
            console.error('获取地址信息失败:', error)
          }
        },
        (error) => {
          console.error('浏览器定位失败:', error)
          // 定位失败时使用高德地图定位作为备选
          if (mapInstance) {
            mapInstance.plugin('AMap.Geolocation', () => {
              const geolocation = new window.AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 5000,
                zoomToAccuracy: true
              })

              mapInstance.addControl(geolocation)
              geolocation.getCurrentPosition()
            })
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      console.log('浏览器不支持定位')
    }
  }, [mapInstance])

  // 地图配置 - 使用彩色主题
  const mapConfig = {
    version: '2.0',
    zoom: location.zoom,
    center: location.coords,
    mapStyle: 'amap://styles/fresh', // 使用清新蓝风格
    pitch: 50,
    viewMode: '3D',
    features: ['bg', 'road', 'building', 'point'],
    buildingAnimation: true,
    showBuildingBlock: true,
    showLabel: true,
    expandZoomRange: true,
    zooms: [3, 20],
    defaultCursor: 'grab',
    jogEnable: true,
    animateEnable: true,
    rotateEnable: true
  }

  // 创建彩色标记
  const createMarker = (map, position) => {
    if (!map) return

    const div = document.createElement('div')
    div.className = 'custom-marker'
    div.innerHTML = `
      <div class="marker-container">
        <div class="pulse-ring"></div>
        <div class="pulse-ring delay-1"></div>
        <div class="pulse-ring delay-2"></div>
        <div class="marker-core">
          <div class="marker-dot"></div>
        </div>
      </div>
    `

    const marker = new window.AMap.Marker({
      position: position,
      content: div,
      anchor: 'center',
      offset: new window.AMap.Pixel(0, 0),
      zIndex: 100
    })

    map.add(marker)
    return marker
  }

  // 地图事件处理
  const events = {
    created: (map) => {
      console.log('地图创建成功')
      setMapInstance(map)
      setLoading(false)

      // 添加控件
      map.plugin(['AMap.ControlBar', 'AMap.ToolBar'], () => {
        // 3D 控制控件
        const controlBar = new window.AMap.ControlBar({
          position: { right: '40px', top: '40px' },
          showZoomBar: true,
          showControlButton: true
        })
        map.addControl(controlBar)

        // 工具条
        const toolbar = new window.AMap.ToolBar({
          position: { right: '40px', top: '160px' },
          ruler: true,
          direction: true
        })
        map.addControl(toolbar)
      })
    }
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <Map amapkey={BLOG.AMAP_KEY} {...mapConfig} events={events} />

      {loading && (
        <div className="absolute inset-0 z-10 backdrop-blur-md bg-white/30 dark:bg-gray-800/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                </div>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  正在获取位置...
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  请允许位置访问权限
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-marker {
          position: relative;
          z-index: 100;
        }
        
        .marker-container {
          position: relative;
          width: 40px;
          height: 40px;
          transform: translate(-50%, -50%);
        }

        .pulse-ring {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(24, 144, 255, 0.2);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .delay-1 {
          animation-delay: 0.4s;
        }

        .delay-2 {
          animation-delay: 0.8s;
        }

        .marker-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          background: rgba(24, 144, 255, 0.3);
          border-radius: 50%;
          padding: 3px;
          backdrop-filter: blur(4px);
          box-shadow: 0 0 20px rgba(24, 144, 255, 0.4);
        }

        .marker-dot {
          width: 100%;
          height: 100%;
          background: #1890ff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(24, 144, 255, 0.6);
        }

        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .amap-maps {
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .amap-controls {
          opacity: 0.85;
          transition: all 0.3s ease;
        }

        .amap-controls:hover {
          opacity: 1;
          transform: scale(1.02);
        }

        .amap-geolocation {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(8px);
          border-radius: 8px !important;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.3s ease !important;
        }

        .amap-geolocation:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        }

        .amap-logo, .amap-copyright {
          display: none !important;
        }
      `}</style>
    </div>
  )
}

export default AMapComponent