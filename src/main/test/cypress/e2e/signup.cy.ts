import { faker } from '@faker-js/faker'
import * as formHelper from '../support/form-helper'
import * as http from '../support/__mocks__/login-mocks'

const simulateValidSubmit = (): void => {
  cy.getByTestId('email').type(faker.internet.email())
  cy.getByTestId('password').type(faker.random.alphaNumeric(5))
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
})