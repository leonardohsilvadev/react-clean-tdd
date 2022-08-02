import React from 'react'
import Logo from '../logo/logo'
import styles from './login-header-styles.scss'

const LoginHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <h1>Enquetes para Programadores</h1>
    </header>
  )
}

export default LoginHeader