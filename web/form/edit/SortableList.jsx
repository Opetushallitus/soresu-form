import React from 'react'
import {SortableContainer, SortableElement} from 'react-sortable-hoc'
import CSSTransitionGroup from '../component/wrapper/CSSTransitionGroup.jsx'

const handleShouldCancelStart = (e) => e.target.className.indexOf("soresu-field-move") === -1

const SortableItem = SortableElement((props) =>
  <div>{props.value}</div>
)

const SortableListContainer = SortableContainer((props) =>
  <CSSTransitionGroup transitionName={props.transitionName}>
    {props.items.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={props.renderItem(value)} />
    ))}
  </CSSTransitionGroup>
)


export default class SortableList extends React.Component {
  render() {
    return <SortableListContainer {...this.props} shouldCancelStart={handleShouldCancelStart} />
  }
}


