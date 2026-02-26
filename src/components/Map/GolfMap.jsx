import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const golfIcon = new Icon({
  iconUrl: '/golf-marker.svg',
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

const selectedIcon = new Icon({
  iconUrl: '/golf-marker.svg',
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -50],
});

function FlyToHandler({ flyTo }) {
  const map = useMap();
  const prevFlyTo = useRef(null);

  useEffect(() => {
    if (flyTo && flyTo !== prevFlyTo.current) {
      map.flyTo([flyTo.lat, flyTo.lng], 14, { duration: 0.8 });
      prevFlyTo.current = flyTo;
    }
  }, [flyTo, map]);

  return null;
}

function formatPrice(pricing) {
  if (!pricing) return null;
  const prices = [];
  if (pricing.weekday_price) prices.push(`Semaine: ${pricing.weekday_price}${pricing.currency || '€'}`);
  if (pricing.weekend_price) prices.push(`Weekend: ${pricing.weekend_price}${pricing.currency || '€'}`);
  if (pricing.cart_price) prices.push(`Voiturette: ${pricing.cart_price}${pricing.currency || '€'}`);
  return prices;
}

export default function GolfMap({ center, radius, courses, selectedCourse, onCourseSelect, flyTo }) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Circle
        center={[center.lat, center.lng]}
        radius={radius}
        pathOptions={{
          color: '#2d7a3a',
          fillColor: '#2d7a3a',
          fillOpacity: 0.05,
          weight: 2,
          dashArray: '8 4',
        }}
      />

      {courses.map((course) => {
        const isSelected = selectedCourse?.id === course.id;
        const prices = formatPrice(course.pricing);

        return (
          <Marker
            key={course.id}
            position={[course.lat, course.lng]}
            icon={isSelected ? selectedIcon : golfIcon}
            eventHandlers={{ click: () => onCourseSelect(course) }}
          >
            <Popup>
              <div className="course-popup">
                <h3>{course.name}</h3>
                {course.address && <p>{course.address}</p>}
                {course.holes && <p>{course.holes} trous</p>}
                {prices ? (
                  prices.map((p, i) => (
                    <p key={i} className="price-info">{p}</p>
                  ))
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#777' }}>Aucun tarif renseigné</p>
                )}
                {course.website && (
                  <p>
                    <a href={course.website} target="_blank" rel="noopener noreferrer">
                      Site web
                    </a>
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

      <FlyToHandler flyTo={flyTo} />
    </MapContainer>
  );
}
