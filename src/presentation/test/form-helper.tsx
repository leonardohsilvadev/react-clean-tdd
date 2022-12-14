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
  validationError?: string
): void => {
  const fieldStatus = getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Ok')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}