export async function submitPricing(courseId, pricing) {
  const res = await fetch(`/api/courses/${courseId}/pricing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pricing),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erreur lors de la soumission');
  }

  return res.json();
}
