import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { faker } from '@faker-js/faker';
import {
  ValidationStub,
  AuthenticationSpy,
  SaveAccessTokenMock,
  FormHelper
} from '@/presentation/test'
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
  FormHelper.populateField(getByTestId, 'email', email)
  FormHelper.populateField(getByTestId, 'password', password)
  const form = getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })

    FormHelper.testChildCount(getByTestId, 'error-wrap', 0)

    FormHelper.testButtonIsDisabled(getByTestId, 'submit', true)

    FormHelper.testStatusForField(getByTestId, 'email', validationError)
    FormHelper.testStatusForField(getByTestId, 'password', validationError)
  })

  test('Should show email error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    FormHelper.populateField(getByTestId, 'email')
    FormHelper.testStatusForField(getByTestId, 'email', validationError)
  })

  test('Should show password error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    FormHelper.populateField(getByTestId, 'password')
    FormHelper.testStatusForField(getByTestId, 'password', validationError)
  })

  test('Should show valid email state if validation succeeds', () => {
    const { sut: { getByTestId } } = makeSut()
    FormHelper.populateField(getByTestId, 'email')
    FormHelper.testStatusForField(getByTestId, 'email')
  })

  test('Should show valid password state if validation succeeds', () => {
    const { sut: { getByTestId } } = makeSut()
    FormHelper.populateField(getByTestId, 'password')
    FormHelper.testStatusForField(getByTestId, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut: { getByTestId } } = makeSut()
    FormHelper.populateField(getByTestId, 'email')
    FormHelper.populateField(getByTestId, 'password')
    FormHelper.testButtonIsDisabled(getByTestId, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { sut: { getByTestId } } = makeSut()
    await simulateValidSubmit(getByTestId)
    FormHelper.testElementExists(getByTestId, 'spinner')
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
    const signupLink = getByTestId('signup-link')
    fireEvent.click(signupLink)
    expect(history.index).toBe(1)
    expect(history.location.pathname).toBe('/signup')
  })
})