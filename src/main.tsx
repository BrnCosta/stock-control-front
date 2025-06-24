import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'

import Dividend from './pages/Dividend.tsx'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import ErrorPage from './pages/Error.tsx'
import BuyAndSell from './pages/BuyAndSell.tsx'
import Portfolio from './pages/Portfolio.tsx'
import Login from './pages/Login.tsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'dividend',
        element: <Dividend />,
      },
      {
        path: 'buyandsell',
        element: <BuyAndSell />,
      },
      {
        path: 'portfolio',
        element: <Portfolio />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
