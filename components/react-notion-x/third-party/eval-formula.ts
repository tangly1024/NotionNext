import * as types from 'notion-types'
import add from 'date-fns/add/index.js'
import format from 'date-fns/format/index.js'
import getDate from 'date-fns/getDate/index.js'
import getDay from 'date-fns/getDay/index.js'
import getHours from 'date-fns/getHours/index.js'
import getMinutes from 'date-fns/getMinutes/index.js'
import getMonth from 'date-fns/getMonth/index.js'
import getYear from 'date-fns/getYear/index.js'
import intervalToDuration from 'date-fns/intervalToDuration/index.js'
import sub from 'date-fns/sub/index.js'
import { getDateValue, getTextContent } from 'notion-utils'

export interface EvalFormulaContext {
  properties: types.PropertyMap
  schema: types.CollectionPropertySchemaMap

  endDate?: boolean
}

/**
 * Evaluates a Notion formula expression to a result value.
 *
 * All built-in functions and operators are supported.
 *
 * NOTE: this needs a lot more testing, especially around covering all the different
 * function types and coercing different property values correctly.
 *
 * It does work for many of our test cases, however.
 *
 * @param formula - Formula to evaluate.
 * @param context - Collection context containing property schema and values.
 */
export function evalFormula(
  formula: types.Formula,
  context: EvalFormulaContext
): types.FormulaResult {
  const { endDate, ...ctx } = context

  // TODO: coerce return type using `formula.return_type`
  switch (formula?.type) {
    case 'symbol':
      // TODO: this isn't documented anywhere but seen in the wild
      return formula.name === 'true'

    case 'constant': {
      const value = formula.value
      switch (formula.result_type) {
        case 'text':
          return value
        case 'number':
          return parseFloat(value)
        default:
          return value
      }
    }

    case 'property': {
      const value = ctx.properties[formula.id]
      const text = getTextContent(value)

      switch (formula.result_type) {
        case 'text':
          return text

        case 'number':
          return parseFloat(text)

        case 'boolean':
          // TODO: handle chceckbox properties
          if (typeof text === 'string') {
            return text === 'true'
          } else {
            return !!text
          }

        case 'date': {
          // console.log('date', text, value)

          const v = getDateValue(value)
          if (v) {
            if (endDate && v.end_date) {
              const date = new Date(v.end_date)
              return new Date(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate()
              )
            } else {
              const date = new Date(v.start_date)
              return new Date(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate()
              )
            }
          } else {
            return new Date(text)
          }
        }

        default:
          return text
      }
    }

    case 'operator':
    // All operators are exposed as functions, so we handle them the same

    // eslint-disable-next-line no-fallthrough
    case 'function':
      return evalFunctionFormula(formula, ctx)

    default:
      // console.log(formula)
      throw new Error(
        `invalid or unsupported formula "${(formula as any)?.type}`
      )
  }
}

/**
 * Evaluates a Notion formula function or operator expression.
 *
 * Note that all operators are also exposed as functions, so we handle them the same.
 *
 * @private
 */
