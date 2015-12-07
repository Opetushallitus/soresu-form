import React, { Component } from 'react'
import _ from 'lodash'

import ReactWidgets from 'react-widgets'

import moment from 'moment-timezone'

import {EditComponent} from './EditComponent.jsx'

export default class KoodistoFieldEdit extends EditComponent {
  render() {
    const htmlId = this.props.htmlId
    const koodistos = this.props.koodistos
    const textEdit = super.renderTranslationTable(htmlId + "-text", "Teksti", x => x.text)
    const koodistoChoice = this.renderKoodistoChoice(htmlId + "-koodisto", "Koodisto", x => x.params, koodistos)
    return super.renderEditable(
      <div>
        {textEdit}
        <div>
          <div>Valitse koodisto</div>
          {koodistoChoice}
        </div>
      </div>
    )
  }

  renderKoodistoChoice(htmlId, name, valueGetter, koodistos) {
    const field = this.props.field
    if (koodistos.loading) {
      return <span>Ladataan...</span>
    }
    if (!koodistos.content) {
      if (this.props.koodistosLoader) {
        this.props.koodistosLoader()
      }
      return <span>Ei koodistoja.</span>
    }
    const koodistoSelectionOnChange = selectedKoodisto => {
      this.fieldValueUpdater(valueGetter, "koodisto", selectedKoodisto)()
    }
    return <KoodistoDropdown id={htmlId} name={name} koodisto={valueGetter(field).koodisto} koodistosList={koodistos.content} onChange={koodistoSelectionOnChange} />
  }
}

export class KoodistoDropdown extends Component {
  render() {
    const koodistosList = this.props.koodistosList
    const koodisto = this.props.koodisto
    const koodistoToText = koodistoItem => koodistoItem.name
    const onChange = this.props.onChange
    const defaultOpen = _.isUndefined(koodisto)
    const messages = {
      filterPlaceholder: '',
      emptyList: 'Ei koodistoja',
      emptyFilter: 'Ei tuloksia'
    }
    return <div className="koodisto-dropdown">
             <ReactWidgets.DropdownList  defaultOpen={defaultOpen}
                                         valueField="uri"
                                         textField={koodistoToText}
                                         data={koodistosList}
                                         defaultValue={koodisto}
                                         valueComponent={KoodistoEntry}
                                         caseSensitive={false}
                                         minLength={3}
                                         filter='contains'
                                         duration={0}
                                         onChange={onChange}
                                         messages={messages}
                                         placeholder="Valitse koodisto"/>
           </div>
  }
}

class KoodistoEntry extends React.Component {
  render() {
    const name = this.props.item.name
    return <span>{name}</span>
  }
}
