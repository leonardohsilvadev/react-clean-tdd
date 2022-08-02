import React from 'react'
import styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.inputWrap}>
      <input {...props} />
      <span className={styles.inputStatus}>🔴</span>
    </div>
  )
}

export default Input