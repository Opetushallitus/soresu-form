const form = require.context("./web/form", /*useSubdirectories*/ false)
const component = require.context("./web/form/component", /*useSubdirectories*/ true)
const edit = require.context("./web/form/edit", /*useSubdirectories*/ true)
const img = require.context("./web/form/img", /*useSubdirectories*/ true)
const preview = require.context("./web/form/preview", /*useSubdirectories*/ true)
const style = require.context("./web/form/style", /*useSubdirectories*/ true)

const f = x => x.keys().map(x)

const exports = {
  form: f(form),
  component: f(component),
  edit: f(edit),
  img: f(img),
  preview: f(preview),
  style: f(style)
}

module.exports = exports
