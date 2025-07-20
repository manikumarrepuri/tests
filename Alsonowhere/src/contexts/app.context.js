import { createContext, useContext } from "react";

const AppClassContext = createContext(null);

export const useApp = () => useContext(AppClassContext);

export default AppClassContext;
