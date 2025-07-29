/**
 * AIBotBlockingValidator AI机器人屏蔽验证器测试
 * 
 * 测试AI机器人屏蔽验证器的各项功能，包括：
 * - AI机器人屏蔽配置检查
 * - 屏蔽配置完整性验证
 * - 内容保护策略分析
 * - AI保护建议生成
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach } from '@jest/globals'
import { AIBotBlockingValidator } from '../lib/seo/aiBotBlockingValidator.js'

describe('AIBotBlockingValidator AI机器人屏蔽验证器测试', () => {
  let validator

  beforeEach(() => {
    validator = new AIBotBlockingValidator()
  })

  describe('AI机器人屏蔽配置检查', () => {
    test('应该检测没有AI机器人规则', async () => {
      const content = `User-agent: *
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const noAIRulesCheck = checks.find(c => c.id === 'no-ai-bot-rules')
      expect(noAIRulesCheck).toBeDefined()
      expect(noAIRulesCheck.status).toBe('warning')
    })

    test('应该检测AI机器人规则存在', async () => {
      const content = `User-agent: gptbot
Disallow: /`
      const checks = await validator.validate(content)
      
      const aiRulesFoundCheck = checks.find(c => c.id === 'ai-bot-rules-found')
      expect(aiRulesFoundCheck).toBeDefined()
      expect(aiRulesFoundCheck.status).toBe('pass')
      expect(aiRulesFoundCheck.message).toContain('1个AI机器人')
    })

    test('应该验证AI机器人被正确屏蔽', async () => {
      const content = `User-agent: gptbot
Disallow: /`
      const checks = await validator.validate(content)
      
      const aiBlockedCheck = checks.find(c => c.id === 'ai-bot-blocked')
      expect(aiBlockedCheck).toBeDefined()
      expect(aiBlockedCheck.status).toBe('pass')
      expect(aiBlockedCheck.message).toContain('OpenAI GPT已被正确屏蔽')
    })

    test('应该警告高风险AI机器人被允许', async () => {
      const content = `User-agent: gptbot
Allow: /`
      const checks = await validator.validate(content)
      
      const highRiskAllowedCheck = checks.find(c => c.id === 'high-risk-ai-bot-allowed')
      expect(highRiskAllowedCheck).toBeDefined()
      expect(highRiskAllowedCheck.status).toBe('warning')
      expect(highRiskAllowedCheck.message).toContain('高风险AI机器人')
    })

    test('应该检测AI机器人部分访问', async () => {
      const content = `User-agent: gptbot
Disallow: /admin/
Allow: /public/`
      const checks = await validator.validate(content)
      
      const partialAccessCheck = checks.find(c => c.id === 'ai-bot-partial-access')
      expect(partialAccessCheck).toBeDefined()
      expect(partialAccessCheck.status).toBe('info')
    })

    test('应该检测未配置的高风险AI机器人', async () => {
      const content = `User-agent: *
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const unconfiguredCheck = checks.find(c => c.id === 'unconfigured-high-risk-ai-bots')
      expect(unconfiguredCheck).toBeDefined()
      expect(unconfiguredCheck.status).toBe('warning')
      expect(unconfiguredCheck.message).toContain('高风险AI机器人未配置')
    })

    test('应该报告高风险AI机器人保护情况', async () => {
      const content = `User-agent: gptbot
Disallow: /

User-agent: chatgpt-user
Disallow: /`
      const checks = await validator.validate(content)
      
      const protectionCheck = checks.find(c => c.id === 'high-risk-ai-bot-protection')
      expect(protectionCheck).toBeDefined()
      expect(protectionCheck.status).toBe('pass')
      expect(protectionCheck.message).toContain('高风险AI机器人已被屏蔽')
    })
  })

  describe('屏蔽配置完整性验证', () => {
    test('应该评估高AI机器人覆盖度', async () => {
      const content = `User-agent: gptbot
Disallow: /

User-agent: chatgpt-user
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: claude-web
Disallow: /

User-agent: ccbot
Disallow: /

User-agent: meta-externalagent
Disallow: /

User-agent: bytespider
Disallow: /`
      const checks = await validator.validate(content)
      
      const highCoverageCheck = checks.find(c => c.id === 'high-ai-bot-coverage')
      expect(highCoverageCheck).toBeDefined()
      expect(highCoverageCheck.status).toBe('pass')
      expect(highCoverageCheck.message).toContain('覆盖度高')
    })

    test('应该评估低AI机器人覆盖度', async () => {
      const content = `User-agent: gptbot
Disallow: /`
      const checks = await validator.validate(content)
      
      const lowCoverageCheck = checks.find(c => c.id === 'low-ai-bot-coverage')
      expect(lowCoverageCheck).toBeDefined()
      expect(lowCoverageCheck.status).toBe('warning')
      expect(lowCoverageCheck.message).toContain('覆盖度较低')
    })

    test('应该评估有效的AI屏蔽', async () => {
      const content = `User-agent: gptbot
Disallow: /

User-agent: chatgpt-user
Disallow: /`
      const checks = await validator.validate(content)
      
      const effectiveBlockingCheck = checks.find(c => c.id === 'effective-ai-blocking')
      expect(effectiveBlockingCheck).toBeDefined()
      expect(effectiveBlockingCheck.status).toBe('pass')
      expect(effectiveBlockingCheck.message).toContain('屏蔽效果好')
    })

    test('应该检测无效的AI屏蔽', async () => {
      const content = `User-agent: gptbot
Allow: /

User-agent: chatgpt-user
Allow: /`
      const checks = await validator.validate(content)
      
      const ineffectiveBlockingCheck = checks.find(c => c.id === 'ineffective-ai-blocking')
      expect(ineffectiveBlockingCheck).toBeDefined()
      expect(ineffectiveBlockingCheck.status).toBe('warning')
      expect(ineffectiveBlockingCheck.message).toContain('屏蔽效果有限')
    })
  })

  describe('内容保护策略分析', () => {
    test('应该识别全面屏蔽策略', async () => {
      const content = `User-agent: *
Disallow: /`
      const checks = await validator.validate(content)
      
      const strategyCheck = checks.find(c => c.id === 'content-protection-strategy')
      expect(strategyCheck).toBeDefined()
      expect(strategyCheck.message).toContain('全面屏蔽策略')
      
      const adviceCheck = checks.find(c => c.id === 'blanket-blocking-advice')
      expect(adviceCheck).toBeDefined()
      expect(adviceCheck.status).toBe('warning')
    })

    test('应该识别选择性AI屏蔽策略', async () => {
      const content = `User-agent: gptbot
Disallow: /

User-agent: *
Allow: /`
      const checks = await validator.validate(content)
      
      const strategyCheck = checks.find(c => c.id === 'content-protection-strategy')
      expect(strategyCheck).toBeDefined()
      expect(strategyCheck.message).toContain('选择性AI屏蔽策略')
      
      const adviceCheck = checks.find(c => c.id === 'selective-blocking-advice')
      expect(adviceCheck).toBeDefined()
      expect(adviceCheck.status).toBe('pass')
    })

    test('应该识别分层保护策略', async () => {
      const content = `User-agent: *
Disallow: /

User-agent: gptbot
Disallow: /`
      const checks = await validator.validate(content)
      
      const strategyCheck = checks.find(c => c.id === 'content-protection-strategy')
      expect(strategyCheck).toBeDefined()
      expect(strategyCheck.message).toContain('分层保护策略')
      
      const adviceCheck = checks.find(c => c.id === 'layered-protection-advice')
      expect(adviceCheck).toBeDefined()
      expect(adviceCheck.status).toBe('pass')
    })

    test('应该识别最小保护策略', async () => {
      const content = `User-agent: *
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const strategyCheck = checks.find(c => c.id === 'content-protection-strategy')
      expect(strategyCheck).toBeDefined()
      expect(strategyCheck.message).toContain('最小保护策略')
      
      const adviceCheck = checks.find(c => c.id === 'minimal-protection-advice')
      expect(adviceCheck).toBeDefined()
      expect(adviceCheck.status).toBe('warning')
    })
  })

  describe('AI保护建议生成', () => {
    test('应该生成高风险AI机器人屏蔽建议', async () => {
      const content = `User-agent: *
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const recommendationChecks = checks.filter(c => 
        c.id.startsWith('ai-protection-recommendation')
      )
      expect(recommendationChecks.length).toBeGreaterThan(0)
      
      const summaryCheck = checks.find(c => c.id === 'ai-protection-recommendations-summary')
      expect(summaryCheck).toBeDefined()
      expect(summaryCheck.message).toContain('条AI保护建议')
    })

    test('应该确认AI保护已充分', async () => {
      const content = `User-agent: gptbot
Disallow: /

User-agent: chatgpt-user
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: claude-web
Disallow: /`
      const checks = await validator.validate(content)
      
      const adequateCheck = checks.find(c => c.id === 'ai-protection-adequate')
      expect(adequateCheck).toBeDefined()
      expect(adequateCheck.status).toBe('pass')
      expect(adequateCheck.message).toContain('比较完善')
    })

    test('应该生成通用AI保护建议', async () => {
      const content = `User-agent: *
Allow: /`
      const checks = await validator.validate(content)
      
      const generalProtectionCheck = checks.find(c => 
        c.id.startsWith('ai-protection-recommendation') && 
        c.message.includes('通用AI保护')
      )
      expect(generalProtectionCheck).toBeDefined()
    })
  })

  describe('配置选项', () => {
    test('应该使用自定义配置', () => {
      const customValidator = new AIBotBlockingValidator({
        strictMode: true,
        checkAIBotBlocking: false,
        validateBlockingCompleteness: false,
        recommendAIProtection: false,
        analyzeContentProtection: false
      })
      
      expect(customValidator.options.strictMode).toBe(true)
      expect(customValidator.options.checkAIBotBlocking).toBe(false)
      expect(customValidator.options.validateBlockingCompleteness).toBe(false)
      expect(customValidator.options.recommendAIProtection).toBe(false)
      expect(customValidator.options.analyzeContentProtection).toBe(false)
    })
  })

  describe('工具方法', () => {
    test('应该获取支持的AI机器人列表', () => {
      const aiBots = validator.getSupportedAIBots()
      
      expect(aiBots).toHaveProperty('gptbot')
      expect(aiBots).toHaveProperty('chatgpt-user')
      expect(aiBots).toHaveProperty('anthropic-ai')
      expect(aiBots.gptbot.name).toBe('OpenAI GPT')
      expect(aiBots.gptbot.riskLevel).toBe('high')
    })

    test('应该检查是否为已知AI机器人', () => {
      expect(validator.isKnownAIBot('GPTBot')).toBe(true)
      expect(validator.isKnownAIBot('gptbot')).toBe(true)
      expect(validator.isKnownAIBot('UnknownBot')).toBe(false)
    })

    test('应该获取AI机器人配置', () => {
      const config = validator.getAIBotConfig('GPTBot')
      
      expect(config).toBeDefined()
      expect(config.name).toBe('OpenAI GPT')
      expect(config.company).toBe('OpenAI')
      expect(config.riskLevel).toBe('high')
      expect(config.blockRecommended).toBe(true)
      
      const unknownConfig = validator.getAIBotConfig('UnknownBot')
      expect(unknownConfig).toBeNull()
    })

    test('应该获取推荐屏蔽列表', () => {
      const blockList = validator.getRecommendedBlockList()
      
      expect(blockList).toBeInstanceOf(Array)
      expect(blockList.length).toBeGreaterThan(0)
      
      const gptBot = blockList.find(bot => bot.name === 'gptbot')
      expect(gptBot).toBeDefined()
      expect(gptBot.displayName).toBe('OpenAI GPT')
      expect(gptBot.riskLevel).toBe('high')
    })
  })

  describe('错误处理', () => {
    test('应该处理验证错误', async () => {
      const validator = new AIBotBlockingValidator()
      
      // 重写一个方法来抛出错误
      const originalMethod = validator._parseContent
      validator._parseContent = () => {
        throw new Error('测试错误')
      }
      
      const checks = await validator.validate('test content')
      
      const errorCheck = checks.find(c => c.id === 'ai-bot-validation-error')
      expect(errorCheck).toBeDefined()
      expect(errorCheck.status).toBe('error')
      expect(errorCheck.severity).toBe('critical')
      
      // 恢复原方法
      validator._parseContent = originalMethod
    })
  })

  describe('复杂场景测试', () => {
    test('应该处理完整的AI保护配置', async () => {
      const content = `# AI机器人保护配置
User-agent: gptbot
Disallow: /

User-agent: chatgpt-user
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: claude-web
Disallow: /

User-agent: ccbot
Disallow: /

User-agent: meta-externalagent
Disallow: /

User-agent: google-extended
Allow: /public/
Disallow: /private/

User-agent: *
Disallow: /`

      const checks = await validator.validate(content)
      
      // 应该有多个通过的检查
      const passedChecks = checks.filter(c => c.status === 'pass')
      expect(passedChecks.length).toBeGreaterThan(3)
      
      // 应该有高覆盖度
      const highCoverageCheck = checks.find(c => c.id === 'high-ai-bot-coverage')
      expect(highCoverageCheck).toBeDefined()
      
      // 应该有有效屏蔽
      const effectiveBlockingCheck = checks.find(c => c.id === 'effective-ai-blocking')
      expect(effectiveBlockingCheck).toBeDefined()
      
      // 应该识别分层保护策略
      const strategyCheck = checks.find(c => c.id === 'content-protection-strategy')
      expect(strategyCheck).toBeDefined()
      expect(strategyCheck.message).toContain('分层保护')
    })

    test('应该处理有问题的AI配置', async () => {
      const content = `User-agent: *
Allow: /`

      const checks = await validator.validate(content)
      
      // 应该检测到多个问题
      const warnings = checks.filter(c => c.status === 'warning')
      expect(warnings.length).toBeGreaterThan(0)
      
      // 检查特定问题
      expect(checks.some(c => c.id === 'no-ai-bot-rules')).toBe(true)
      expect(checks.some(c => c.id === 'low-ai-bot-coverage')).toBe(true)
      expect(checks.some(c => c.id === 'minimal-protection-advice')).toBe(true)
    })

    test('应该处理基本的robots.txt文件', async () => {
      const content = `User-agent: *
Disallow: /admin/
Allow: /public/`

      const checks = await validator.validate(content)
      
      // 应该有基本的分析结果
      const noAIRulesCheck = checks.find(c => c.id === 'no-ai-bot-rules')
      expect(noAIRulesCheck).toBeDefined()
      
      const strategyCheck = checks.find(c => c.id === 'content-protection-strategy')
      expect(strategyCheck).toBeDefined()
      
      // 应该有AI保护建议
      const recommendationChecks = checks.filter(c => 
        c.id.startsWith('ai-protection-recommendation')
      )
      expect(recommendationChecks.length).toBeGreaterThan(0)
    })
  })
})