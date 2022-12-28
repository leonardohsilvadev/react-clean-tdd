import { Router } from '@/presentation/components'
import '@/presentation/styles/global.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { MakeSignup } from './factories/pages/login/login-factory'

ReactDOM.render(
  <Router
    MakeLogin={MakeSignup}
  />,
  document.getElementById('main')
)