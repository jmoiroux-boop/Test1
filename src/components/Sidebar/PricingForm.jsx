import { useState } from 'react';
import { submitPricing } from '../../services/api';

export default function PricingForm({ course, onClose, onSubmitted }) {
  const [weekdayPrice, setWeekdayPrice] = useState(course.pricing?.weekday_price || '');
  const [weekendPrice, setWeekendPrice] = useState(course.pricing?.weekend_price || '');
  const [cartPrice, setCartPrice] = useState(course.pricing?.cart_price || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submitPricing(course.id, {
        weekday_price: weekdayPrice ? parseFloat(weekdayPrice) : null,
        weekend_price: weekendPrice ? parseFloat(weekendPrice) : null,
        cart_price: cartPrice ? parseFloat(cartPrice) : null,
        currency: 'EUR',
        notes: notes || null,
      });
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pricing-form-overlay" onClick={onClose}>
      <form className="pricing-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>Tarifs - {course.name}</h3>

        {error && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}

        <div className="form-group">
          <label>Green fee semaine</label>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="Ex: 45"
            value={weekdayPrice}
            onChange={(e) => setWeekdayPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Green fee weekend</label>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="Ex: 65"
            value={weekendPrice}
            onChange={(e) => setWeekendPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Location voiturette</label>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="Ex: 30"
            value={cartPrice}
            onChange={(e) => setCartPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            rows="2"
            placeholder="Infos complémentaires..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Envoi...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
