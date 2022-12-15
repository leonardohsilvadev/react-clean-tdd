import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Footer, FormStatus, Input, LoginHeader } from '@/presentation/components'
import FormContext from '@/presentation/contexts/form/form-context'
import styles from './signup-styles.scss'
import { Validation } from '@/presentation/protocols/validation'
import { AddAccount } from '@/domain/usecases'

type Props = {
  validation?: Validation
  addAccount?: AddAccount
}

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: '',
    mainError: ''
  })

  useEffect(() => {
    setState({
      ...state,
      nameError: validation.validate('name', state.name),
      emailError: validation.validate('email', state.name),
      passwordError: validation.validate('password', state.password),
      passwordConfirmationError: validation.validate('passwordConfirmation', state.passwordConfirmation)
    })
  }, [state.name, state.email])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    setState({ ...state, isLoading: true })
    await addAccount.add({
      name: state.name,
      email: state.email,
      password: state.password,
      passwordConfirmation: state.passwordConfirmation
    })
  }

  return (
    <div className={styles.signup}>

      <LoginHeader />

      <FormContext.Provider value={{ state, setState }}>
        <form data-testid="form" className={styles.form} onSubmit={handleSubmit}>
          <h2>Criar Conta</h2>
          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu email" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <Input type="password" name="passwordConfirmation" placeholder="Repita sua senha" />

          <button
            data-testid="submit"
            disabled={
              !!(
                state.nameError ||
                state.emailError ||
                state.passwordError ||
                state.passwordConfirmationError ||
                state.isLoading
              )
            }
            type="submit"
          >
            Entrar
          </button>

          <span
            // to="/login"
            className={styles.register}
          >
            Voltar para Login
          </span>

          <FormStatus />
        </form>
      </FormContext.Provider>

      <Footer />
    </div>
  )
}

export default SignUp