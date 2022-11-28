import { Router } from '@/presentation/components'
import '@/presentation/styles/global.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { MakeLogin } from './factories/pages/login/login-factory'

ReactDOM.render(
  <Router
    MakeLogin={MakeLogin}
  />,
  document.getElementById('main')
)