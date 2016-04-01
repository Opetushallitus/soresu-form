const form = require.context("./web/form", /*useSubdirectories*/ true)
//const component = require.context("./web/form/component", /*useSubdirectories*/ true)
//const edit = require.context("./web/form/edit", /*useSubdirectories*/ true)
//const img = require.context("./web/form/img", /*useSubdirectories*/ true)
//const preview = require.context("./web/form/preview", /*useSubdirectories*/ true)
//const style = require.context("./web/form/style", /*useSubdirectories*/ true)

module.exports =
  form.keys().map(form)

