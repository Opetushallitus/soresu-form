import _ from 'lodash'

import FormBranchGrower from './FormBranchGrower'
import FieldUpdateHandler from './FieldUpdateHandler.js'
import InputValueStorage from './InputValueStorage.js'
import JsUtil from './JsUtil.js'
import FormUtil from './FormUtil.js'

export default class FormBranchEditableFieldGrower {
  static ensureFirstChildIsRequired(state, growingParent) {
    const firstChildOfGrowingSet = _.first(growingParent.children)
    const childPrototype = FormBranchGrower.getGrowingFieldSetChildPrototype(state.configuration.form.content, growingParent.id)
    const idsWhoseInputToDelete = []
    const updatesToWrite = []

    processFirstChildChildren(n => {
      const prototypeNode = FormUtil.findFirstFieldIgnoringIndex(childPrototype, n.id)
      const existingInputValue = InputValueStorage.readValue(state.configuration.form, state.saveStatus.values, n.id)
      if (!_.isArray(existingInputValue)) {
        updatesToWrite.push(FieldUpdateHandler.createFieldUpdate(prototypeNode, existingInputValue))
      }
      idsWhoseInputToDelete.push(n.id)
    })

    _.forEach(idsWhoseInputToDelete, fieldIdToEmpty => {
      InputValueStorage.deleteValue(growingParent, state.saveStatus.values, fieldIdToEmpty)
    })

    processFirstChildChildren(n => {
      const prototypeNode = FormUtil.findFirstFieldIgnoringIndex(childPrototype, n.id)
      n.id = prototypeNode.id

      if (prototypeNode.required) {
        n.required = true
      }
    })

    _.each(updatesToWrite, fieldUpdate => {
      InputValueStorage.writeValue(state.configuration.form, state.saveStatus.values, fieldUpdate)
    })

    growingParent.children.sort((firstChild, secondChild) => {
      return JsUtil.naturalCompare(firstChild.id, secondChild.id)
    })

    const fieldsToValidate = JsUtil.flatFilter(_.first(growingParent.children), f => { return !_.isUndefined(f.id) && f.fieldClass === "formField"})
    FieldUpdateHandler.triggerFieldUpdatesForValidation(fieldsToValidate, state)

    function processFirstChildChildren(operation) {
      _.forEach(JsUtil.flatFilter(firstChildOfGrowingSet, n => { return !_.isUndefined(n.id) }), n => {
        operation(n)
      })
    }
  }
}
