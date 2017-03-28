import FormUtil from './FormUtil.js'

export default class MoneyValidator {
  static validateMoney(input) {
    return /^[0-9]*$/.test(input) && FormUtil.isNumeric(input) ? undefined : { error: "money" }
  }
}
