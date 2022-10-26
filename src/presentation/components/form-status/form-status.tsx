import FormContext from '@/presentation/contexts/form/form-context'
import React, { useContext } from 'react'
import Spinner from '../spinner/spinner'
import styles from './form-status-styles.scss'

const FormStatus: React.FC = () => {
  const { state: { isLoading, mainError } } = useContext(FormContext)

  return (
    <div data-testid="error-wrap" className={styles.errorWrap}>
      {isLoading && <Spinner className={styles.spinner} />}
      {mainError && <span data-testid="main-error" className={styles.error}>{mainError}</span>}
    </div>
  )
}

export default FormStatus