import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

const Snake = ({
  isActive,
  yearInfo,
  getContributionValue,
  contributionData,
  onEatCell,
  onReset
}) => {
  // 使用 ref 存储不需要触发重渲染的状态
  const gameLoopRef = useRef(null)
  const lastUpdateTimeRef = useRef(Date.now())
  const frameRequestRef = useRef(null)

  // 贪吃蛇状态
  const [snakePosition, setSnakePosition] = useState({ weekIndex: 0, dayIndex: 0 })
  const [snakeDirection, setSnakeDirection] = useState({ x: 1, y: 0 })
  const [snakeBody, setSnakeBody] = useState([])
  const [snakeLength, setSnakeLength] = useState(1)

  // 使用 useMemo 缓存计算密集的操作
  const validPositions = useMemo(() => {
    const positions = new Set()
    for (let w = 0; w < yearInfo.totalWeeks; w++) {
      for (let d = 0; d < 7; d++) {
        const dataIndex = w * 7 + d - yearInfo.firstDayOfWeek
        if (dataIndex >= 0 && dataIndex < contributionData.length) {
          positions.add(`${w}-${d}`)
        }
      }
    }
    return positions
  }, [yearInfo.totalWeeks, yearInfo.firstDayOfWeek, contributionData.length])

  // 优化碰撞检测
  const checkCollision = useCallback((pos) => {
    const posKey = `${pos.weekIndex}-${pos.dayIndex}`
    return snakeBody.some(bodyPos => `${bodyPos.weekIndex}-${bodyPos.dayIndex}` === posKey)
  }, [snakeBody])

  // 优化位置验证
  const isValidPosition = useCallback((pos) => {
    return validPositions.has(`${pos.weekIndex}-${pos.dayIndex}`)
  }, [validPositions])

  // 获取有效的下一个位置（考虑碰撞检测和边界）
  const getNextValidPosition = useCallback((currentPos, direction) => {
    // 获取所有可能的移动方向
    const possibleDirections = [
      direction,
      { x: direction.y, y: direction.x }, // 顺时针90度
      { x: -direction.y, y: -direction.x }, // 逆时针90度
      { x: -direction.x, y: -direction.y } // 相反方向
    ]

    // 尝试每个方向，直到找到一个有效位置
    for (const dir of possibleDirections) {
      const nextPos = {
        weekIndex: currentPos.weekIndex + dir.x,
        dayIndex: currentPos.dayIndex + dir.y
      }

      // 检查是否超出边界
      if (nextPos.weekIndex < 0 || nextPos.weekIndex >= yearInfo.totalWeeks ||
        nextPos.dayIndex < 0 || nextPos.dayIndex >= 7) {
        continue // 跳过无效位置
      }

      // 检查是否在贡献图的有效区域内
      if (!isValidPosition(nextPos)) {
        continue // 跳过无效位置
      }

      // 检查是否会碰到蛇身
      if (checkCollision(nextPos)) {
        continue // 跳过碰撞位置
      }

      // 找到有效位置，更新方向
      if (dir !== direction) {
        setSnakeDirection(dir)
      }
      return nextPos
    }

    // 如果所有方向都无效，返回原位置（蛇会停止移动）
    return currentPos
  }, [yearInfo.totalWeeks, checkCollision, isValidPosition])

  // 随机改变方向
  const changeDirection = useCallback(() => {
    const directions = [
      { x: 1, y: 0 },  // 右
      { x: -1, y: 0 }, // 左
      { x: 0, y: 1 },  // 下
      { x: 0, y: -1 }  // 上
    ]
    const randomIndex = Math.floor(Math.random() * directions.length)
    setSnakeDirection(directions[randomIndex])
  }, [])

  // 寻找最近的贡献格子
  const findNearestContribution = useCallback((currentPos) => {
    const searchRadius = 5 // 搜索半径
    let nearestPos = null
    let minDistance = Infinity
    let maxContribution = -1

    for (let dx = -searchRadius; dx <= searchRadius; dx++) {
      for (let dy = -searchRadius; dy <= searchRadius; dy++) {
        let checkPos = {
          weekIndex: currentPos.weekIndex + dx,
          dayIndex: currentPos.dayIndex + dy
        }

        // 检查是否在有效范围内
        if (checkPos.weekIndex < 0 || checkPos.weekIndex >= yearInfo.totalWeeks ||
          checkPos.dayIndex < 0 || checkPos.dayIndex >= 7 ||
          !isValidPosition(checkPos)) {
          continue
        }

        const contribution = getContributionValue(checkPos.weekIndex, checkPos.dayIndex)
        // 只寻找有贡献的格子
        if (contribution > 0) {
          const distance = Math.sqrt(dx * dx + dy * dy)
          // 优先选择贡献值更高的格子，其次是距离更近的
          if (contribution > maxContribution || (contribution === maxContribution && distance < minDistance)) {
            maxContribution = contribution
            minDistance = distance
            nearestPos = checkPos
          }
        }
      }
    }
    return nearestPos
  }, [yearInfo.totalWeeks, getContributionValue, isValidPosition])

  // 计算移动方向
  const calculateDirection = useCallback((currentPos, targetPos) => {
    if (!targetPos) return null

    const dx = targetPos.weekIndex - currentPos.weekIndex
    const dy = targetPos.dayIndex - currentPos.dayIndex

    // 直接使用实际距离，不再处理环绕
    if (Math.abs(dx) > Math.abs(dy)) {
      return { x: dx > 0 ? 1 : -1, y: 0 }
    } else if (dy !== 0) {
      return { x: 0, y: dy > 0 ? 1 : -1 }
    }
    return null
  }, [])

  // 重置贪吃蛇到有效的起始位置
  const resetSnake = useCallback(() => {
    // 找到第一个有效的位置作为起始点
    let startPos = { weekIndex: 0, dayIndex: 0 }
    for (let w = 0; w < yearInfo.totalWeeks; w++) {
      for (let d = 0; d < 7; d++) {
        if (isValidPosition({ weekIndex: w, dayIndex: d })) {
          startPos = { weekIndex: w, dayIndex: d }
          break
        }
      }
      if (startPos.weekIndex > 0) break
    }

    setSnakePosition(startPos)
    setSnakeDirection({ x: 1, y: 0 })
    setSnakeBody([])
    setSnakeLength(1)
    onReset?.()
  }, [yearInfo.totalWeeks, isValidPosition, onReset])

  // 监听激活状态变化
  useEffect(() => {
    if (!isActive) {
      // 当贪吃蛇被关闭时，重置所有状态
      resetSnake()
    }
  }, [isActive, resetSnake])

  // 使用 requestAnimationFrame 优化动画性能
  const updateSnakePosition = useCallback(() => {
    const currentTime = Date.now()
    const deltaTime = currentTime - lastUpdateTimeRef.current

    if (deltaTime >= 300) { // 每300ms更新一次位置
      setSnakePosition(currentPos => {
        const targetPos = findNearestContribution(currentPos)
        let newDirection = snakeDirection

        if (targetPos) {
          const calculatedDirection = calculateDirection(currentPos, targetPos)
          if (calculatedDirection) {
            const testPos = {
              weekIndex: currentPos.weekIndex + calculatedDirection.x,
              dayIndex: currentPos.dayIndex + calculatedDirection.y
            }
            if (!checkCollision(testPos)) {
              newDirection = calculatedDirection
              setSnakeDirection(calculatedDirection)
            }
          }
        } else if (Math.random() < 0.2) {
          changeDirection()
        }

        const nextPos = getNextValidPosition(currentPos, newDirection)

        // 如果被困住了，重置蛇
        if (nextPos.weekIndex === currentPos.weekIndex && nextPos.dayIndex === currentPos.dayIndex) {
          resetSnake()
          return { weekIndex: 0, dayIndex: 0 }
        }

        // 处理吃到贡献格子
        const contribution = getContributionValue(nextPos.weekIndex, nextPos.dayIndex)
        if (contribution > 0) {
          onEatCell?.(nextPos.weekIndex, nextPos.dayIndex)
          const growthAmount = Math.min(contribution * 2, 8)
          setSnakeLength(prev => Math.min(prev + growthAmount, 30))
        }

        // 更新蛇身
        setSnakeBody(prev => {
          const newBody = [...prev, currentPos]
          return newBody.slice(-snakeLength)
        })

        lastUpdateTimeRef.current = currentTime
        return nextPos
      })
    }

    frameRequestRef.current = requestAnimationFrame(updateSnakePosition)
  }, [snakeDirection, getNextValidPosition, changeDirection, findNearestContribution, calculateDirection, getContributionValue, snakeLength, checkCollision, resetSnake, onEatCell])

  // 优化动画循环
  useEffect(() => {
    if (isActive) {
      frameRequestRef.current = requestAnimationFrame(updateSnakePosition)
    }
    return () => {
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current)
      }
    }
  }, [isActive, updateSnakePosition])

  // 优化蛇身样式计算
  const getSnakeBodyStyle = useCallback((weekIndex, dayIndex) => {
    const bodyIndex = snakeBody.findIndex(pos => pos.weekIndex === weekIndex && pos.dayIndex === dayIndex)
    if (bodyIndex === -1) return null

    const progress = 1 - bodyIndex / snakeLength
    const opacity = 0.3 + progress * 0.7
    const scale = 1 + progress * 0.15

    // 计算每个身体部分的旋转角度
    const rotateAngle = Math.sin((Date.now() / 200) + bodyIndex * 0.5) * (8 - bodyIndex * 0.5)

    return {
      isBody: true,
      style: `bg-yellow-${Math.floor(300 + progress * 200)}/80 dark:bg-yellow-${Math.floor(400 + progress * 100)}/80 snake-body`,
      scale,
      opacity,
      transform: `rotate(${rotateAngle}deg)`,
      '--rotate-deg': `${rotateAngle}deg`,
      '--index': bodyIndex,
    }
  }, [snakeBody, snakeLength])

  return {
    snakePosition,
    getSnakeBodyStyle,
    isSnakeHead: (weekIndex, dayIndex) => (
      isActive && snakePosition.weekIndex === weekIndex && snakePosition.dayIndex === dayIndex
    ),
    reset: resetSnake,
    isActive
  }
}

export default Snake 