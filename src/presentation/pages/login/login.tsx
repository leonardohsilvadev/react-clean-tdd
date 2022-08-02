import { Footer, Input, LoginHeader, Spinner } from '@/presentation/components'
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

        <div className={styles.errorWrap}>
          <Spinner className={styles.spinner} />
          <span className={styles.error}>Erro</span>
        </div>
      </form>

      <Footer />
    </div>
  )
}

export default Login