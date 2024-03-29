import {
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation,
  CompareFieldsValidation
} from "@/validation/validators"
import { ValidationBuilder as sut } from "./validation-builder"
import { faker } from '@faker-js/faker'

describe('ValidationBuilder', () => {
  const field = faker.database.column()
  const length = Number(faker.random.numeric())
  const fieldToCompare = faker.database.column()

  test('Should return RequiredFieldValidation', () => {
    const validations = sut.field(field).required().build()
    expect(validations).toEqual([new RequiredFieldValidation(field)])
  })

  test('Should return EmailValidation', () => {
    const validations = sut.field(field).email().build()
    expect(validations).toEqual([new EmailValidation(field)])
  })

  test('Should return MinLengthValidation', () => {
    const validations = sut.field(field).min(length).build()
    expect(validations).toEqual([new MinLengthValidation(field, length)])
  })

  test('Should return CompareFieldValidation', () => {
    const validations = sut.field(field).sameAs(fieldToCompare).build()
    expect(validations).toEqual([new CompareFieldsValidation(field, fieldToCompare)])
  })

  test('Should return a list of validations', () => {
    const validations = sut.field(field).required().email().min(length).build()
    expect(validations).toEqual([
      new RequiredFieldValidation(field),
      new EmailValidation(field),
      new MinLengthValidation(field, length)
    ])
  })
})