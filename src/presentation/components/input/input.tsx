import FormContext from '@/presentation/contexts/form/form-context'
import React, { useContext } from 'react'
import styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext)
  const error = state[`${props.name}Error`]

  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const getStatus = (): string => {
    return error ? '🔴' : '🟢'
  }

  const getTitle = (): string => {
    return error ?? 'Ok'
  }

  return (
    <div className={styles.inputWrap}>
      <input {...props} data-testid={props.name} onChange={handleChange} />
      <span
        data-testid={`${props.name}-status`}
        title={getTitle()}
        className={styles.inputStatus}
        >
          {getStatus()}
      </span>
    </div>
  )
}

export default Input