import { faker } from "@faker-js/faker"
import { fireEvent } from "@testing-library/react"

export const testButtonIsDisabled = (
  getByTestId,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export const testChildCount = (
  getByTestId,
  fieldName: string,
  count: number
): void => {
  const el = getByTestId(fieldName)
  expect(el.childElementCount).toBe(count)
}

export const testStatusForField = (
  getByTestId,
  fieldName: string,
  validationError: string = ''
): void => {
  const field = getByTestId(`${fieldName}`)
  const wrap = getByTestId(`${fieldName}-wrap`)
  const label = getByTestId(`${fieldName}-label`)
  expect(field.title).toBe(validationError)
  expect(label.title).toBe(validationError)
  expect(wrap.getAttribute('data-status')).toBe(validationError ? 'invalid' : 'valid')
}

export const populateField = (
  getByTestId,
  fieldName: string,
  value = faker.random.word()
): void => {
  const input = getByTestId(fieldName)
  fireEvent.input(input, { target: { value } })
}

export const testElementExists = (
  getByTestId,
  fieldName: string
): void => {
  const el = getByTestId(fieldName)
  expect(el).toBeTruthy()
}