import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user from local storage if available
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const updateUserProfilePic = (profilePicPath) => {
    setUser((prevUser) => ({
      ...prevUser,
      profilePicPath,
    }));
  };

  useEffect(() => {
    // Save user to local storage whenever it changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, updateUserProfilePic}}>
      {children}
    </UserContext.Provider>
  );
};
