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
})