/**
 * Created by i82325 on 5/8/2019.
 */
import axios from 'axios';

export class CarService {
    getCarsSmall() {
        return axios.get('data/cars-small.json')
            .then(res => res.data.data);
    }
}