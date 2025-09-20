import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Countries } from './pages/countries/countries';
import { CountryDetail } from './pages/country-detail/country-detail';


export const routes: Routes = [
    {path: '', component: Home},
    {path: 'countries', component: Countries},
    {path: 'countries/:id', component: CountryDetail}
];
