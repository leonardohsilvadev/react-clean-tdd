import React from 'react'
import { faker } from '@faker-js/faker'
import { RenderResult, render, cleanup, fireEvent, waitFor } from '@testing-library/react'
import SignUp from "./signup"
import { FormHelper, ValidationStub, AddAccountSpy } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const addAccountSpy = new AddAccountSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    // <Router location={history.location} navigator={history}>
      <SignUp
        validation={validationStub}
        addAccount={addAccountSpy}
      />
    // </Router>
  )
  return { sut, addAccountSpy }
}

const simulateValidSubmit = async (
  getByTestId,
  name = faker.name.fullName(),
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  FormHelper.populateField(getByTestId, 'name', name)
  FormHelper.populateField(getByTestId, 'email', email)
  FormHelper.populateField(getByTestId, 'password', password)
  FormHelper.populateField(getByTestId, 'passwordConfirmation', password)
  const form = getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('SignUp Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })

    FormHelper.testChildCount(getByTestId, 'error-wrap', 0)
    FormHelper.testButtonIsDisabled(getByTestId, 'submit', true)
    FormHelper.testStatusForField(getByTestId, 'name', validationError)
    FormHelper.testStatusForField(getByTestId, 'email', validationError)
    FormHelper.testStatusForField(getByTestId, 'password', validationError)
    FormHelper.testStatusForField(getByTestId, 'passwordConfirmation', validationError)
  })

  test('Should show name error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    FormHelper.populateField(getByTestId, 'name')
    FormHelper.testStatusForField(getByTestId, 'name', validationError)
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

  test('Should show passwordConfirmation error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    FormHelper.populateField(getByTestId, 'passwordConfirmation')
    FormHelper.testStatusForField(getByTestId, 'passwordConfirmation', validationError)
  })

  test('Should show valid name state if validation succeeds', () => {
    const { sut: { getByTestId } } = makeSut()
    FormHelper.populateField(getByTestId, 'name')
    FormHelper.testStatusForField(getByTestId, 'name')
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

  test('Should show valid passwordConfirmation state if validation succeeds', () => {
    const { sut: { getByTestId } } = makeSut()
    FormHelper.populateField(getByTestId, 'passwordConfirmation')
    FormHelper.testStatusForField(getByTestId, 'passwordConfirmation')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut: { getByTestId } } = makeSut()
    FormHelper.populateField(getByTestId, 'name')
    FormHelper.populateField(getByTestId, 'email')
    FormHelper.populateField(getByTestId, 'password')
    FormHelper.populateField(getByTestId, 'passwordConfirmation')
    FormHelper.testButtonIsDisabled(getByTestId, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { sut: { getByTestId } } = makeSut()
    await simulateValidSubmit(getByTestId)
    FormHelper.testElementExists(getByTestId, 'spinner')
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut: { getByTestId }, addAccountSpy } = makeSut()
    const name = faker.name.fullName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(getByTestId, name, email, password)
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('Should call Authentication only once', async () => {
    const { sut: { getByTestId }, addAccountSpy } = makeSut()
    await simulateValidSubmit(getByTestId)
    await simulateValidSubmit(getByTestId)
    expect(addAccountSpy.callsCount).toBe(1)
  })
})