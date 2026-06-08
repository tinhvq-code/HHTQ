import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider
            clientId="123956077281-l0hlf5t2llaev204b95gveggm61g3957.apps.googleusercontent.com"
        >
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>
);
