import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

const Snake = ({
  isActive,
  yearInfo,
  getContributionValue,
  contributionData,
  onEatCell,
  onReset,
  totalContributions // 接收总贡献数
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
  const [eatenContributions, setEatenContributions] = useState(new Set())

  // 初始化时检查是否应该直接进入狂暴状态
  const [isRage, setIsRage] = useState(totalContributions === 0)

  // 监听贡献状态变化
  useEffect(() => {
    if (totalContributions === 0) {
      setIsRage(true)
    } else if (eatenContributions.size === totalContributions && totalContributions > 0) {
      setIsRage(true)
    } else {
      setIsRage(false)
    }
  }, [totalContributions, eatenContributions.size])

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

  // 计算总贡献格数和已吃掉的贡献格数
  const contributionStats = useMemo(() => {
    let total = 0
    for (let w = 0; w < yearInfo.totalWeeks; w++) {
      for (let d = 0; d < 7; d++) {
        const contribution = getContributionValue(w, d)
        if (contribution > 0) total++
      }
    }
    return {
      total,
      eaten: eatenContributions.size
    }
  }, [yearInfo.totalWeeks, getContributionValue, eatenContributions])

  // 重置状态
  const resetSnake = useCallback(() => {
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
    setEatenContributions(new Set())
    // 如果没有贡献，直接进入狂暴状态
    setIsRage(totalContributions === 0)
    onReset?.()
  }, [yearInfo.totalWeeks, isValidPosition, onReset, totalContributions])

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
    const moveInterval = isRage ? 200 : 300 // 狂暴状态下移动速度提升1.5倍

    if (deltaTime >= moveInterval) {
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

        if (nextPos.weekIndex === currentPos.weekIndex && nextPos.dayIndex === currentPos.dayIndex) {
          resetSnake()
          return { weekIndex: 0, dayIndex: 0 }
        }

        const contribution = getContributionValue(nextPos.weekIndex, nextPos.dayIndex)
        if (contribution > 0) {
          onEatCell?.(nextPos.weekIndex, nextPos.dayIndex)
          const growthAmount = Math.min(contribution * 2, 8)
          setSnakeLength(prev => Math.min(prev + growthAmount, 30))
          // 记录吃掉的贡献格
          setEatenContributions(prev => new Set([...prev, `${nextPos.weekIndex}-${nextPos.dayIndex}`]))
        }

        setSnakeBody(prev => {
          const newBody = [...prev, currentPos]
          return newBody.slice(-snakeLength)
        })

        lastUpdateTimeRef.current = currentTime
        return nextPos
      })
    }

    frameRequestRef.current = requestAnimationFrame(updateSnakePosition)
  }, [snakeDirection, getNextValidPosition, changeDirection, findNearestContribution, calculateDirection, getContributionValue, snakeLength, checkCollision, resetSnake, onEatCell, isRage])

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

    // 狂暴状态下使用血红色，否则使用黄色
    const baseStyle = isRage
      ? 'snake-body rage'
      : `bg-yellow-${Math.floor(300 + progress * 200)}/80 dark:bg-yellow-${Math.floor(400 + progress * 100)}/80 snake-body`

    return {
      isBody: true,
      style: baseStyle,
      scale,
      opacity,
      transform: `rotate(${rotateAngle}deg)`,
      '--rotate-deg': `${rotateAngle}deg`,
      '--index': bodyIndex,
      '--glow-color': isRage ? 'rgba(255, 0, 0, 0.8)' : 'rgba(250, 204, 21, 0.5)',
      '--pulse-speed': isRage ? '0.4s' : '0.8s',
      isRage
    }
  }, [snakeBody, snakeLength, isRage])

  return {
    snakePosition,
    getSnakeBodyStyle,
    isSnakeHead: (weekIndex, dayIndex) => (
      isActive && snakePosition.weekIndex === weekIndex && snakePosition.dayIndex === dayIndex
    ),
    reset: resetSnake,
    isActive,
    isRage,
    styles: `
      @keyframes snakeHead {
        0% { 
          transform: scale(1.25) rotate(-5deg) translateY(0) translateZ(2px);
          filter: brightness(1.3) contrast(1.2) saturate(1.4);
          box-shadow: 
            0 0 15px rgba(251, 191, 36, 0.6),
            0 0 30px rgba(251, 191, 36, 0.4);
        }
        25% { 
          transform: scale(1.3) rotate(0deg) translateY(-1px) translateZ(4px);
          filter: brightness(1.4) contrast(1.3) saturate(1.5);
          box-shadow: 
            0 0 20px rgba(251, 191, 36, 0.7),
            0 0 40px rgba(251, 191, 36, 0.5);
        }
        50% { 
          transform: scale(1.25) rotate(5deg) translateY(0) translateZ(2px);
          filter: brightness(1.3) contrast(1.2) saturate(1.4);
          box-shadow: 
            0 0 15px rgba(251, 191, 36, 0.6),
            0 0 30px rgba(251, 191, 36, 0.4);
        }
        75% { 
          transform: scale(1.3) rotate(0deg) translateY(1px) translateZ(4px);
          filter: brightness(1.4) contrast(1.3) saturate(1.5);
          box-shadow: 
            0 0 20px rgba(251, 191, 36, 0.7),
            0 0 40px rgba(251, 191, 36, 0.5);
        }
        100% { 
          transform: scale(1.25) rotate(-5deg) translateY(0) translateZ(2px);
          filter: brightness(1.3) contrast(1.2) saturate(1.4);
          box-shadow: 
            0 0 15px rgba(251, 191, 36, 0.6),
            0 0 30px rgba(251, 191, 36, 0.4);
        }
      }
      @keyframes snakeBody {
        0% { 
          transform: scale(1) rotate(var(--rotate-deg, 0deg)) translateZ(calc(var(--index) * -0.5px));
          filter: brightness(1) contrast(1) saturate(1);
          box-shadow: 0 0 calc((30 - var(--index)) * 1px) rgba(250, 204, 21, calc(0.3 - var(--index) * 0.01));
        }
        50% { 
          transform: scale(1.1) rotate(calc(var(--rotate-deg, 0deg) + 5deg)) translateZ(calc(var(--index) * -0.5px + 2px));
          filter: brightness(1.2) contrast(1.1) saturate(1.2);
          box-shadow: 0 0 calc((30 - var(--index)) * 1.5px) rgba(250, 204, 21, calc(0.4 - var(--index) * 0.01));
        }
        100% { 
          transform: scale(1) rotate(var(--rotate-deg, 0deg)) translateZ(calc(var(--index) * -0.5px));
          filter: brightness(1) contrast(1) saturate(1);
          box-shadow: 0 0 calc((30 - var(--index)) * 1px) rgba(250, 204, 21, calc(0.3 - var(--index) * 0.01));
        }
      }
      @keyframes snakeEyes {
        0%, 90% { transform: scale(1) translateY(0); opacity: 1; background: currentColor; }
        95% { transform: scale(0.8) translateY(0.5px); opacity: 0.8; background: #ff3e3e; }
        100% { transform: scale(1) translateY(0); opacity: 1; background: currentColor; }
      }
      @keyframes rageSnakeHead {
        0% { 
          transform: scale(1.4) rotate(-12deg) translateY(0) translateZ(5px);
          filter: brightness(1.8) contrast(1.5) saturate(2.2);
          box-shadow: 
            0 0 35px rgba(220, 38, 38, 1),
            0 0 70px rgba(239, 68, 68, 0.9),
            0 0 100px rgba(248, 113, 113, 0.8),
            inset 0 0 40px rgba(254, 202, 202, 0.8);
        }
        50% { 
          transform: scale(1.5) rotate(12deg) translateY(0) translateZ(8px);
          filter: brightness(2) contrast(1.6) saturate(2.5);
          box-shadow: 
            0 0 50px rgba(220, 38, 38, 1),
            0 0 100px rgba(239, 68, 68, 0.95),
            0 0 150px rgba(248, 113, 113, 0.9),
            inset 0 0 50px rgba(254, 202, 202, 0.9);
        }
        100% { 
          transform: scale(1.4) rotate(-12deg) translateY(0) translateZ(5px);
          filter: brightness(1.8) contrast(1.5) saturate(2.2);
          box-shadow: 
            0 0 35px rgba(220, 38, 38, 1),
            0 0 70px rgba(239, 68, 68, 0.9),
            0 0 100px rgba(248, 113, 113, 0.8),
            inset 0 0 40px rgba(254, 202, 202, 0.8);
        }
      }
      @keyframes rageSnakeBody {
        0% { 
          transform: scale(1.2) rotate(var(--rotate-deg, 0deg)) translateZ(calc(var(--index) * -1px));
          filter: brightness(1.6) contrast(1.4) saturate(2);
          box-shadow: 
            0 0 35px rgba(220, 38, 38, 0.95),
            0 0 70px rgba(239, 68, 68, 0.9),
            0 0 100px rgba(248, 113, 113, 0.8),
            inset 0 0 30px rgba(254, 202, 202, 0.7);
        }
        50% { 
          transform: scale(1.3) rotate(calc(var(--rotate-deg, 0deg) + 12deg)) translateZ(calc(var(--index) * -1px + 5px));
          filter: brightness(1.8) contrast(1.5) saturate(2.2);
          box-shadow: 
            0 0 50px rgba(220, 38, 38, 1),
            0 0 100px rgba(239, 68, 68, 0.95),
            0 0 150px rgba(248, 113, 113, 0.9),
            inset 0 0 40px rgba(254, 202, 202, 0.8);
        }
        100% { 
          transform: scale(1.2) rotate(var(--rotate-deg, 0deg)) translateZ(calc(var(--index) * -1px));
          filter: brightness(1.6) contrast(1.4) saturate(2);
          box-shadow: 
            0 0 35px rgba(220, 38, 38, 0.95),
            0 0 70px rgba(239, 68, 68, 0.9),
            0 0 100px rgba(248, 113, 113, 0.8),
            inset 0 0 30px rgba(254, 202, 202, 0.7);
        }
      }
      @keyframes glowPulse {
        0%, 100% { 
          opacity: 0.95; 
          transform: scale(1.4); 
          filter: blur(4px); 
          background: radial-gradient(circle at center, rgba(239, 68, 68, 0.95), transparent 80%);
        }
        50% { 
          opacity: 1; 
          transform: scale(1.8); 
          filter: blur(5px);
          background: radial-gradient(circle at center, rgba(220, 38, 38, 1), transparent 85%);
        }
      }
      @keyframes rageEyeGlow {
        0%, 100% {
          box-shadow: 
            0 0 10px #ff0000,
            0 0 20px #ff0000,
            0 0 30px #ff0000,
            inset 0 0 8px #ffffff;
          background: #ff0000;
        }
        50% {
          box-shadow: 
            0 0 15px #ff3333,
            0 0 30px #ff3333,
            0 0 45px #ff3333,
            inset 0 0 12px #ffffff;
          background: #ff3333;
        }
      }
      .snake-head {
        transform-style: preserve-3d;
        animation: snakeHead 0.6s ease-in-out infinite;
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        position: relative;
        box-shadow: 
          0 0 15px rgba(251, 191, 36, 0.6),
          0 0 30px rgba(251, 191, 36, 0.4),
          inset 0 0 10px rgba(255, 255, 255, 0.5);
      }
      .snake-head::before {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(45deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.4));
        border-radius: inherit;
        z-index: 1;
      }
      .snake-body {
        transform-style: preserve-3d;
        animation: snakeBody 0.8s ease-in-out infinite;
        animation-delay: calc(var(--index, 0) * -0.1s);
        background: linear-gradient(135deg, 
          rgba(255, 215, 0, calc(1 - var(--index) * 0.03)), 
          rgba(255, 165, 0, calc(1 - var(--index) * 0.03))
        );
      }
      .snake-head.rage {
        animation: rageSnakeHead 0.3s ease-in-out infinite;
        background: linear-gradient(135deg, #ef4444, #991b1b);
        position: relative;
        box-shadow: 
          0 0 35px rgba(220, 38, 38, 1),
          0 0 70px rgba(239, 68, 68, 0.9),
          0 0 100px rgba(248, 113, 113, 0.8),
          inset 0 0 40px rgba(254, 202, 202, 0.8);
      }
      .snake-head.rage::before {
        content: '';
        position: absolute;
        inset: -8px;
        background: radial-gradient(circle at center, rgba(239, 68, 68, 0.95), transparent 80%);
        border-radius: inherit;
        animation: glowPulse 0.8s ease-in-out infinite;
        filter: blur(4px);
      }
      .snake-body.rage {
        animation: rageSnakeBody var(--pulse-speed) ease-in-out infinite;
        animation-delay: calc(var(--index, 0) * -0.06s);
        background: linear-gradient(135deg, #ef4444, #991b1b) !important;
        position: relative;
        box-shadow: 
          0 0 35px rgba(220, 38, 38, 0.95),
          0 0 70px rgba(239, 68, 68, 0.9),
          0 0 100px rgba(248, 113, 113, 0.8),
          inset 0 0 30px rgba(254, 202, 202, 0.7);
        transform-style: preserve-3d;
        z-index: 10;
      }
      .snake-body.rage::before {
        content: '';
        position: absolute;
        inset: -8px;
        background: radial-gradient(circle at center, rgba(239, 68, 68, 0.95), transparent 80%);
        border-radius: inherit;
        animation: glowPulse 0.8s ease-in-out infinite;
        animation-delay: calc(var(--index, 0) * -0.08s);
        filter: blur(4px);
        z-index: -1;
      }
      .snake-body.rage::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(45deg, rgba(255, 255, 255, 0.6), transparent 70%);
        border-radius: inherit;
        z-index: 1;
      }
      .snake-eyes {
        animation: snakeEyes 3s ease-in-out infinite;
        box-shadow: 0 0 5px currentColor;
      }
      .snake-eyes.rage {
        animation: rageEyeGlow 0.8s ease-in-out infinite;
        background: #ff0000;
        box-shadow: 
          0 0 10px #ff0000,
          0 0 20px #ff0000,
          0 0 30px #ff0000,
          inset 0 0 8px #ffffff;
      }
    `
  }
}

export default Snake 