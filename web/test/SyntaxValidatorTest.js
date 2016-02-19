import { expect } from 'chai'
import SyntaxValidator from '../form/SyntaxValidator'

describe('Syntax validator', function() {
  it('can validate a normal finnish business id', function() {
    expect(SyntaxValidator.validateBusinessId("1629284-5")).to.equal(undefined)
  })
  it('can validate a finnish business id with 0 checksum', function() {
    expect(SyntaxValidator.validateBusinessId("0165761-0")).to.equal(undefined)
  })
  it('can validate a finnish business id with 1 checksum', function() {
    expect(SyntaxValidator.validateBusinessId("0208201-1")).to.equal(undefined)
  })
  it('notices wrong format of finnish business id', function() {
    const result = SyntaxValidator.validateBusinessId("165761-0")
    expect(result).to.have.property("error")
    expect(result.error).to.equal("finnishBusinessId")
  })
  it('notices wrong checksum in finnish business id', function() {
    const result = SyntaxValidator.validateBusinessId("1629284-6")
    expect(result).to.have.property("error")
    expect(result.error).to.equal("finnishBusinessId")
  })
  it('can validate basic email', function() {
    expect(SyntaxValidator.validateEmail("valid.email@example.com")).to.equal(undefined)
  })
  it('notices invalid email with only one domain part', function() {
    const result = SyntaxValidator.validateEmail("invalid.email@example")
    expect(result).to.have.property("error")
    expect(result.error).to.equal("email")
  })
  it('notices invalid email with space between', function() {
    const result = SyntaxValidator.validateEmail("invalid. email@example.com")
    expect(result).to.have.property("error")
    expect(result.error).to.equal("email")
  })
})
