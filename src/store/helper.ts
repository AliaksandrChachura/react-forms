import { type Country } from './types';
import { type apiCountry } from '../api/baseUrl';

const serializeCountry = (country: apiCountry): Country => {
  return {
    name: country.name,
    capital: country.capital,
    population: country.population,
    region: country.region,
    flag: country.flag.small,
    alpha2Code: country.alpha2Code,
    alpha3Code: country.alpha3Code,
    altSpellings: country.altSpellings,
    area: country.area,
    borders: country.borders,
  };
};

export { serializeCountry };
