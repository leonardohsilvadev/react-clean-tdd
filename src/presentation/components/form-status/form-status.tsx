import FormContext from '@/presentation/contexts/form/form-context'
import React, { useContext } from 'react'
import Spinner from '../spinner/spinner'
import styles from './form-status-styles.scss'

const FormStatus: React.FC = () => {
  const { state: { isLoading, main } } = useContext(FormContext)

  return (
    <div data-testid="error-wrap" className={styles.errorWrap}>
      {isLoading && <Spinner className={styles.spinner} />}
      {main && <span className={styles.error}>{main}</span>}
    </div>
  )
}

export default FormStatus