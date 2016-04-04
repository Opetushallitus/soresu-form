import Immutable from 'seamless-immutable'
import _ from 'lodash'

const form = require.context("./form", /*useSubdirectories*/ false)
const component = require.context("./form/component", /*useSubdirectories*/ true)
const edit = require.context("./form/edit", /*useSubdirectories*/ true)
const img = require.context("./form/img", /*useSubdirectories*/ true)
const preview = require.context("./form/preview", /*useSubdirectories*/ true)
const style = require.context("./form/style", /*useSubdirectories*/ true)

const asName = (name) =>
      _.chain(/\.\/(.*)\.jsx?/.exec(name))
      .drop(1)
      .take(1)
      .first()
      .value() || name

const f = context => {
  return Immutable(context.keys())
    .asObject(key => {
      const lib = context(key)
      const name = lib.name
      return [name ? name : asName(key), lib]})
    .asMutable()
}

module.exports = {
  form: f(form),
  component: f(component),
  edit: f(edit),
  img: f(img),
  preview: f(preview),
  style: f(style)
}
