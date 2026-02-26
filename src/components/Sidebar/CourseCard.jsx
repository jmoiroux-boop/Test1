function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr + 'Z');
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "aujourd'hui";
  if (diffDays === 1) return 'hier';
  if (diffDays < 30) return `il y a ${diffDays}j`;
  return `il y a ${Math.floor(diffDays / 30)} mois`;
}

export default function CourseCard({ course, isSelected, onClick, onAddPricing }) {
  const { pricing } = course;

  return (
    <div
      className={`course-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="course-card-header">
        <span className="course-name">{course.name}</span>
        <span className="course-distance">{formatDistance(course.distance)}</span>
      </div>

      {(course.address || course.operator) && (
        <div className="course-details">
          {course.operator && <span>{course.operator}</span>}
          {course.operator && course.address && <span> - </span>}
          {course.address && <span>{course.address}</span>}
        </div>
      )}

      <div className="course-pricing">
        {pricing ? (
          <>
            {pricing.weekday_price && (
              <span className="price-tag">
                Semaine: {pricing.weekday_price}{pricing.currency === 'EUR' ? '€' : pricing.currency}
              </span>
            )}
            {pricing.weekend_price && (
              <span className="price-tag">
                WE: {pricing.weekend_price}{pricing.currency === 'EUR' ? '€' : pricing.currency}
              </span>
            )}
            {pricing.cart_price && (
              <span className="price-tag">
                Cart: {pricing.cart_price}{pricing.currency === 'EUR' ? '€' : pricing.currency}
              </span>
            )}
          </>
        ) : (
          <span className="no-price">Aucun tarif</span>
        )}
      </div>

      <div className="course-links">
        {course.website && (
          <a
            href={course.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Site web
          </a>
        )}
        {course.phone && (
          <a href={`tel:${course.phone}`} onClick={(e) => e.stopPropagation()}>
            {course.phone}
          </a>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddPricing(course);
          }}
        >
          {pricing ? 'Modifier tarif' : 'Ajouter tarif'}
        </button>
      </div>

      {pricing?.submitted_at && (
        <div className="course-details" style={{ marginTop: 4, marginBottom: 0 }}>
          Tarif mis à jour {formatTimeAgo(pricing.submitted_at)}
        </div>
      )}
    </div>
  );
}
