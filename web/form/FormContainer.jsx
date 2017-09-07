import React from 'react'
import _ from 'lodash'
import InputValueStorage from './InputValueStorage'
import FieldUpdateHandler from './FieldUpdateHandler'
import FormController from './FormController.js'
import FormUtil from './FormUtil.js'
import axios from 'axios'

import FormPreview from './FormPreview.jsx'

export default class FormContainer extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.changeFieldValue = this.changeFieldValue.bind(this)
  }

  changeFieldValue(data, fieldName, dataField){
    this.props.controller.componentOnChangeListener(FormUtil.findField(this.props.state, fieldName), data[dataField])
  }

  handleClick() {
      const businessIdField = this.props.state.saveStatus.values.value.filter(value => value.key == "business-id")
      axios.get("http://localhost:8080/api/organisations/?organisationId=" + businessIdField[0].value).then(({ data })=> {

      this.changeFieldValue(data, "organization", "name" )
      this.changeFieldValue(data, "organization-postal-address", "address" )
      this.changeFieldValue(data, "organization-email", "email" )
      /*this.props.controller.componentOnChangeListener(FormUtil.findField(this.props.state, "organization"), data["name"])
      this.props.controller.componentOnChangeListener(FormUtil.findField(this.props.state, "organization-postal-address"), data["address"])
      this.props.controller.componentOnChangeListener(FormUtil.findField(this.props.state, "organization-email"), data["email"])*/

     })
    }

  render() {
    const state = this.props.state
    const formContainerClass = this.props.formContainerClass
    const headerElements = _.get(this.props, "headerElements", "")
    const containerId = _.get(this.props, "containerId", "container")
    const formElementProps = {
      controller: this.props.controller,
      state: state,
      infoElementValues: this.props.infoElementValues
    }
    const formElement = React.createElement(formContainerClass, formElementProps)

    return (
      <section id={containerId}>
        <a href="#" onClick={this.handleClick}>HAE Y-TUNNUKSELLA</a>
        {headerElements}
        {formElement}
      </section>
    )
  }
}
