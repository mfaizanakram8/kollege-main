import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [paper, setPaper] = useState("");
  const [paperList, setPaperList] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        paper,
        setPaper,
        paperList,
        setPaperList,
        notes,
        setNotes,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
