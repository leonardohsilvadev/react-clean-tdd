import { faker } from "@faker-js/faker"
import * as helper from "../http-mocks"

export const mockEmailInUseError = (): void =>
  helper.mockEmailInUseError(/signup/)