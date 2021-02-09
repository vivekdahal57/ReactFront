/**
 * Created by i82325 on 5/6/2019.
 */
import React, {Component} from 'react';
import Navigation from './Navigation';
import {CarService} from '../service/CarService';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';

export class Home extends Component {
    constructor() {
        super();
        this.state = {
            cars: [],
            books: [],
            users: [],
        };
        this.carservice = new CarService();
    }

    componentDidMount() {
        this.carservice.getCarsSmall().then(data => this.setState({cars: data}));
    }

    render() {
        return (
            <div>
                <Navigation />
                <p>

                </p>
                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <DataTable value={this.state.cars}
                                   style={{marginBottom: '20px'}}
                                   responsive={true}
                                   header="Car Info">
                            <Column field="vin" header="Vin" sortable={true}/>
                            <Column field="year" header="Year" sortable={true}/>
                            <Column field="brand" header="Brand"
                                    sortable={true}/>
                            <Column field="color" header="Color"
                                    sortable={true}/>
                        </DataTable>
                    </div>
                </div>
            </div>
        );
    };
}
;

export default Home;