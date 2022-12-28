import { MakeSignUp } from '@/main/factories/pages/signup/signup-factory'
import { SignUp } from '@/presentation/pages'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

type Factories = {
  MakeLogin: React.FC
  MakeSignUp: React.FC
}

const Router: React.FC<Factories> = ({
  MakeLogin,
  MakeSignUp
}: Factories) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<MakeLogin />} />
        <Route path="/signup" element={<MakeSignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router