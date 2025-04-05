/* next/router -> for apps based on pages router */
import { useRouter } from "next/router";
import { useCallback } from "react";

const useRouteNavigate = (props) => {
  const router = useRouter();

  // Use to completely change the route
  const handleRouteChange = useCallback(
    (path) => {
      router.push(path);
    },
    [router]
  );

  // Use to update current route with query params
  const handleRouteUpdate = useCallback(
    (queryParams) => {
      const currentPath = router?.pathname;
      const updatedQuery = { ...router?.query, ...queryParams };
      router.push(
        {
          pathname: currentPath,
          query: updatedQuery,
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  return { handleRouteChange, handleRouteUpdate };
};

export default useRouteNavigate;
