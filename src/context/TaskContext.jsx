import React, { createContext, useReducer } from 'react';

const initialState = {
    isOpenTask: false,
    selectedTask: null,
};

const taskPopupReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_POPUP':
      return {
        ...state,
        isOpenTask: true,
        selectedTask: action.payload,
      };
    case 'CLOSE_POPUP':
      return {
        ...state,
        isOpenTask: false,
        selectedTask: null,
      };
    default:
      return state;
  }
};

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taskPopupReducer, initialState);
  
    return (
      <TaskContext.Provider value={{ state, dispatch }}>
        {children}
      </TaskContext.Provider>
    );
  };


