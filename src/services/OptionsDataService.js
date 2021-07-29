import {apiKey, headers} from '../../constants';
import axios from 'axios';

let api = axios.create({
    baseURL: 'https://services.metricsamsi.com/v1.0/dealers',
    headers
});

class OptionsService {
    getAll(id) {
        let url = (id) ? `/options/${id}/${apiKey}` : `/options/${apiKey}`
        return api.get(url);
    }

    create(data) {
        let url = `/options/${apiKey}`;
        return api.post(url, data);
    }
}

export default new OptionsService;
