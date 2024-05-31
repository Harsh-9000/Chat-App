import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import Home from "../pages/Home"
import MessagePage from "../components/MessagePage"

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />,
                children: [
                    {
                        path: ":userId",
                        element: <MessagePage />
                    }
                ]
            }
        ]
    }
])

export default router