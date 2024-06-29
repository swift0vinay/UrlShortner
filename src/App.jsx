import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import RedirectLink from './pages/RedirectLink'
import LandingPage from './pages/LandingPage'
import UrlProvider from './context'
import RequireAuth from './components/require-auth'
import LinkPage from './pages/LinkPage'

const router = createBrowserRouter(
  [{
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/dashboard",
        element: <RequireAuth>
          <Dashboard />
        </RequireAuth>
      },
      {
        path: "/auth",
        element: <Auth />
      },
      {
        path: "/link/:id",
        element: <RequireAuth>
          <LinkPage />
        </RequireAuth>
      },
      {
        path: "/:id",
        element: <RedirectLink />
      }
    ]
  }]
)

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  )
}

export default App
