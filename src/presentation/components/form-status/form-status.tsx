import React from 'react'
import Spinner from '../spinner/spinner'
import styles from './form-status-styles.scss'

const FormStatus: React.FC = () => {
  return (
    <div className={styles.errorWrap}>
      <Spinner className={styles.spinner} />
      <span className={styles.error}>Erro</span>
    </div>
  )
}

export default FormStatus