// utils/withAuth.js
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/AuthContext/AuthContext";

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn) {
        router.replace("/");
      }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) return null;

    return <Component {...props} />;
  };
}
