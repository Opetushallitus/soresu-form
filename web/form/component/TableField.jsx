import _ from 'lodash'
import React from 'react'
import ClassNames from 'classnames'

import TableFieldUtil from './TableFieldUtil.jsx'

export default class TableField extends React.Component {
  render() {
    const {
      cellOnChange,
      cellOnBlur,
      rowOnRemove,
      rowParams,
      columnParams,
      columnSums,
      values,
      disabled,
      translations,
      lang
    } = this.props

    const isGrowingTable = _.isEmpty(rowParams)
    const lastColIndex = columnParams.length - 1
    const lastRowIndex = values.length - 1

    const makeInputOnBlur = (rowIndex, colIndex) => event => {
      event.stopPropagation()
      cellOnBlur(event.currentTarget.value, rowIndex, colIndex)
    }

    const makeInputOnChange = (rowIndex, colIndex) => event => {
      event.stopPropagation()
      cellOnChange(event.currentTarget.value, rowIndex, colIndex)
    }

    const makeRowOnRemove = rowIndex => event => {
      event.stopPropagation()
      rowOnRemove(rowIndex)
    }

    const makeValueCellClassNames = (rowIndex, colIndex) =>
      ClassNames("soresu-table__value-cell", {
        "soresu-table__value-cell--number": columnParams[colIndex].calculateSum,
        "soresu-table__value-cell--placeholder": isGrowingTable && rowIndex === lastRowIndex
      })

    const makeValueCell = (cell, rowIndex, colIndex) =>
      <td className={makeValueCellClassNames(rowIndex, colIndex)}
          key={`cell-${rowIndex}-${colIndex}`}>
        <div className="soresu-table__cell-positioner">
          <input type="text"
                 size="20"
                 value={cell}
                 disabled={disabled}
                 onBlur={!disabled && makeInputOnBlur(rowIndex, colIndex)}
                 onChange={!disabled && makeInputOnChange(rowIndex, colIndex)}
                 />
          {isGrowingTable && colIndex === lastColIndex && rowIndex !== lastRowIndex && (
            <button type="button"
                    className="soresu-table__remove-row-button soresu-remove"
                    tabIndex="-1"
                    onClick={!disabled && makeRowOnRemove(rowIndex)}
                    />
          )}
        </div>
      </td>

    return TableFieldUtil.makeTable({
      rowParams,
      columnParams,
      columnSums,
      values,
      translations,
      lang,
      makeValueCell
    })
  }
}
