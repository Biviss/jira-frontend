import React, { createContext, useReducer,useEffect } from 'react';

const initialState = {
  user: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
      if(state.user){
        localStorage.setItem('user', JSON.stringify({ id: state.user.id, email: state.user.email }));
      }
  }, [state.user]); 

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
