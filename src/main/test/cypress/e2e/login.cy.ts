import { faker } from '@faker-js/faker'
import * as formHelper from '../support/form-helper'
import * as http from './login-mocks'

const simulateValidSubmit = (): void => {
  cy.getByTestId('email').type(faker.internet.email())
  cy.getByTestId('password').type(faker.random.alphaNumeric(5))
  cy.getByTestId('submit').click()
}

describe('Login', () => {
  beforeEach(() => cy.visit('login'))

  it('Should load with correct initial state', () => {
    formHelper.testInputStatus('email', 'Campo obrigatório')
    formHelper.testInputStatus('password', 'Campo obrigatório')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').type(faker.random.word())
    formHelper.testInputStatus('email', 'Valor inválido')
    cy.getByTestId('password').type(faker.random.alphaNumeric(3))
    formHelper.testInputStatus('password', 'Valor inválido')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').type(faker.internet.email())
    formHelper.testInputStatus('email')
    cy.getByTestId('password').type(faker.random.alphaNumeric(5))
    formHelper.testInputStatus('password')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present InvalidCredentialsError on 401', () => {
    http.mockInvalidCredentialsError()
    simulateValidSubmit()
    formHelper.testMainError('Credenciais inválidas')
    formHelper.testUrl('/login')
  })

  it('Should present UnexpectedError on default error cases', () => {
    http.mockUnexpectedError()
    simulateValidSubmit()
    formHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    formHelper.testUrl('/login')
  })

  it('Should present UnexpectedError if invalid data is returned', () => {
    http.mockInvalidData()
    simulateValidSubmit()
    formHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    formHelper.testUrl('/login')
  })

  it('Should present save accessToken if valid credentials are provided', () => {
    http.mockOk()
    simulateValidSubmit()
    cy.getByTestId('main-error').should('not.exist')
    cy.getByTestId('spinner').should('not.exist')
    formHelper.testUrl('/')
    formHelper.testLocalStorageItem('accessToken')
  })

  it('Should prevent multiple submits', () => {
    http.mockOk()
    cy.getByTestId('email').type(faker.internet.email())
    cy.getByTestId('password').type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').dblclick()
    formHelper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    http.mockOk()
    cy.getByTestId('email').type(faker.internet.email()).type('{enter}')
    formHelper.testHttpCallsCount(0)
  })
})