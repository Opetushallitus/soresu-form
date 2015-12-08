import React from 'react'
import ReactWidgets from 'react-widgets'

import Translator from '../Translator'
import BasicFieldComponent from './BasicFieldComponent.jsx'

export default class Dropdown extends BasicFieldComponent {
  render() {
    const props = this.props
    const optionToText = option => {
      return new Translator(option).translate("label", props.lang, option.value)
    }
    const messages = {
      filterPlaceholder: '',
      emptyList: 'Ei vaihtoehtoja',
      emptyFilter: 'Ei tuloksia'
    }
    const OptionEntry = React.createClass({
      render() {
        return <span>{optionToText(this.props.item)}</span>
      }
    })

    return (<div className="soresu-dropdown">
      {this.label()}
      <ReactWidgets.DropdownList id={props.htmlId}
                                 name={props.htmlId}
                                 disabled={props.disabled}
                                 onChange={props.onChange}
                                 data={props.options}
                                 defaultValue={props.value}
                                 valueField="value"
                                 textField={optionToText}
                                 valueComponent={OptionEntry}
                                 caseSensitive={false}
                                 minLength={1}
                                 filter="contains"
                                 duration={0}
                                 messages={messages}
                                 onToggle={null}/>
    </div>)
  }
}
