import { SignUp } from '@clerk/nextjs';

export default function Page() {
    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black ">
           <SignUp
             appearance={{
               layout: {
                 socialButtonsPlacement: "bottom",
                 logoImageUrl: "/logo.svg",
               },
               elements: {
                 formButtonPrimary:
                   "bg-violet-600 hover:bg-violet-700 text-white font-semibold",
                 card: "bg-gray-900 shadow-none",
                 headerTitle: "text-white text-2xl font-bold",
                 headerSubtitle: "text-gray-400",
                 socialButtonsBlockButton:
                   "bg-gray-800 hover:bg-blue-700 border border-gray-700 text-white",
                 footerActionText: "text-gray-400",
                 footerActionLink: "text-violet-400 hover:text-violet-300 font-medium",
               },
             }}
           />
         </div>
   
)
}
