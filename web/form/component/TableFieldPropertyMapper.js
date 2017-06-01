import _ from 'lodash'

import {DefaultPropertyMapper} from './PropertyMapper'
import MathUtil from '../MathUtil'

export default class TableFieldPropertyMapper {
  static map(props) {
    const {lang, field, disabled, onChange} = props

    const makeRowParams = paramRows =>
      _.map(paramRows, row => _.assign({}, row, {title: row.title[lang]}))

    const makeColumnParams = paramColumns =>
      _.map(paramColumns, col => _.assign({}, col, {title: col.title[lang]}))

    const rowParams = makeRowParams(DefaultPropertyMapper.param(field, "rows", []))
    const columnParams = makeColumnParams(DefaultPropertyMapper.param(field, "columns", []))
    const values = makeValues(disabled, rowParams.length, columnParams.length, parseSavedValue(_.get(props, "value", [])))
    const isGrowingTable = _.isEmpty(rowParams) && !disabled
    const columnSums = makeColumnSums(isGrowingTable, columnParams, values)

    const cellOnChange = disabled ? null : (cellValue, cellRowIndex, cellColIndex) => {
      const prunedValues = isGrowingTable && cellRowIndex < values.length - 1
        ? _.initial(values)  // for growing table, prune last row with empty values from save
        : values

      const newValues = _.map(prunedValues, (row, rowIndex) => {
        const rowCopy = row.slice(0)
        if (rowIndex === cellRowIndex) {
          rowCopy[cellColIndex] = cellValue
        }
        return rowCopy
      })

      onChange(field, newValues)
    }

    const cellOnBlur = disabled ? null : (cellValue, cellRowIndex, cellColIndex) => {
      if (cellValue === values[cellRowIndex][cellColIndex]) {
        return  // no change, skip
      }

      cellOnChange(cellValue, cellRowIndex, cellColIndex)
    }

    const rowOnRemove = disabled ? null : rowIndexToRemove => {
      const numRows = values.length - (isGrowingTable ? 1 : 0) // for growing table, remove last row with empty values
      const newValues = _.filter(values, (_row, rowIndex) => rowIndex !== rowIndexToRemove && rowIndex < numRows)

      onChange(field, newValues)
    }

    return _.assign({}, props, {
      cellOnChange,
      cellOnBlur,
      rowOnRemove,
      rowParams,
      columnParams,
      columnSums,
      values,
      translations: props.translations.form["table-field"]
    })
  }
}

const ensureArraySize = (size, fillValue, ary) => {
  const numMissingValues = size - ary.length

  if (numMissingValues == 0) {
    return ary
  } else if (numMissingValues > 0) {
    return ary.concat(_.fill(Array(numMissingValues), fillValue))
  } else {
    return ary.slice(0, size)
  }
}

const parseSavedValue = value =>
  _.isEmpty(value)
    ? []  // ensure empty string or array coerces to empty array
    : value


const makeValues = (disabled, numFixedRows, numColumns, savedValues) => {
  let rows = numFixedRows > 0
    ? ensureArraySize(numFixedRows, [], savedValues)
    : (disabled
        ? savedValues                // for disabled growing table, change nothing
        : savedValues.concat([[]]))  // for non-disabled growing table, add empty row

  return _.map(rows, row => ensureArraySize(numColumns, "", row))
}

const makeColumnSums = (isGrowingTable, columnParams, values) => {
  const sums = {}
  const numColumns = columnParams.length
  const numRows = values.length - (isGrowingTable ? 1 : 0)  // last row is empty anyway for growing table

  for (let rowIndex = 0; rowIndex < numRows; rowIndex += 1) {
    for (let colIndex = 0; colIndex < numColumns; colIndex += 1) {
      if (columnParams[colIndex].calculateSum) {
        const sum = sums[colIndex] || 0
        sums[colIndex] = sum + (MathUtil.parseDecimal(values[rowIndex][colIndex]) || 0)
      }
    }
  }

  return _.mapValues(sums, d => MathUtil.formatDecimal(MathUtil.roundDecimal(d, 1)))
}
