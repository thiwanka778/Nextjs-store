
import type { Metadata } from 'next'




export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Generated by create next app',
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
   
     <main>{children}</main>
    </>
  )
}

