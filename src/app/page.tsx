
/* eslint-disable react/no-unescaped-entities */
'use client'
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import Cookies from "js-cookie";

const Home = () => {
  const onLogout = () => {
    // Clear the cookie when the user logs out
    Cookies.remove("loggedIn");
  };

  const { user, error, isLoading } = useUser();

  // Check if the user is logged in and set the cookie accordingly
  if (user && !Cookies.get("loggedIn")) {
    Cookies.set("loggedIn", "true");
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto p-4">
        {user ? (
          <div className="text-center">
            <div className="text-xl font-bold mb-4">HOME</div>
            <div>User: {user.email}</div>
            <Link href="/api/auth/logout" onClick={onLogout} className="text-blue-500 hover:underline">
              Logout
            </Link>
            <p className="mt-6">Welcome to Jainth's Task</p>
            <Link href="/task-manager" passHref legacyBehavior>
              <a className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-all">
                Go to Blog Manager
              </a>
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <Link href="/api/auth/login" passHref legacyBehavior>
              <a className="text-blue-500 hover:underline">Login</a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
