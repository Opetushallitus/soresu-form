import _ from 'lodash'

import FormUtil from '../FormUtil.js'
import JsUtil from '../JsUtil.js'

export default class FormEditorController {

  static addableFieldTypes() {
    return {
      "textField": "formField",
      "textArea": "formField",
      "radioButton": "formField",
      "checkboxButton": "formField",
      "namedAttachment": "formField",
      "p": "infoElement"

    }
  }

  constructor(props) {
    this.formDraftJson = props.formDraftJson
    this.onEditCallback = props.onFormEdited
  }

  doEdit(operation) {
    operation()
    this.onEditCallback(JSON.stringify(this.formDraftJson, null, 2))
  }

  editField(fieldId, valueContainerGetter, valueName, newValue) {
    this.doEdit(() => {
      const fieldFromJson = FormUtil.findField(this.formDraftJson.content, fieldId)
      valueContainerGetter(fieldFromJson)[valueName] = newValue
    })
  }

  removeField(field) {
    this.doEdit(() => {
      const fieldMatcher = f => { return f.id === field.id }
      const parent = FormUtil.findFieldWithDirectChild(this.formDraftJson.content, field.id)
      if (parent) {
        _.remove(parent.children, fieldMatcher)
      } else {
        _.remove(this.formDraftJson.content, fieldMatcher)
      }
    })
  }

  addChildFieldAfter(fieldToAddAfter, newFieldType) {
    this.doEdit(() => {
      const formDraftJson = this.formDraftJson
      const parentField = FormUtil.findFieldWithDirectChild(formDraftJson.content, fieldToAddAfter.id)
      const childArray = parentField ? parentField.children : formDraftJson.content
      const fieldToAddAfterOnForm = FormUtil.findField(formDraftJson.content, fieldToAddAfter.id)
      const indexOfNewChild = childArray.indexOf(fieldToAddAfterOnForm) + 1

      function generateUniqueId(index) {
        const proposed = newFieldType + "-" +index
        if (_.isEmpty(JsUtil.flatFilter(formDraftJson.content, n => { return n.id === proposed}))) {
          return proposed
        }
        return generateUniqueId(index + 1)
      }

      const newId = generateUniqueId(0)
      const newChild = createNewField(newFieldType, newId)

      const parent = parentField ? FormUtil.findField(formDraftJson.content, parentField.id) : formDraftJson.content
      if (_.isArray(parent)) {
        parent.splice(indexOfNewChild, 0, newChild);
      } else {
        parent.children.splice(indexOfNewChild, 0, newChild);
      }
    })

    function createNewField(fieldType, id) {
      const fieldClass = FormEditorController.addableFieldTypes()[fieldType]
      const newField = {
        "params": {},
        "fieldClass": fieldClass,
        "fieldType": fieldType,
        "id": id
      }

      switch (fieldClass) {
        case "formField":
          newField.label = { "fi": "", "sv": "" }
          newField.helpText = { "fi": "", "sv": "" }
          newField.required = true
          break
        case "infoElement":
          break
        default:
          throw new Error("Don't know how to create field of class '" + fieldClass + "' for type '" + fieldType + "'")
      }

      switch (fieldType) {
        case "moneyField":
        case "emailField":
        case "namedAttachment":
          break
        case "textField":
          newField.params.maxlength = 100
          newField.params.size = "medium"
          break
        case "textArea":
          newField.params.maxlength = 1000
          newField.params.size = "medium"
          break
        case "radioButton":
        case "dropdown":
        case "checkboxButton":
          newField.options = [
            FormEditorController.createEmptyOption(),
            FormEditorController.createEmptyOption()
          ]
          break
        case "p":
          newField.text = {"fi": "", "sv": ""}
          break
        default:
          throw new Error("Don't know how to create field of type '" + fieldType + "'")
      }

      return newField
    }
  }

  static createEmptyOption() {
    return { "value": "", "label": { "fi": "", "sv": "" } }
  }

  appendOption(radioButtonField) {
    this.doEdit(() => {
      const fieldInForm = FormUtil.findField(this.formDraftJson.content, radioButtonField.id)
      fieldInForm.options.push(FormEditorController.createEmptyOption())
    })
  }

  removeOption(radioButtonField, optionToRemove) {
    this.doEdit(() => {
      const fieldInForm = FormUtil.findField(this.formDraftJson.content, radioButtonField.id)
      _.remove(fieldInForm.options, optionToRemove)
    })
  }
}