import React from 'react'
import _ from 'lodash'

import styles from '../style/preview.less'
import printStyles from '../style/print.less'

import {BasicFieldEdit,BasicEditWrapper,AppendableEditWrapper,InfoElementEditWrapper} from 'soresu-form/web/form/edit/EditComponent.jsx'
import CSSTransitionGroup from 'soresu-form/web/form/component/wrapper/CSSTransitionGroup.jsx'
import FormEditComponent from 'soresu-form/web/form/edit/FormEditComponent.jsx'

import FormPreview from '../FormPreview.jsx'

export default class FormEdit extends React.Component {

  static createFormEditComponent(controller, formEditorController, state, field, fieldProperties, renderingParameters) {
    if(FormEditComponent.fieldTypeMapping()[field.fieldType]) {
      const translations = state.configuration.translations
      const customProperties = controller.getCustomComponentProperties(state)
      return <FormEditComponent {...fieldProperties}
          renderingParameters={renderingParameters}
          translations={translations}
          controller={controller}
          formEditorController={formEditorController}
          customProps={customProperties}
          attachment={state.saveStatus.attachments[field.id]}
          attachmentDownloadUrl={controller.createAttachmentDownloadUrl(state, field) }/>
    }
    return <BasicFieldEdit formEditorController={formEditorController} htmlId={fieldProperties.htmlId} key={fieldProperties.htmlId} field={field}/>
  }

  static renderField(controller, formEditorController, state, infoElementValues, field, renderingParameters) {
    const fields = state.form.content
    const htmlId = controller.constructHtmlId(fields, field.id)
    const fieldProperties = { fieldType: field.fieldType, lang: state.configuration.lang, key: htmlId, htmlId: htmlId, field: field }
    if (field.fieldClass == "infoElement") {
      const previewInfoElement =  FormPreview.createInfoComponent(state, infoElementValues, field, fieldProperties, false)
      return <InfoElementEditWrapper formEditorController={formEditorController} wrappedElement={previewInfoElement} htmlId={htmlId} key={htmlId} field={field}/>
    } else if (field.fieldClass == "wrapperElement") {
      if(controller.getCustomPreviewComponentTypeMapping()[field.fieldType] || field.fieldType === "growingFieldset") {
        const previewWrapperElement = FormPreview.createWrapperComponent(FormPreview.renderField, controller, formEditorController, state, infoElementValues, field, fieldProperties, renderingParameters)
        return <BasicEditWrapper formEditorController={formEditorController} wrappedElement={previewWrapperElement} htmlId={htmlId} key={htmlId} field={field}/>
      }
      else {
        const editableWrapperElement = FormPreview.createWrapperComponent(FormEdit.renderField, controller, formEditorController, state, infoElementValues, field, fieldProperties, renderingParameters)
        return <AppendableEditWrapper formEditorController={formEditorController} wrappedElement={editableWrapperElement} htmlId={htmlId} key={htmlId} field={field}/>
      }
    }
    return FormEdit.createFormEditComponent(controller, formEditorController, state, field, fieldProperties, renderingParameters)
  }

  render() {
    const controller = this.props.controller
    const formEditorController = this.props.formEditorController
    const infoElementValues = this.props.infoElementValues.content
    const state = this.props.state
    const fields = state.form.content

    const renderField = function(field) {
      return FormEdit.renderField(controller, formEditorController, state, infoElementValues, field)
    }

    return  <div className="soresu-form-edit soresu-edit">
      <CSSTransitionGroup transitionName="soresu-dynamic-children-transition">
        {fields.map(renderField)}
      </CSSTransitionGroup>
    </div>
  }
}