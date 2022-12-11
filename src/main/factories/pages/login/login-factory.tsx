import React from "react";
import { makeLoginValidation } from "./login-validation-factory";
import { makeRemoteAuthentication } from "@/main/factories/usecases/authentication/remote-authentication-factory";
import { makeLocalSaveAccessToken } from "@/main/factories/usecases/authentication/save-access-token/local-save-access-token-factory";
import { Login } from "@/presentation/pages";

export const MakeLogin = () => {
  return (
    <Login
      authentication={makeRemoteAuthentication()}
      validation={makeLoginValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  )
}