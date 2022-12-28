import FormContext from '@/presentation/contexts/form/form-context'
import React, { useContext } from 'react'

type Props = {
  text: string
}

const SubmitButton: React.FC<Props> = ({ text }: Props) => {
  const { state } = useContext(FormContext)

  return (
    <button
      data-testid="submit"
      disabled={state.isLoading || state.isFormInvalid}
      type="submit"
    >
    {text}
  </button>
  )
}

export default SubmitButton