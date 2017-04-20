import Big from 'big.js'

export default class MathUtil {
  static decimalShareRoundedUpOf(fraction, total) {
    return Number(Big(fraction).times(total).round(0, 3))
  }

  static ratioShareRoundedUpOf(ratio, total) {
    return MathUtil.decimalShareRoundedUpOf(Big(ratio.nominator).div(ratio.denominator), total)
  }

  static percentageShareRoundedUpOf(percentage, total) {
    return MathUtil.decimalShareRoundedUpOf(Big(percentage).div(100), total)
  }

  static percentageOf(part, total) {
    return (part / total) * 100
  }

  static isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }

  static roundDecimal(number, digits, roundingMode = "round") {
    return Number(Math[roundingMode](Number(number + "e" + digits)) + "e-" + digits)
  }

  static formatDecimal(number, separator = ",") {
    return ("" + number).replace(".", separator)
  }
}
