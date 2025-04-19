import AuthProvider from "@/AuthContext/AuthContext";
import AppLayout from "@/components/appLayout";

/* Import global CSS */
import "@/styles/globals.css";
import "@/styles/globalStyles.scss";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </AuthProvider>
  );
}
