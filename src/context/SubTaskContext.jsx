import React, { createContext, useReducer } from 'react';

const initialState = {
    isAddSubTask: false,
    executors: null,
};

const subTaskReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_ADD_FORM':
      return {
        ...state,
        isAddSubTask: true,
        executors: action.payload,
      };
    case 'CLOSE_ADD_FORM':
      return {
        ...state,
        isAddSubTask: false,
        executors: null,
      };
    default:
      return state;
  }
};

export const SubTaskContext = createContext();

export const SubTaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(subTaskReducer, initialState);
  
    return (
      <SubTaskContext.Provider value={{ state, dispatch }}>
        {children}
      </SubTaskContext.Provider>
    );
  };


