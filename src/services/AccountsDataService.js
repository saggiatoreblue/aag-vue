import {apiKey, headers} from '../../constants';
import axios from 'axios';

let api = axios.create({
    baseURL: 'https://services.metricsamsi.com/v1.0/dealers/Accounts/Google',
    headers
});

class AccountsService {
    getAll() {
        return api.get('/' + apiKey);
    }
}

export default new AccountsService;
