import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routes } from './routes.tsx'
import { Auth0Provider } from '@auth0/auth0-react'

const queryClient = new QueryClient()
const router = createBrowserRouter(routes)
const root = createRoot(document.getElementById('app') as HTMLElement)

// document.addEventListener('DOMContentLoaded', () => {
//   createRoot(document.getElementById('app') as HTMLElement)

root.render(
  <QueryClientProvider client={queryClient}>
    <Auth0Provider
      domain="manaia-2023-pete.au.auth0.com"
      clientId="ffoSt5fGd4Im8qpyegEp0rRXWfoAeBVM"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://chorequest/api',
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
    <ReactQueryDevtools />
  </QueryClientProvider>
)
// })
