import React from 'react'
import SignUp from "./signup"
import { RenderResult, render } from '@testing-library/react'
import { FormHelper } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(
    // <Router location={history.location} navigator={history}>
      <SignUp />
    // </Router>
  )
  return { sut }
}

describe('SignUp Component', () => {
  test('Should start with initial state', () => {
    const { sut: { getByTestId } } = makeSut()
    const validationError = 'Campo obrigatório'

    FormHelper.testChildCount(getByTestId, 'error-wrap', 0)
    FormHelper.testButtonIsDisabled(getByTestId, 'submit', true)
    FormHelper.testStatusForField(getByTestId, 'name', validationError)
    FormHelper.testStatusForField(getByTestId, 'email', validationError)
    FormHelper.testStatusForField(getByTestId, 'password', validationError)
    FormHelper.testStatusForField(getByTestId, 'passwordConfirmation', validationError)
  })
})