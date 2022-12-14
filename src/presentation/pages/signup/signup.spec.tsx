import React from 'react'
import { faker } from '@faker-js/faker'
import { RenderResult, render, cleanup, fireEvent } from '@testing-library/react'
import SignUp from "./signup"
import { FormHelper, ValidationStub } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    // <Router location={history.location} navigator={history}>
      <SignUp
        validation={validationStub}
      />
    // </Router>
  )
  return { sut }
}

describe('SignUp Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })

    FormHelper.testChildCount(getByTestId, 'error-wrap', 0)
    FormHelper.testButtonIsDisabled(getByTestId, 'submit', true)
    FormHelper.testStatusForField(getByTestId, 'name', validationError)
    FormHelper.testStatusForField(getByTestId, 'email', 'Campo obrigatório')
    FormHelper.testStatusForField(getByTestId, 'password', 'Campo obrigatório')
    FormHelper.testStatusForField(getByTestId, 'passwordConfirmation', 'Campo obrigatório')
  })

  test('Should show name error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    FormHelper.populateField(getByTestId, 'name')
    FormHelper.testStatusForField(getByTestId, 'name', validationError)
  })
})