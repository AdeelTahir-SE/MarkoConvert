import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import CreateAccount from './pages/Createaccount.tsx'
import Signin from './pages/Signin.tsx'
import Markdown from './pages/Markdown.tsx'
const router =createBrowserRouter([
  {
path:"createAccount",
element:<CreateAccount/>
  },
  {
    path:"signin",
    element:<Signin/>
  }
  ,
  {
    path:"Markdown",
    element:<Markdown/>
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
