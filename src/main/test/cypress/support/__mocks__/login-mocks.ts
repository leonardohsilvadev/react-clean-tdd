import { faker } from "@faker-js/faker"
import * as helper from "../http-mocks"

export const mockInvalidCredentialsError = (): void =>
  helper.mockInvalidCredentialsError(/login/)

export const mockUnexpectedError = (): void =>
  helper.mockUnexpectedError(/login/, 'POST')

export const mockOk = (): void =>
  helper.mockOk(/login/, 'POST', { accessToken: faker.datatype.uuid() })

export const mockInvalidData = (): void =>
  helper.mockOk(/login/, 'POST', { invalid: faker.datatype.uuid() })