import { FC, useState } from 'react'
import { REGISTER_USER } from '../graphql/mutations/Register'
import { useMutation } from '@apollo/client'
import { useUserStore } from '../stores/userStore'
import { GraphQLErrorExtensions } from 'graphql'
import { useGeneralStore } from '../stores/generalStore'
import { RegisterUserMutation } from '../gql/graphql'
import Input from './Input'

const Register: FC = () => {
  const [registerUser, { loading }] =
    useMutation<RegisterUserMutation>(REGISTER_USER)
  const setUser = useUserStore((state) => state.setUser)
  const setIsLoginOpen = useGeneralStore((state) => state.setLoginIsOpen)
  const [errors, setErrors] = useState<GraphQLErrorExtensions>({})
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleRegister = async () => {
    try {
      setErrors({})
      const response = await registerUser({
        variables: {
          email: registerData.email,
          password: registerData.password,
          name: registerData.name
        }
      })
      if (response?.data?.register?.user) {
        const resUser = response.data.register.user
        setUser({
          id: resUser.id,
          email: resUser.email,
          name: resUser.name,
          bio: '',
          image: ''
        })
      }
      setIsLoginOpen(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.graphQLErrors[0]?.extensions) {
        const validationErrors = err.graphQLErrors[0].extensions
        setErrors(validationErrors)
      }
    }
  }

  return (
    <div className="flex grow  flex-col">
      <div className="text-center text-[28px] mb-4 font-bold">Sign up</div>
      <div className="h-[100%] flex flex-col w-full justify-center">
        <div className="px-6 pb-2">
          <Input
            max={64}
            placeholder="Enter your name"
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
            inputType="text"
            autoFocus={true}
            error={errors?.name as string}
          />
        </div>
        <div className="px-6 pb-2">
          <Input
            autoFocus={false}
            max={64}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
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
              setRegisterData({ ...registerData, password: e.target.value })
            }
            placeholder="Password"
            inputType="password"
            error={errors?.password as string}
          />
        </div>
        <div className="px-6 mt-6">
          <button
            onClick={handleRegister}
            disabled={
              loading ||
              !registerData.email ||
              !registerData.password ||
              !registerData.name
            }
            className={[
              'w-full text-[17px] font-semibold text-white py-3 rounded-sm',
              loading ||
              !registerData.email ||
              !registerData.password ||
              !registerData.name
                ? 'bg-gray-200'
                : 'bg-[#F02C56]'
            ].join(' ')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
