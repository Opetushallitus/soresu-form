import React from 'react'
import Translator from '../Translator'
import BasicFieldComponent from './BasicFieldComponent.jsx'

export default class RadioButton extends BasicFieldComponent {
  render() {
    const props = this.props;
    const radiobuttons = [];
    const classStr = this.resolveClassName()

    if (props.options) {
      for (var i=0; i < props.options.length; i++) {
        const label = new Translator(props.options[i]).translate("label", props.lang, props.options[i].value)
        radiobuttons.push(<input type="radio" id={props.htmlId + ".radio." + i}
                                 key={props.htmlId + "." + props.options[i].value}
                                 name={props.htmlId}
                                 disabled={props.disabled}
                                 value={props.options[i].value}
                                 onChange={props.onChange}
                                 checked={props.options[i].value === props.value} />)
        radiobuttons.push(
          <label key={props.htmlId + "." + props.options[i].value + ".label"}
                 className={classStr}
                 htmlFor={props.htmlId + ".radio." + i}>
            {label}
          </label>
        )
      }
    }
    return (<div className="soresu-radio">
      {this.label()}
      {radiobuttons}
    </div>)
  }
}
