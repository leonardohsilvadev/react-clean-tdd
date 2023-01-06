import { faker } from "@faker-js/faker"
import * as helper from "../http-mocks"

export const mockEmailInUseError = (): void =>
  helper.mockEmailInUseError(/signup/)

export const mockUnexpectedError = (): void =>
  helper.mockUnexpectedError(/signup/, 'POST')

export const mockInvalidData = (): void =>
  helper.mockOk(/signup/, 'POST', { invalid: faker.datatype.uuid() })