import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import DashboardLayout from "./components/layout/DashboardLayout"
import ContactsPage from "./features/contacts/ContactsPage"

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div>Loading...</div>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div>Loading...</div>
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />
}

export default function App() {
  const router = createBrowserRouter([
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <DashboardLayout />,
          children: [
            {
              path: "/",
              element: <ContactsPage />,
            },
          ],
        },
      ],
    },
    {
      element: <PublicRoute />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: "*",
      element: <div>404 Not Found</div>
    }
  ])

  return <RouterProvider router={router} />
}
