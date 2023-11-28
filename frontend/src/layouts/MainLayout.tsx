import { FC, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from '../components/Nav'
import SideNav from '../components/SideNav'

type MainLayoutPropsType = {
  children: ReactNode
}

const MainLayout: FC<MainLayoutPropsType> = ({ children }) => {
  return (
    <div>
      <header>
        <Nav />
      </header>
      <div
        className={[
          useLocation().pathname === '/' ? 'max-w-[1148px]' : '',
          'flex justify-between mx-auto w-full lg:px-2.5 px-0'
        ].join(' ')}
      >
        <div className="hidden md:block">
          <SideNav />
        </div>
        {children}
      </div>
    </div>
  )
}

export default MainLayout
