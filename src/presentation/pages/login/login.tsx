import { Logo } from '@/presentation/components'
import Spinner from '@/presentation/components/spinner/spinner'
import React from 'react'
import styles from './login-styles.scss'

const Login: React.FC = () => {
  return (
    <div className={styles.login}>
      <header className={styles.header}>
        <Logo />
        <h1>Enquetes para Programadores</h1>
      </header>

      <form className={styles.form}>
        <h2>Login</h2>
        <div className={styles.inputWrap}>
        <input type="email" name="email" placeholder="Digite seu email" />
        <span className={styles.inputStatus}>🔴</span>
        </div>

        <div className={styles.inputWrap}>
        <input type="password" name="password" placeholder="Digite sua senha" />
        <span className={styles.inputStatus}>🔴</span>
        </div>

        <button type="submit">Entrar</button>

        <span className={styles.register}>Não possui conta? Cadastre-se</span>

        <div className={styles.errorWrap}>
          <Spinner className={styles.spinner} />
          <span className={styles.error}>Erro</span>
        </div>
      </form>

      <footer className={styles.footer} />
    </div>
  )
}

export default Login