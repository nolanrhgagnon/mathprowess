import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Navigation from '~/components/navigation/Navigation';
import { API_BASE_URL } from '~/config';

axios.defaults.baseURL = API_BASE_URL;

const Root = (props) => {
    const urls = [
        { title: 'Testimonials', path: 'testimonials' },
        { title: 'Tutorials', path: 'tutorials' },
        { title: 'About Me', path: 'about' },
        { title: 'Merchandise', path: 'merchandise' },
    ];
    return (
        <div className="flex flex-col min-h-screen bg-red-900">
            <Navigation urls={urls} />
            <main className="flex-1 mt-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Root;
