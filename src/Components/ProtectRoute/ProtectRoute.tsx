import { useLocation, Navigate } from "react-router-dom";
import { useUserStore } from '../../Context/useStore'; // Assuming you have this context for user data

const ProtectRoute = ({ protectedPath, children }: { protectedPath: boolean; children: JSX.Element }) => {
  const location = useLocation();
  const { currentUser } = useUserStore(); // Assuming currentUser holds the auth state
  let url = `/?redirectUrl=${location.pathname}`;

  return (
    <div>
      {protectedPath ? (
        currentUser ? (
          children
        ) : (
          <Navigate replace to={url} />
        )
      ) : (
        children
      )}
    </div>
  );
};

export default ProtectRoute;
