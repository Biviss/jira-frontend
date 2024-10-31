import React, { createContext, useReducer,useEffect } from 'react';

const initialState = {
  hasNotification: false,
};

const notificationReducer = (state, action) => {
    switch (action.type) {
      case 'SET_NOTIFICATION':
        return { ...state, hasNotification: true };
      case 'CLEAR_NOTIFICATION':
        return { ...state, hasNotification: false };
      default:
        return state;
    }
  };

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};
