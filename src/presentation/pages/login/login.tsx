import { Footer, FormStatus, Input, LoginHeader } from '@/presentation/components'
import React from 'react'
import styles from './login-styles.scss'

const Login: React.FC = () => {
  return (
    <div className={styles.login}>

      <LoginHeader />

      <form className={styles.form}>
        <h2>Login</h2>
        <Input type="email" name="email" placeholder="Digite seu email" />
        <Input type="password" name="password" placeholder="Digite sua senha" />

        <button type="submit">Entrar</button>

        <span className={styles.register}>Não possui conta? Cadastre-se</span>

        <FormStatus />
      </form>

      <Footer />
    </div>
  )
}

export default Login