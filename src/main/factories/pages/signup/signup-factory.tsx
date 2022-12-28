import React from "react";
import { makeSignUpValidation } from "./signup-validation-factory";
import { makeLocalSaveAccessToken } from "@/main/factories/usecases/authentication/save-access-token/local-save-access-token-factory";
import { SignUp } from "@/presentation/pages";
import { makeRemoteAddAccount } from '@/main/factories/usecases/add-account/remote-add-account-factory'

export const MakeSignUp = () => {
  return (
    <SignUp
      addAccount={makeRemoteAddAccount()}
      validation={makeSignUpValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  )
}