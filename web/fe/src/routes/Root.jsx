import { Outlet, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import axios from 'axios';
import Navigation from '~/components/navigation/Navigation';
import { API_BASE_URL } from '~/config';
import Error404 from './Error404';

axios.defaults.baseURL = API_BASE_URL;

const Root = (props) => {
    const error = useRouteError();
    const urls = [
        { title: 'Testimonials', path: 'testimonials' },
        { title: 'Tutorials', path: 'tutorials' },
        { title: 'About Me', path: 'about' },
        { title: 'Merchandise', path: 'merchandise' },
    ];
    return (
        <div className="flex flex-col min-h-screen bg-indigo-950">
            <Navigation urls={urls} />
            <main className="flex-1 mt-6 h-full">
                {error ? <Error404 /> : <Outlet />}
            </main>
        </div>
    );
};

export default Root;
