// src/components/layout/AuthActions.tsx
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import useAuthStore from "@/stores/useAuthStore";
import {useEffect} from "react";

const AuthActions = () => {
  const { token, logout, user, tokenexpiry } = useAuthStore();

  useEffect(async() => {
    const res = await tokenexpiry();
    if(res.status === 401){
       await logout();
    };
  },[]);


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
