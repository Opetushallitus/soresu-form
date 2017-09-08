import React from 'react'
import BasicSizedComponent from './BasicSizedComponent.jsx'
import BusinessIdSearch from './BusinessIdSearch.jsx'

export default class BasicTextField extends BasicSizedComponent {
  constructor(props) {
    super(props)
    this.inputType = "text"
  }

  baseClassName() {
    return "soresu-text-field"
    console.log(this.props.state)
  }

  render() {
    const props = this.props
    const sizeNumber = Number.isInteger(props.size) ? props.size : undefined
    const classStr = this.resolveClassName()
    return (<div className={this.resolveClassName(this.baseClassName())}>
      {this.label(classStr)}
      <input
        type={this.inputType}
        className={classStr}
        size={sizeNumber}
        id={props.htmlId}
        name={props.htmlId}
        maxLength={props.maxLength}
        value={props.value}
        disabled={props.disabled}
        onBlur={props.onBlur}
        onChange={props.onChange}
        />
      {(this.props.htmlId == "business-id") && <BusinessIdSearch state={this.props.state} controller={this.props.controller}/>}
    </div>)
  }
}
