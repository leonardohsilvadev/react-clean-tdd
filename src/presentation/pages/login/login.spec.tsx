import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { faker } from '@faker-js/faker';
import { ValidationStub, AuthenticationSpy, SaveAccessTokenMock } from '@/presentation/test'
import { Login } from '@/presentation/pages'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
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
  const saveAccessTokenMock = new SaveAccessTokenMock()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router location={history.location} navigator={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )
  return { sut, authenticationSpy, saveAccessTokenMock }
}

const simulateValidSubmit = async (
  getByTestId,
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  populateEmailField(getByTestId, email)
  populatePasswordField(getByTestId, password)
  const form = getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
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

const testStatusForField = (
  getByTestId,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Ok')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

const testButtonIsDisabled = (
  getByTestId,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

const testErrorWrapChildCount = (
  getByTestId,
  count: number
): void => {
  const errorWrap = getByTestId('error-wrap')
  expect(errorWrap.childElementCount).toBe(count)
}

const testElementExists = (
  getByTestId,
  fieldName: string
): void => {
  const el = getByTestId(fieldName)
  expect(el).toBeTruthy()
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })

    testErrorWrapChildCount(getByTestId, 0)

    testButtonIsDisabled(getByTestId, 'submit', true)

    testStatusForField(getByTestId, 'email', validationError)
    testStatusForField(getByTestId, 'password', validationError)
  })

  test('Should show email error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    populateEmailField(getByTestId)
    testStatusForField(getByTestId, 'email', validationError)
  })

  test('Should show password error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    populatePasswordField(getByTestId)
    testStatusForField(getByTestId, 'password', validationError)
  })

  test('Should show valid email state if validation succeeds', () => {
    const { sut: { getByTestId } } = makeSut()
    populateEmailField(getByTestId)
    testStatusForField(getByTestId, 'email')
  })

  test('Should show valid password state if validation succeeds', () => {
    const { sut: { getByTestId } } = makeSut()
    populatePasswordField(getByTestId)
    testStatusForField(getByTestId, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut: { getByTestId } } = makeSut()
    populateEmailField(getByTestId)
    populatePasswordField(getByTestId)
    testButtonIsDisabled(getByTestId, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { sut: { getByTestId } } = makeSut()
    await simulateValidSubmit(getByTestId)
    testElementExists(getByTestId, 'spinner')
  })

  test('Should call Authentication with correct values', async () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(getByTestId, email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('Should call Authentication only once', async () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    await simulateValidSubmit(getByTestId)
    await simulateValidSubmit(getByTestId)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId }, authenticationSpy } = makeSut({ validationError })
    await simulateValidSubmit(getByTestId)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  // test('Should present error if Authentication fails', async () => {
  //   const { sut: { getByTestId }, authenticationSpy } = makeSut()
  //   const error = new InvalidCredentialsError()
  //   jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
  //   await simulateValidSubmit(getByTestId)
  //   const mainError = getByTestId('main-error')

  //   expect(mainError.textContent).toBe(error.message)
  // testErrorWrapChildCount(getByTestId, 1)
  // })

  test('Should call SaveAccessToken on success', async () => {
    const { sut: { getByTestId }, authenticationSpy, saveAccessTokenMock } = makeSut()
    await simulateValidSubmit(getByTestId)
    expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
  })

  test('Should go to signup page', () => {
    const { sut: { getByTestId } } = makeSut()
    const signup = getByTestId('signup')
    fireEvent.click(signup)
    expect(history.index).toBe(1)
    expect(history.location.pathname).toBe('/signup')
  })
})