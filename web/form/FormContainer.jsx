import React from 'react'
import _ from 'lodash'
import InputValueStorage from './InputValueStorage'
import FieldUpdateHandler from './FieldUpdateHandler'
import FormController from './FormController.js'
import FormUtil from './FormUtil.js'
import axios from 'axios'
import BusinessIdSearch from './component/BusinessIdSearch.jsx'

import FormPreview from './FormPreview.jsx'

export default class FormContainer extends React.Component {
  constructor(props) {
  super(props)
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
        {headerElements}
        {formElement}
      <BusinessIdSearch state={this.props.state} controller={this.props.controller}/>
      </section>
    )
  }
}
