import { useState, useCallback } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useCourses } from './hooks/useCourses';
import GolfMap from './components/Map/GolfMap';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Layout/Header';

const DEFAULT_RADIUS = 30000;

export default function App() {
  const { position, loading: geoLoading, error: geoError } = useGeolocation();
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [flyTo, setFlyTo] = useState(null);

  const { courses, loading: coursesLoading, error: coursesError, refetch } = useCourses(
    position?.lat,
    position?.lng,
    radius
  );

  const handleCourseSelect = useCallback((course) => {
    setSelectedCourse(course);
    setFlyTo({ lat: course.lat, lng: course.lng });
  }, []);

  const handleRadiusChange = useCallback((newRadius) => {
    setRadius(newRadius);
  }, []);

  const handlePricingUpdate = useCallback(() => {
    refetch();
  }, [refetch]);

  const loading = geoLoading || coursesLoading;

  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <Sidebar
          courses={courses}
          selectedCourse={selectedCourse}
          onCourseSelect={handleCourseSelect}
          radius={radius}
          onRadiusChange={handleRadiusChange}
          loading={loading}
          error={geoError || coursesError}
          userPosition={position}
          onPricingUpdate={handlePricingUpdate}
        />
        <div className="map-container">
          {position && (
            <GolfMap
              center={position}
              radius={radius}
              courses={courses}
              selectedCourse={selectedCourse}
              onCourseSelect={handleCourseSelect}
              flyTo={flyTo}
            />
          )}
          {loading && (
            <div className="map-overlay">
              <div className="spinner" />
              <p>{geoLoading ? 'Localisation en cours...' : 'Recherche des golfs...'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
