import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '../graphql/mutations/Login'
import Input from './Input'
import { useGeneralStore } from '../stores/generalStore'
import { useUserStore } from '../stores/userStore'
import { GraphQLErrorExtensions } from 'graphql'

const Login = () => {
  const setUser = useUserStore((state) => state.setUser)
  const setLoginIsOpen = useGeneralStore((state) => state.setLoginIsOpen)
  const [errors, setErrors] = useState<GraphQLErrorExtensions>({})
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    // onCompleted: (data) => {
    //   console.log('DATA', data)
    // },
    variables: {
      email: loginData.email,
      password: loginData.password
    }
  })

  const handleLogin = async () => {
    try {
      const response = await loginUser()
      setUser(response.data.login.user)
      setLoginIsOpen(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.graphQLErrors[0]?.extensions) {
        setErrors(err.graphQLErrors[0].extensions)
      }
    }
  }

  return (
    <div className="flex flex-col grow">
      <div className="text-center text-[28px] mb-4 font-bold">Login</div>
      <div className="h-[100%] flex flex-col w-full justify-center">
        <div className="px-6 pb-2">
          <Input
            autoFocus={false}
            max={64}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            placeholder="Enter your email"
            inputType="text"
            error={errors?.email as string}
          />
        </div>
        <div className="px-6 pb-2">
          <Input
            autoFocus={false}
            max={64}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            placeholder="Password"
            inputType="password"
            error={errors?.password as string}
          />
        </div>
        <div className="px-6 text-[12px] text-gray-600">Forgot password?</div>
        <div className="px-6 mt-6">
          <button
            onClick={handleLogin}
            disabled={loading || !loginData.email || !loginData.password}
            className={[
              'w-full text-[17px] font-semibold text-white py-3 rounded-sm',
              loading || !loginData.password || !loginData.email
                ? 'bg-gray-200'
                : 'bg-[#F02C56]'
            ].join(' ')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
