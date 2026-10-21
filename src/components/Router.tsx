import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import LojaPage from '@/components/pages/LojaPage';
import ComoComprarPage from '@/components/pages/ComoComprarPage';
import GarantiaPage from '@/components/pages/GarantiaPage';
import ContatoPage from '@/components/pages/ContatoPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "loja",
        element: <LojaPage />,
        routeMetadata: {
          pageIdentifier: 'loja',
        },
      },
      {
        path: "como-comprar",
        element: <ComoComprarPage />,
        routeMetadata: {
          pageIdentifier: 'como-comprar',
        },
      },
      {
        path: "garantia",
        element: <GarantiaPage />,
        routeMetadata: {
          pageIdentifier: 'garantia',
        },
      },
      {
        path: "contato",
        element: <ContatoPage />,
        routeMetadata: {
          pageIdentifier: 'contato',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
