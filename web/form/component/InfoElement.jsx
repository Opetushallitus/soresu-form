import React from 'react'
import moment from 'moment-timezone'

import ComponentFactory from '../ComponentFactory.js'
import LocalizedString from './LocalizedString.jsx'
import Translator from './../Translator.js'
import {InfoElementPropertyMapper, AccordionElementPropertyMapper} from './PropertyMapper.js'

export class BasicInfoComponent extends React.Component {
  static asDateString(date) {
    return moment(date).tz('Europe/Helsinki').format('D.M.YYYY')
  }

  static asTimeString(date) {
    return moment(date).tz('Europe/Helsinki').format('H.mm')
  }

  asDateTimeString(date) {
    const timeLimiter = new Translator(this.props.translations["misc"]).translate("time", this.props.lang, "KLO")
    return BasicInfoComponent.asDateString(date) + " " + timeLimiter + " " + BasicInfoComponent.asTimeString(date)
  }

  translatedValue(valueId) {
    const lang = this.props.lang
    const translations = this.props.translations
    const values = this.props.values
    const value = values[this.props.htmlId]
    if (translations && translations[valueId]) {
      return new Translator(translations).translate(valueId, lang)
    } else if (value && value[valueId]) {
      return new Translator(value).translate(valueId, lang)
    } else {
      return new Translator(values).translate(this.props.htmlId, lang)
    }
  }
}

export class H1InfoElement extends BasicInfoComponent {
  render() {
    return <h1>{this.translatedValue('text')}</h1>
  }
}

export class H3InfoElement extends BasicInfoComponent {
  render() {
    return <h3>{this.translatedValue('text')}</h3>
  }
}

export class ParagraphInfoElement extends BasicInfoComponent {
  render() {
    return <p className="soresu-info-element">{this.translatedValue('text')}</p>
  }
}

export class AccordionInfoElement extends BasicInfoComponent {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = { open: this.props.renderingParameters.initiallyOpen }
  }

  handleClick() {
    this.setState({
      open: !this.state.open
    })
  }

  static determineCssClass(isOpen) {
    return isOpen ? "open" : "closed"
  }

  render() {
    const values = this.props.values
    const key = this.props.htmlId
    const lang = this.props.lang
    const items = []
    var infoObject = values[this.props.htmlId]
    for (var i=0; i < infoObject.items.length; i++) {
      const textContent = infoObject.items[i][lang]
      items.push((<li key={key + "." + i}>{textContent}</li>))
    }
    const accordionStateClassName = AccordionInfoElement.determineCssClass(this.state.open)
    return (
        <div>
          <span onClick={this.handleClick} className={"accordion-title opener-handle " + accordionStateClassName}>{super.translatedValue('label')}</span>
          <div className={"accordion " + accordionStateClassName}>
            <ul id={key}>
                {items}
            </ul>
          </div>
        </div>)
  }
}

export class DateRangeInfoElement extends BasicInfoComponent {
  render() {
    const values = this.props.values
    const value = values[this.props.htmlId]
    const start = new Date(value.start)
    const startDateTime = this.asDateTimeString(start)
    const end = new Date(value.end)
    const endDateTime = this.asDateTimeString(end)

    return (
      <div>
        {this.translatedValue('label')} {startDateTime} — {endDateTime}
      </div>
    )
  }
}

export class EndOfDateRangeInfoElement extends BasicInfoComponent {
  render() {
    const values = this.props.values
    const value = values[this.props.htmlId]
    const end = new Date(value.end)
    const endDateTime = this.asDateTimeString(end)
    return (
      <div>
        <label>{this.translatedValue('label')}</label>
        <span>{endDateTime}</span>
      </div>
    )
  }
}

export default class InfoElement extends React.Component {
  constructor(props) {
    super(props)
    const fieldTypeMapping = {
      "h1": H1InfoElement,
      "h3": H3InfoElement,
      "p": ParagraphInfoElement,
      "bulletList": AccordionInfoElement,
      "dateRange": DateRangeInfoElement,
      "endOfDateRange": EndOfDateRangeInfoElement
    }
    const fieldPropertyMapping = {
      "h1": InfoElementPropertyMapper,
      "h3": InfoElementPropertyMapper,
      "p": InfoElementPropertyMapper,
      "bulletList": AccordionElementPropertyMapper,
      "dateRange": InfoElementPropertyMapper,
      "endOfDateRange": InfoElementPropertyMapper
    }
    this.componentFactory = new ComponentFactory({ fieldTypeMapping: fieldTypeMapping, fieldPropertyMapperMapping: fieldPropertyMapping })
  }

  render() {
    return this.componentFactory.createComponent(this.props)
  }
}
