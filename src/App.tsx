import React from 'react';

import ReactDom from 'react-dom/client';
// Update the import path if RouterProvider is located elsewhere, for example:
import {RouterProvider}from 'react-router-dom';
// Or correct the path according to your project structure.
import router from './router/router'; // Ensure this path is correct
import './App.css'

function App() {
  const root=document.getElementById('root') as HTMLElement;
    ReactDom.createRoot(root).render(<RouterProvider router={router}/>);    

    
  return (
    <>
      <div>





      
    </div>
    </>

  )
}

export default App
