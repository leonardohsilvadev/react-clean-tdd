import React from 'react'
import { faker } from "@faker-js/faker"
import SignUp from "./signup"
import { RenderResult, render } from '@testing-library/react'

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

const testButtonIsDisabled = (
  getByTestId,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

const testChildCount = (
  getByTestId,
  fieldName: string,
  count: number
): void => {
  const el = getByTestId(fieldName)
  expect(el.childElementCount).toBe(count)
}

const testStatusForField = (
  getByTestId,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Ok')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

describe('SignUp Component', () => {
  test('Should start with initial state', () => {
    const { sut: { getByTestId } } = makeSut()
    const validationError = 'Campo obrigatório'

    testChildCount(getByTestId, 'error-wrap', 0)
    testButtonIsDisabled(getByTestId, 'submit', true)
    testStatusForField(getByTestId, 'name', validationError)
    testStatusForField(getByTestId, 'email', validationError)
    testStatusForField(getByTestId, 'password', validationError)
    testStatusForField(getByTestId, 'passwordConfirmation', validationError)
  })
})