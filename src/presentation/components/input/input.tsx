import FormContext from '@/presentation/contexts/form/form-context'
import React, { useContext, useRef } from 'react'
import styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext)
  const inputRef = useRef<HTMLInputElement>()
  const error = state[`${props.name}Error`]

  return (
    <div className={styles.inputWrap}>
      <input
        {...props}
        ref={inputRef}
        placeholder=" "
        data-testid={props.name}
        onChange={e => setState({ ...state, [e.target.name]: e.target.value })}
      />
      <label onClick={() => inputRef.current.focus()}>{props.placeholder}</label>
      <span
        data-testid={`${props.name}-status`}
        title={error ?? 'Ok'}
        className={styles.inputStatus}
      >
        {error ? '🔴' : '🟢'}
      </span>
    </div>
  )
}

export default Input