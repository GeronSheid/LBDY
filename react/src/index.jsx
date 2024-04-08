import ReactDOM from 'react-dom/client'
import App from "app/App";
import {BrowserRouter} from "react-router-dom";
import {StoreProvider} from "app/providers/StoreProvider";
// import "dotenv/config.js";

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <StoreProvider>
        <BrowserRouter
            basename='/platform/'
        >
            <App />
        </BrowserRouter>
    </StoreProvider>
)
