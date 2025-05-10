// src/pages/_app.js
import { useContext } from 'react'; // Keep if needed by AppLayout or AuthProvider
import { useRouter } from 'next/router'; // Import useRouter
import AuthProvider from '@/AuthContext/AuthContext';
import AppLayout from '@/components/appLayout';
import AdminLayout from '@/components/adminLayout'; // Import the new AdminLayout

/* Import global CSS */
import '@/styles/globals.css';
import '@/styles/globalStyles.scss';

export default function App({ Component, pageProps }) {
  const router = useRouter(); // Get router instance

  // Check if the current route is an admin route
  const isAdminRoute = router.pathname.startsWith('/admin');

  // Original implementation note: AuthContext usage might need adjustment
  // If AuthContext provides isLoggedIn status, you might want to check that too
  // before rendering AdminLayout, redirecting if not logged in/not admin.
  // For now, we just check the path.
  // const { isLoggedIn } = useContext(AuthContext); // If using AuthContext for role checks

  return (
    <AuthProvider>
      <AppLayout>
        {isAdminRoute ? (
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        ) : (
          <Component {...pageProps} />
        )}  
      </AppLayout>
    </AuthProvider>
  );
}