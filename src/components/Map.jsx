import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import useUrlPosition from '../hooks/useUrlPosition';

function Map() {
    const [position, setPosition] = useState([40, 0]);
    const { cities } = useCities();
    const { isLoading: isLoadingPosition, position: geoLocationPosition, getPosition } = useGeolocation();
    const [lat, lng] = useUrlPosition();

    useEffect(function () {
        if (geoLocationPosition) {
            setPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
        }
    }, [geoLocationPosition]);

    useEffect(function () {
        if (lat && lng) {
            setPosition([lat, lng]);
        }
    }, [lat, lng]);

    return (
        <div className={styles.mapContainer}>
            <Button type='position' onClick={getPosition}>{isLoadingPosition ? "Loading..." : "Use your Position"}</Button>
            <MapContainer center={position} zoom={6} scrollWheelZoom className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) =>
                (<Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                    <Popup>
                        <span>{city.emoji}</span>
                        <span>{city.cityName}</span>
                    </Popup>
                </Marker>
                ))}
                <ChangeCenter position={position} />
                <DetectClick />
            </MapContainer>
        </div>
    )
}

function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick() {
    const navigate = useNavigate();
    useMapEvents({
        click: e => {

            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
        },
    })
}

export default Map;
