import AuthProvider from "@/AuthContext/AuthContext";
import AppLayout from "@/components/appLayout";

/* Import global CSS */
import "@/styles/globals.css";
import "@/styles/globalStyles.scss";
import { useContext } from "react";

export default function App({ Component, pageProps }) {
  // const { isLoggedIn } = useAuth()
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <AuthProvider>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </AuthProvider>
  );
}
