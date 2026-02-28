import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './routes/Home';
import Consultation from './routes/Consultation';
import Testimonials from './routes/Testimonials';
import Tutorials from './routes/Tutorials';
import About from './routes/About';
import Root from './routes/Root';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <div>Error Page</div>,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'consultation',
                element: <Consultation />,
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
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
