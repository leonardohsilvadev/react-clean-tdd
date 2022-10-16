import React from 'react'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import { faker } from '@faker-js/faker';
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import Login from './login'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(<Login validation={validationStub} authentication={authenticationSpy} />)
  return { sut, authenticationSpy }
}

describe('Login Component', () => {
  afterEach(cleanup)
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })

    const errorWrap = getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(0)

    const submitButton = getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeTruthy()

    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show email error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    const emailInput = getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')
  })

  test('Should show password error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    const passwordInput = getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show valid email state if validation succeeds', () => {
    const { sut: { getByTestId } } = makeSut()
    const emailInput = getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe('Ok')
    expect(emailStatus.textContent).toBe('🟢')
  })

  test('Should show valid password state if validation succeeds', () => {
    const { sut: { getByTestId } } = makeSut()
    const passwordInput = getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe('Ok')
    expect(passwordStatus.textContent).toBe('🟢')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut: { getByTestId } } = makeSut()
    const passwordInput = getByTestId('email')
    fireEvent.input(passwordInput, { target: { value: faker.internet.email() } })
    const emailInput = getByTestId('password')
    fireEvent.input(emailInput, { target: { value: faker.internet.password() } })
    const submitButton = getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeFalsy()
  })

  test('Should show spinner on submit', () => {
    const { sut: { getByTestId } } = makeSut()
    const passwordInput = getByTestId('email')
    fireEvent.input(passwordInput, { target: { value: faker.internet.email() } })
    const emailInput = getByTestId('password')
    fireEvent.input(emailInput, { target: { value: faker.internet.password() } })
    const submitButton = getByTestId('submit')
    fireEvent.click(submitButton)
    const spinner = getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('Should call Authentication with correct values', () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const passwordInput = getByTestId('email')
    fireEvent.input(passwordInput, { target: { value: email } })
    const emailInput = getByTestId('password')
    const password = faker.internet.password()
    fireEvent.input(emailInput, { target: { value: password } })
    const submitButton = getByTestId('submit')
    fireEvent.click(submitButton)
    expect(authenticationSpy.params).toEqual({ email, password })
  })
})