import React from 'react'
import _ from 'lodash'
import InputValueStorage from './InputValueStorage'
import FieldUpdateHandler from './FieldUpdateHandler'
import axios from 'axios'

import FormPreview from './FormPreview.jsx'

export default class FormContainer extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
      const businessIdField = this.props.state.saveStatus.values.value.filter(value => value.key == "business-id")
      axios.get("http://localhost:8080/api/organisations/?organisationId=" + businessIdField[0].value).then(({ data })=> {
        /*Esimerkiksi vain yritän tässä tuota datan nimikenttää päivittää ja tää siis vielä käyttää sitä vanhaa routea (ja toi urlikin tolleen tyhmästi vielä, koska default-api on täällä /api/avustushaku/jotain, niin testauksen vuoksi vain noin)*/
        console.log(data)
        const newName = data["name"]
        InputValueStorage.writeValue(this.props.state.configuration.form, this.props.state.saveStatus.values, FieldUpdateHandler.createFieldUpdate({id: "organisation", fieldClass: "formField", fieldType: "textField", value: newName}))
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
        <a href="#" onClick={this.handleClick}>Hae</a>
        {headerElements}
        {formElement}
      </section>
    )
  }
}
