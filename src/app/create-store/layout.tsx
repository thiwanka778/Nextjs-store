
import type { Metadata } from 'next'
import NavBar from '../components/NavBar/NavBar'



export const metadata: Metadata = {
  title: 'Create Store',
  description: `Empower your digital presence with Next.js Store Creation robust 
  and intuitive platform offering unparalleled flexibility and efficiency 
  in building dynamic, high-performance online stores. Seamlessly combine cutting-edge 
  frontend technologies with scalable backend solutions to craft engaging, 
  personalized shopping experiences. Elevate your business with modular architecture, 
  advanced state management, and customizable features, ensuring rapid development 
  and delivery of immersive e-commerce solutions. Streamline your store creation process 
  effortlessly while delivering exceptional user experiences with Next.js, setting new 
  standards in online retail excellence.`,
  openGraph: {
    type: 'website',
    url: 'https://your-website-url',
    title: 'Create Store',
    description: 'Empower your digital presence with Next.js Store Creation...',
    images: [
      {
        url: 'https://media.istockphoto.com/id/912819604/vector/storefront-flat-design-e-commerce-icon.jpg?s=612x612&w=0&k=20&c=_x_QQJKHw_B9Z2HcbA2d1FH1U1JVaErOAp2ywgmmoTI=', // Replace with the path to your image within the public folder
        width: 800, // Replace with the image width
        height: 600, // Replace with the image height
        alt: 'Image Description', // Replace with a description of the image
      },
    ],
  },
}

export default function CreateStoreLayout({
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

