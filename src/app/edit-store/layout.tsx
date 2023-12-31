
import type { Metadata } from 'next'
import NavBar from '../components/NavBar/NavBar'

export const metadata: Metadata = {
  title: 'Edit Store',
  description: 'Generated by create next app',
}

export default function EditStoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
   <NavBar/>
     <main style={{paddingTop:"10vh"}}>{children}</main>
    </>
  )
}

