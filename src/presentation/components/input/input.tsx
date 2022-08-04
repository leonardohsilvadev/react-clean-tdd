import FormContext from '@/presentation/contexts/form/form-context'
import React, { useContext } from 'react'
import styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { errorState } = useContext(FormContext)
  const error = errorState[props.name]

  const getStatus = (): string => {
    return '🔴'
  }

  const getTitle = (): string => {
    return error
  }

  return (
    <div className={styles.inputWrap}>
      <input {...props} />
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