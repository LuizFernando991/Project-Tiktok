import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export interface User {
  id?: number
  name: string
  email?: string
  bio?: string
  image?: string
}

export interface UserActions {
  setUser: (user: User) => void
  resetUser: () => void
  logout: () => void
}

export const useUserStore = create<User & UserActions>()(
  devtools(
    persist(
      (set) => ({
        id: undefined,
        name: '',
        email: '',
        bio: '',
        image: '',
        setUser: (user) => set(user),
        resetUser: () =>
          set({
            id: undefined,
            name: '',
            email: '',
            bio: '',
            image: ''
          }),
        logout: () => {
          set({
            id: undefined,
            name: '',
            email: '',
            bio: '',
            image: ''
          })
        }
      }),
      {
        name: 'user-storage'
      }
    )
  )
)
