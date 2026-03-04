import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Navigation from '~/components/navigation/Navigation';
import { API_BASE_URL } from '~/config';

axios.defaults.baseURL = API_BASE_URL;

const Root = (props) => {
    const urls = ['Testimonials', 'Tutorials', 'About Me'];
    return (
        <div className="flex flex-col min-h-screen bg-slate-900">
            <Navigation urls={urls} />
            <main className="flex-1 mt-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Root;
