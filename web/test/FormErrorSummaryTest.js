const _ = require('lodash')
const verboseAssert = require('assert')
import { assert } from 'chai'
const JsUtil = require('../form/JsUtil.js')
const FormErrorSummary = require('../form/component/FormErrorSummary.jsx')
const TestUtil = require('./TestUtil.js')

const formContent = TestUtil.testFormJson()
var validationErrors = {}

describe('Form full of errors', function() {
  beforeEach(function() {
    validationErrors = _(JsUtil.flatFilter(formContent, x => !_.isUndefined(x.id) && x.fieldClass === "formField"))
      .map(field => { return { id: field.id, errors: [ { 'error': 'required' } ] }})
      .indexBy('id')
      .mapValues('errors')
      .value()
  })

  it('gets its summary calculated', function() {
    const fieldsErrorsAndClosestParents = FormErrorSummary.resolveFieldsErrorsAndClosestParents(validationErrors, formContent)
    assert.lengthOf(fieldsErrorsAndClosestParents, 53)
    const privateFinancingIncomeEntry = JsUtil.flatFilter(fieldsErrorsAndClosestParents, n => { return n && n.field && n.field.id === 'private-financing-income-row.amount' })[0]
    assert.equal(privateFinancingIncomeEntry.closestParent.id, 'private-financing-income-row', JSON.stringify(privateFinancingIncomeEntry))
    assert.equal(privateFinancingIncomeEntry.errors[0].error, 'required', JSON.stringify(privateFinancingIncomeEntry))
  })
})
