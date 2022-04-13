import axios, { AxiosError, AxiosResponse } from 'axios';
import { request } from 'http';
import { toast } from 'react-toastify';
import { Activity } from '../models/activity'
import { useHistory } from 'react-router-dom';
import { store } from '../stores/store';
import { history } from '../..';


const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    });
}



axios.defaults.baseURL = 'http://localhost:5000/api';

// axios.interceptors.response.use(async response => {
//     try {
//         await sleep(1000);
//         return response;
//     } catch(error) {
//         console.log(error);
//         return await Promise.reject(error);
//     }
// })

// export const history = createBrowserHistory(); 

axios.interceptors.response.use(async response => {
        await sleep(1000);
        return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response!;
    console.log(error.response);
    switch(status) {
        case 400: 
            if(typeof data === 'string') {
                toast.error(data);
            }
            if(config.method === 'get' && data.errors.hasOwnProperty('id')) {
                history.push('/not-found');
                toast.error('id not found');
            }     
            if(data.errors) {
                const modalStateErrors = [];
                for(const key in data.errors)
                {
                    modalStateErrors.push(data.errors[key])
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }       
            break;
        case 401:
            toast.error('unauthorised');
            break;           
        case 404:
            // toast.error('not found');
            history.push('/not-found');
            toast.error('not found');
            break; 
        case 500:
            // toast.error('server error');
            store.commonStore.setServerError(data);
            // history..forward('/server-error'); //  .push('/server-error');
            history.push('/server-error');
            toast.error('server error');
            break;                                                            
    }
    return Promise.reject(error);
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url).then(responseBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody)
    
}


const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => axios.post('/activities', activity),
    update: (activity: Activity) => axios.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`),
}


const agent = {
    Activities
}

export default agent;
