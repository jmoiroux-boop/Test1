import { useState } from 'react';
import CourseCard from './CourseCard';
import PricingForm from './PricingForm';

export default function Sidebar({
  courses,
  selectedCourse,
  onCourseSelect,
  radius,
  onRadiusChange,
  loading,
  error,
  userPosition,
  onPricingUpdate,
}) {
  const [pricingCourse, setPricingCourse] = useState(null);

  const radiusKm = Math.round(radius / 1000);

  return (
    <aside className="sidebar">
      <div className="sidebar-controls">
        <div className="radius-control">
          <label>Rayon :</label>
          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={radius}
            onChange={(e) => onRadiusChange(parseInt(e.target.value))}
          />
          <span>{radiusKm} km</span>
        </div>
        <div className="course-count">
          {loading
            ? 'Recherche...'
            : `${courses.length} golf${courses.length !== 1 ? 's' : ''} trouvé${courses.length !== 1 ? 's' : ''}`}
        </div>
      </div>

      <div className="sidebar-list">
        {error && (
          <div className="error-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="empty-state">
            <p>Aucun golf trouvé dans ce rayon.</p>
            <p>Essayez d'augmenter le rayon de recherche.</p>
          </div>
        )}

        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isSelected={selectedCourse?.id === course.id}
            onClick={() => onCourseSelect(course)}
            onAddPricing={(c) => setPricingCourse(c)}
          />
        ))}
      </div>

      {pricingCourse && (
        <PricingForm
          course={pricingCourse}
          onClose={() => setPricingCourse(null)}
          onSubmitted={onPricingUpdate}
        />
      )}
    </aside>
  );
}