function evalFunctionFormula(
  formula: types.FunctionFormula | types.OperatorFormula,
  ctx: EvalFormulaContext
): types.FormulaResult {
  const args = formula?.args

  switch (formula.name) {
    // logic
    // ------------------------------------------------------------------------

    case 'and':
      return evalFormula(args[0], ctx) && evalFormula(args[1], ctx)

    case 'empty':
      return !evalFormula(args[0], ctx)

    case 'equal':
      // eslint-disable-next-line eqeqeq
      return evalFormula(args[0], ctx) == evalFormula(args[1], ctx)

    case 'if':
      return evalFormula(args[0], ctx)
        ? evalFormula(args[1], ctx)
        : evalFormula(args[2], ctx)

    case 'larger':
      return evalFormula(args[0], ctx) > evalFormula(args[1], ctx)

    case 'largerEq':
      return evalFormula(args[0], ctx) >= evalFormula(args[1], ctx)

    case 'not':
      return !evalFormula(args[0], ctx)

    case 'or':
      return evalFormula(args[0], ctx) || evalFormula(args[1], ctx)

    case 'smaller':
      return evalFormula(args[0], ctx) < evalFormula(args[1], ctx)

    case 'smallerEq':
      return evalFormula(args[0], ctx) <= evalFormula(args[1], ctx)

    case 'unequal':
      // eslint-disable-next-line eqeqeq
      return evalFormula(args[0], ctx) != evalFormula(args[1], ctx)

    // numeric
    // ------------------------------------------------------------------------

    case 'abs':
      return Math.abs(evalFormula(args[0], ctx) as number)

    case 'add': {
      const v0 = evalFormula(args[0], ctx)
      const v1 = evalFormula(args[1], ctx)

      if (typeof v0 === 'number') {
        return v0 + +v1
      } else if (typeof v0 === 'string') {
        return v0 + `${v1}`
      } else {
        // TODO
        return v0
      }
    }

    case 'cbrt':
      return Math.cbrt(evalFormula(args[0], ctx) as number)

    case 'ceil':
      return Math.ceil(evalFormula(args[0], ctx) as number)

    case 'divide':
      return (
        (evalFormula(args[0], ctx) as number) /
        (evalFormula(args[1], ctx) as number)
      )

    case 'exp':
      return Math.exp(evalFormula(args[0], ctx) as number)

    case 'floor':
      return Math.floor(evalFormula(args[0], ctx) as number)

    case 'ln':
      return Math.log(evalFormula(args[0], ctx) as number)

    case 'log10':
      return Math.log10(evalFormula(args[0], ctx) as number)

    case 'log2':
      return Math.log2(evalFormula(args[0], ctx) as number)

    case 'max': {
      const values = args.map((arg) => evalFormula(arg, ctx) as number)
      return values.reduce(
        (acc, value) => Math.max(acc, value),
        Number.NEGATIVE_INFINITY
      )
    }

    case 'min': {
      const values = args.map((arg) => evalFormula(arg, ctx) as number)
      return values.reduce(
        (acc, value) => Math.min(acc, value),
        Number.POSITIVE_INFINITY
      )
    }

    case 'mod':
      return (
        (evalFormula(args[0], ctx) as number) %
        (evalFormula(args[1], ctx) as number)
      )

    case 'multiply':
      return (
        (evalFormula(args[0], ctx) as number) *
        (evalFormula(args[1], ctx) as number)
      )

    case 'pow':
      return Math.pow(
        evalFormula(args[0], ctx) as number,
        evalFormula(args[1], ctx) as number
      )

    case 'round':
      return Math.round(evalFormula(args[0], ctx) as number)

    case 'sign':
      return Math.sign(evalFormula(args[0], ctx) as number)

    case 'sqrt':
      return Math.sqrt(evalFormula(args[0], ctx) as number)

    case 'subtract':
      return (
        (evalFormula(args[0], ctx) as number) -
        (evalFormula(args[1], ctx) as number)
      )

    case 'toNumber':
      return parseFloat(evalFormula(args[0], ctx) as string)

    case 'unaryMinus':
      return (evalFormula(args[0], ctx) as number) * -1

    case 'unaryPlus':
      return parseFloat(evalFormula(args[0], ctx) as string)

    // text
    // ------------------------------------------------------------------------

    case 'concat': {
      const values = args.map((arg) => evalFormula(arg, ctx) as number)
      return values.join('')
    }

    case 'contains':
      return (evalFormula(args[0], ctx) as string).includes(
        evalFormula(args[1], ctx) as string
      )

    case 'format': {
      const value = evalFormula(args[0], ctx)

      switch (typeof value) {
        case 'string':
          return value

        case 'object':
          if (value instanceof Date) {
            return format(value as Date, 'MMM d, YYY')
          } else {
            // shouldn't ever get here
            return `${value}`
          }

        case 'number':
        default:
          return `${value}`
      }
    }

    case 'join': {
      const [delimiterArg, ...restArgs] = args
      const delimiter = evalFormula(delimiterArg, ctx) as string
      const values = restArgs.map((arg) => evalFormula(arg, ctx) as number)
      return values.join(delimiter)
    }

    case 'length':
      return (evalFormula(args[0], ctx) as string).length

    case 'replace': {
      const value = evalFormula(args[0], ctx) as string
      const regex = evalFormula(args[1], ctx) as string
      const replacement = evalFormula(args[2], ctx) as string
      return value.replace(new RegExp(regex), replacement)
    }

    case 'replaceAll': {
      const value = evalFormula(args[0], ctx) as string
      const regex = evalFormula(args[1], ctx) as string
      const replacement = evalFormula(args[2], ctx) as string
      return value.replace(new RegExp(regex, 'g'), replacement)
    }

    case 'slice': {
      const value = evalFormula(args[0], ctx) as string
      const beginIndex = evalFormula(args[1], ctx) as number
      const endIndex = args[2]
        ? (evalFormula(args[2], ctx) as number)
        : value.length
      return value.slice(beginIndex, endIndex)
    }

    case 'test': {
      const value = evalFormula(args[0], ctx) as string
      const regex = evalFormula(args[1], ctx) as string
      return new RegExp(regex).test(value)
    }

    // date & time
    // ------------------------------------------------------------------------

    case 'date':
      return getDate(evalFormula(args[0], ctx) as Date)

    case 'dateAdd': {
      const date = evalFormula(args[0], ctx) as Date
      const number = evalFormula(args[1], ctx) as number
      const unit = evalFormula(args[1], ctx) as string
      return add(date, { [unit]: number })
    }

    case 'dateBetween': {
      const date1 = evalFormula(args[0], ctx) as Date
      const date2 = evalFormula(args[1], ctx) as Date
      const unit = evalFormula(args[1], ctx) as string
      return (
        intervalToDuration({
          start: date2,
          end: date1
        }) as any
      )[unit] as number
    }

    case 'dateSubtract': {
      const date = evalFormula(args[0], ctx) as Date
      const number = evalFormula(args[1], ctx) as number
      const unit = evalFormula(args[1], ctx) as string
      return sub(date, { [unit]: number })
    }

    case 'day':
      return getDay(evalFormula(args[0], ctx) as Date)

    case 'end':
      return evalFormula(args[0], { ...ctx, endDate: true }) as Date

    case 'formatDate': {
      const date = evalFormula(args[0], ctx) as Date
      const formatValue = (evalFormula(args[1], ctx) as string).replace(
        'dddd',
        'eeee'
      )
      return format(date, formatValue)
    }

    case 'fromTimestamp':
      return new Date(evalFormula(args[0], ctx) as number)

    case 'hour':
      return getHours(evalFormula(args[0], ctx) as Date)

    case 'minute':
      return getMinutes(evalFormula(args[0], ctx) as Date)

    case 'month':
      return getMonth(evalFormula(args[0], ctx) as Date)

    case 'now':
      return new Date()

    case 'start':
      return evalFormula(args[0], { ...ctx, endDate: false }) as Date

    case 'timestamp':
      return (evalFormula(args[0], ctx) as Date).getTime()

    case 'year':
      return getYear(evalFormula(args[0], ctx) as Date)

    default:
      // console.log(formula)
      throw new Error(
        `invalid or unsupported function formula "${(formula as any)?.type}`
      )
  }
}
