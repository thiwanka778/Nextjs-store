
import type { Metadata } from 'next'
import NavBar from '../components/NavBar/NavBar'


export const metadata: Metadata = {
  title: 'Category',
  description: `Empower your digital presence with Next.js Store Creation robust 
  and intuitive platform offering unparalleled flexibility and efficiency 
  in building dynamic, high-performance online stores. Seamlessly combine cutting-edge 
  frontend technologies with scalable backend solutions to craft engaging, 
  personalized shopping experiences. Elevate your business with modular architecture, 
  advanced state management, and customizable features, ensuring rapid development 
  and delivery of immersive e-commerce solutions. Streamline your store creation process 
  effortlessly while delivering exceptional user experiences with Next.js, setting new 
  standards in online retail excellence.`,

 
}

export default function CategoryLayout({
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

