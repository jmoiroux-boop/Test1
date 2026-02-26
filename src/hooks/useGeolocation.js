import { useState, useEffect } from 'react';

const DEFAULT_POSITION = { lat: 48.8566, lng: 2.3522 }; // Paris

export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      setPosition(DEFAULT_POSITION);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError('Impossible d\'obtenir votre position. Affichage par défaut sur Paris.');
        setPosition(DEFAULT_POSITION);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { position, error, loading };
}
