import AppLayout from "@/components/appLayout";

/* Import global CSS */
import "@/styles/globals.css";
import "@/styles/globalStyles.scss";

export default function App({ Component, pageProps }) {
  // const { isLoggedIn } = useAuth()
  return (
    <AppLayout isLoggedIn>
      <Component {...pageProps} />
    </AppLayout>
  );
}
