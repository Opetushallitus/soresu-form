import React from 'react'
import _ from 'lodash'
import InputValueStorage from '../InputValueStorage'
import FieldUpdateHandler from '../FieldUpdateHandler'
import FormController from '../FormController.js'
import FormUtil from '../FormUtil.js'
import axios from 'axios'

export default class BusinessIdSearch extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.changeFieldValue = this.changeFieldValue.bind(this)
  }

  changeFieldValue(fieldName, newValue){
    this.props.controller.componentOnChangeListener(FormUtil.findField(this.props.state, fieldName), newValue)
  }

  handleClick() {
      console.log(this.props)
      const businessIdField = this.props.state.saveStatus.values.value.filter(value => value.key == "business-id")
      console.log(this.props.state)
      axios.get("http://localhost:8080/api/organisations/?organisation-id=" + businessIdField[0].value + "&language=" + this.props.state.configuration.lang).then(({ data })=> {
        this.changeFieldValue("organization", data["name"])
        this.changeFieldValue("organization-postal-address", data["contact"].address + " " + data["contact"]["postal-number"] + " " + data["contact"]["city"] )
        this.changeFieldValue("organization-email", data["email"] )
       })
      }

  render() {
    return (
        <a className="idbutton" href="#" onClick={this.handleClick}>Hae y-tunnuksella</a>
    )
  }
}
