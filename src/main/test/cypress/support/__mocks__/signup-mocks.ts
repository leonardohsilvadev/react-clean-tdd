import * as helper from "../http-mocks"

export const mockEmailInUseError = (): void =>
  helper.mockEmailInUseError(/signup/)

export const mockUnexpectedError = (): void =>
  helper.mockUnexpectedError(/signup/, 'POST')