import { FC, ReactNode } from 'react'
import Nav from '../components/Nav'

type UploadLayoutPropsType = {
  children: ReactNode
}

const UploadLayout: FC<UploadLayoutPropsType> = ({ children }) => {
  return (
    <div className="bg-[#F8F8F8] h-[100vh]">
      <Nav />
      <div className="flex justify-between mx-auto w-full px-2 max-w-[1140px]">
        {children}
      </div>
    </div>
  )
}

export default UploadLayout
