import { useState } from 'react'
import { useGeneralStore } from '../stores/generalStore'
import { ImCross } from 'react-icons/im'

import Login from './Login'
import Register from './Register'

const AuthModal = () => {
  const [isRegistered, setIsRegistered] = useState(false)

  const setLoginIsOpen = useGeneralStore((state) => state.setLoginIsOpen)
  const isLoginOpen = useGeneralStore((state) => state.setLoginIsOpen)

  return (
    <div
      id="AuthModal"
      className="fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50"
    >
      <div className="relative bg-white w-full max-w-[470px] h-[70%] p-4 rounded-lg flex flex-col justify-between">
        <div className="w-full flex justify-end">
          <button
            className="p-2 rounded-full bg-gray-100"
            onClick={() => setLoginIsOpen(!isLoginOpen)}
          >
            <ImCross color="#3d3d3d" size="20" />
          </button>
        </div>
        {isRegistered ? <Login /> : <Register />}
        <div className="flex items-center justify-center py-5 left-0 bottom-0 border-t w-full">
          <span className="text-[14px] text-gray-600">
            {isRegistered ? "Don't have an account?" : 'Have an account?'}
          </span>
          <button
            className="text-[14px] text-[#F02C56] font-semibold pl-1"
            onClick={() => setIsRegistered(!isRegistered)}
          >
            {isRegistered ? <span>Sing up</span> : <span>Log in</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
