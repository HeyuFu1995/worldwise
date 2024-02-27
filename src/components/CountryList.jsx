import styles from './CountryList.module.css'
import Spinner from './Spinner';
import Message from './Message';
import CountryItem from "./CountryItem";
import { useCities } from '../contexts/CitiesContext';

function CountryList() {
    const { cities, isLoading } = useCities();
    if (isLoading) return <Spinner />;

    if (!cities.length) return <Message message="There is no City" />

    const countries = cities.reduce((arr, city) => {
        if (!arr.map(el => el.country).includes(city.country)) {
            return [...arr, { country: city.country, emoji: city.emoji, id: city.id }];
        }
        else {
            return arr;
        }
    }, []);

    return (
        <ul className={styles.cityList}>
            {countries.map(country => (<CountryItem key={country.id} country={country} />))}
        </ul>
    )
}

export default CountryList;
