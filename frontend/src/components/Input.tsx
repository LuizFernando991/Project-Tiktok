import { FC, useEffect, ChangeEvent } from 'react'

type InputPropsType = {
  placeholder: string
  inputType: string
  value?: string
  max: number
  error: string
  autoFocus: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Input: FC<InputPropsType> = ({
  placeholder,
  value,
  inputType,
  max,
  error,
  autoFocus,
  onChange
}) => {
  useEffect(() => {
    if (autoFocus) {
      const input = document.getElementById(`input-${placeholder}`)
      input?.focus()
    }
  }, [autoFocus, placeholder])

  return (
    <div>
      <input
        value={value}
        id={`input-${placeholder}`}
        placeholder={placeholder}
        type={inputType}
        autoComplete="off"
        maxLength={max}
        onChange={onChange}
        className="block w-full bg-[#F1F1F2] text-gray-800 border border-gay-300 rounded-md py-2.5 px-3 focus:outline-none"
      />
      {error && (
        <span className="text-red-500 text-[14px] font-semibold">{error}</span>
      )}
    </div>
  )
}

export default Input
