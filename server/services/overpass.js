function buildAddress(tags) {
  if (!tags) return null;
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:postcode'],
    tags['addr:city'],
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : null;
}

export async function fetchGolfCourses(lat, lng, radiusMeters) {
  const query = `
    [out:json][timeout:25];
    (
      way["leisure"="golf_course"](around:${radiusMeters},${lat},${lng});
      relation["leisure"="golf_course"](around:${radiusMeters},${lat},${lng});
      node["leisure"="golf_course"](around:${radiusMeters},${lat},${lng});
    );
    out center tags;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  const data = await response.json();

  return data.elements.map((el) => ({
    osm_id: `${el.type}/${el.id}`,
    osm_type: el.type,
    name: el.tags?.name || 'Golf inconnu',
    lat: el.center?.lat ?? el.lat,
    lng: el.center?.lon ?? el.lon,
    website: el.tags?.website || el.tags?.['contact:website'] || null,
    phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
    holes: el.tags?.golf || el.tags?.['golf:course'] || null,
    operator: el.tags?.operator || null,
    address: buildAddress(el.tags),
  }));
}
