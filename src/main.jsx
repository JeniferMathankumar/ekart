import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import "react-toastify/dist/ReactToastify.css";
// import './assets/css/bootstrap.min.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import TitleManager from './components/TitleManager.jsx'
import { store,persistor } from './app/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PersistGate>

    </Provider>
  </StrictMode>,
)
