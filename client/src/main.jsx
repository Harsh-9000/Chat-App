import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import router from './routes/Routes.jsx'
import { RouterProvider } from 'react-router-dom'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer
        position="top-center"
        autoClose={5000} // Optional: Auto close after 5 seconds
        hideProgressBar={false} // Optional: Hide progress bar
        newestOnTop={false} // Optional: Newest toasts on top
        closeOnClick // Optional: Close on click
        rtl={false} // Optional: Right to left
        pauseOnFocusLoss // Optional: Pause on focus loss
        draggable // Optional: Draggable
        pauseOnHover // Optional: Pause on hover
      />
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>,
)
