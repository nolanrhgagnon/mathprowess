import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './routes/Home';
import Testimonials from './routes/Testimonials';
import Tutorials from './routes/Tutorials';
import About from './routes/About';
import Merchandise from './routes/Merchandise';
import Root from './routes/Root';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <Root />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'testimonials',
                element: <Testimonials />,
            },
            {
                path: 'tutorials',
                element: <Tutorials />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'merchandise',
                element: <Merchandise />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
