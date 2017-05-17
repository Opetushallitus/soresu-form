import _ from 'lodash'
import React from 'react'
import ClassNames from 'classnames'

import TableFieldUtil from '../component/TableFieldUtil.jsx'

export default class TableValue extends React.Component {
  render() {
    const {
      rowParams,
      columnParams,
      columnSums,
      values,
      translations,
      lang
    } = this.props

    const makeValueCellClassNames = (rowIndex, colIndex) =>
      ClassNames("soresu-table__value-cell soresu-table__value-cell--preview", {
        "soresu-table__value-cell--number": columnParams[colIndex].calculateSum
      })

    const makeValueCell = (cell, rowIndex, colIndex) =>
      <td className={makeValueCellClassNames(rowIndex, colIndex)}
          key={`cell-${rowIndex}-${colIndex}`}>
        {cell}
      </td>

    return TableFieldUtil.makeTable({
      rowParams,
      columnParams,
      columnSums,
      values,
      translations,
      lang,
      makeValueCell,
      tableClassNames: "soresu-table--preview",
      columnTitleCellClassNames: "soresu-table__column-title-cell--preview",
      rowTitleCellClassNames: "soresu-table__row-title-cell--preview",
      sumCellClassNames: "soresu-table__sum-cell--preview"
    })
  }
}
