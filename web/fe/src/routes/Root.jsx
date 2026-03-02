import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Navigation from '~/components/navigation/Navigation';
import { API_BASE_URL } from '~/config';

axios.defaults.baseURL = API_BASE_URL;

const Root = (props) => {
    console.log(API_BASE_URL);
    return (
        <div className="flex flex-col min-h-screen bg-gray-800">
            <Navigation />
            <main className="flex-1 mt-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Root;
