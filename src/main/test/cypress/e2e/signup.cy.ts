import { faker } from '@faker-js/faker'
import * as formHelper from '../support/form-helper'
import * as http from '../support/__mocks__/signup-mocks'

const simulateValidSubmit = (): void => {
  const password = faker.random.alphaNumeric(7)
  cy.getByTestId('name').type(faker.name.fullName())
  cy.getByTestId('email').type(faker.internet.email())
  cy.getByTestId('password').type(password)
  cy.getByTestId('passwordConfirmation').type(password)
  cy.getByTestId('submit').click()
}

describe('Signup', () => {
  beforeEach(() => cy.visit('signup'))

  it('Should load with correct initial state', () => {
    formHelper.testInputStatus('name', 'Campo obrigatório')
    formHelper.testInputStatus('email', 'Campo obrigatório')
    formHelper.testInputStatus('password', 'Campo obrigatório')
    formHelper.testInputStatus('passwordConfirmation', 'Campo obrigatório')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('name').type(faker.random.alphaNumeric(3))
    formHelper.testInputStatus('name', 'Valor inválido')
    cy.getByTestId('email').type(faker.random.word())
    formHelper.testInputStatus('email', 'Valor inválido')
    cy.getByTestId('password').type(faker.random.alphaNumeric(3))
    formHelper.testInputStatus('password', 'Valor inválido')
    cy.getByTestId('passwordConfirmation').type(faker.random.alphaNumeric(4))
    formHelper.testInputStatus('passwordConfirmation', 'Valor inválido')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    const password = faker.random.alphaNumeric(5)
    cy.getByTestId('name').type(faker.name.fullName())
    formHelper.testInputStatus('name')
    cy.getByTestId('email').type(faker.internet.email())
    formHelper.testInputStatus('email')
    cy.getByTestId('password').type(password)
    formHelper.testInputStatus('password')
    cy.getByTestId('passwordConfirmation').type(password)
    formHelper.testInputStatus('passwordConfirmation')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present EmailInUseError on 403', () => {
    http.mockEmailInUseError()
    simulateValidSubmit()
    formHelper.testMainError('Esse e-mail já está sendo usado')
    formHelper.testUrl('/signup')
  })

  it('Should present UnexpectedError on default error cases', () => {
    http.mockUnexpectedError()
    simulateValidSubmit()
    formHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    formHelper.testUrl('/signup')
  })

  it('Should present UnexpectedError if invalid data is returned', () => {
    http.mockInvalidData()
    simulateValidSubmit()
    formHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    formHelper.testUrl('/signup')
  })
})