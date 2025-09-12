// src/components/layout/AuthActions.tsx
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import useAuthStore from "@/stores/useAuthStore";

const AuthActions = () => {
  const { token, logout, user } = useAuthStore();

  if (token) {
    return (
      <div className="flex items-center gap-4">
        <span className="hidden lg:block text-sm">Hi, {user?.username}</span>
        <Button onClick={logout} variant="outline bg-white text-black rounded-lg">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-white text-black rounded-lg">
      <Link to="/signup">
        <Button>Get Started</Button>
      </Link>
    </div>
  );
};

export default AuthActions;
