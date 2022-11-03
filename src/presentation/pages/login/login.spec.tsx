import 'jest-localstorage-mock'
import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { faker } from '@faker-js/faker';
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import Login from './login'
import { InvalidCredentialsError } from '@/domain/errors'
import { BrowserRouter } from 'react-router-dom'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const mockedUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUseNavigate
}))

const history = createMemoryHistory()

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router location={history.location} navigator={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  )
  return { sut, authenticationSpy }
}

const simulateValidSubmit = (
  getByTestId,
  email = faker.internet.email(),
  password = faker.internet.password()
  ): void => {
  populateEmailField(getByTestId, email)
  populatePasswordField(getByTestId, password)
  const submitButton = getByTestId('submit')
  fireEvent.click(submitButton)
}

const populateEmailField = (
  getByTestId,
  email = faker.internet.email()
): void => {
  const emailInput = getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (
  getByTestId,
  password = faker.internet.password()
): void => {
  const passwordInput = getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateStatusForField = (
  getByTestId,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Ok')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

describe('Login Component', () => {
  afterEach(cleanup)
  beforeEach(() => localStorage.clear())

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })

    const errorWrap = getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(0)

    const submitButton = getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeTruthy()

    simulateStatusForField(getByTestId, 'email', validationError)
    simulateStatusForField(getByTestId, 'password', validationError)
  })

  test('Should show email error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    populateEmailField(getByTestId)
    simulateStatusForField(getByTestId, 'email', validationError)
  })

  test('Should show password error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    populatePasswordField(getByTestId)
    simulateStatusForField(getByTestId, 'password', validationError)
  })

  test('Should show valid email state if validation succeeds', () => {
    const { sut: { getByTestId } } = makeSut()
    populateEmailField(getByTestId)
    simulateStatusForField(getByTestId, 'email')
  })

  test('Should show valid password state if validation succeeds', () => {
    const { sut: { getByTestId } } = makeSut()
    populatePasswordField(getByTestId)
    simulateStatusForField(getByTestId, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut: { getByTestId } } = makeSut()
    populateEmailField(getByTestId)
    populatePasswordField(getByTestId)
    const submitButton = getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeFalsy()
  })

  test('Should show spinner on submit', () => {
    const { sut: { getByTestId } } = makeSut()
    simulateValidSubmit(getByTestId)
    const spinner = getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('Should call Authentication with correct values', () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(getByTestId, email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('Should call Authentication only once', () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    simulateValidSubmit(getByTestId)
    simulateValidSubmit(getByTestId)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId }, authenticationSpy } = makeSut({ validationError })
    populateEmailField(getByTestId)
    fireEvent.submit(getByTestId('form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })

  // test('Should present error if Authentication fails', async () => {
  //   const { sut: { getByTestId }, authenticationSpy } = makeSut()
  //   const error = new InvalidCredentialsError()
  //   jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
  //   simulateValidSubmit(getByTestId)
  //   const errorWrap = getByTestId('error-wrap')
  //   await waitFor(() => errorWrap) 
  //   const mainError = getByTestId('main-error')

  //   expect(mainError.textContent).toBe(error.message)
  //   expect(errorWrap.childElementCount).toBe(1)
  // })

  // test('Should add access token to localstorage on success', async () => {
  //   const { sut: { getByTestId }, authenticationSpy } = makeSut()
  //   simulateValidSubmit(getByTestId)
  //   await waitFor(() => getByTestId('form'))
  //   expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
  // })

  test('Should go to signup page', () => {
    const { sut: { getByTestId } } = makeSut()
    const signup = getByTestId('signup')
    fireEvent.click(signup)
    expect(history.index).toBe(1)
    expect(history.location.pathname).toBe('/signup')
  })
})