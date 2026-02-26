import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const fakeCourses = [
  { osm_id: 'fake/1', osm_type: 'way', name: 'Golf de Saint-Germain', lat: 48.8978, lng: 2.0937, website: 'https://www.golfsaintgermain.com', phone: '+33 1 39 10 30 30', holes: '18', operator: 'Golf de Saint-Germain', address: '78100 Saint-Germain-en-Laye' },
  { osm_id: 'fake/2', osm_type: 'way', name: 'Golf National - Albatros', lat: 48.7544, lng: 2.0736, website: 'https://www.golf-national.com', phone: '+33 1 30 43 36 00', holes: '18', operator: 'Fédération Française de Golf', address: '2 Av. du Golf 78280 Guyancourt' },
  { osm_id: 'fake/3', osm_type: 'way', name: 'Golf de Fontainebleau', lat: 48.3905, lng: 2.6711, website: 'https://www.golffontainebleau.com', phone: '+33 1 64 22 32 22', holes: '18', operator: null, address: 'Route de Nemours 77300 Fontainebleau' },
  { osm_id: 'fake/4', osm_type: 'way', name: 'Golf du Château de Versailles', lat: 48.8319, lng: 2.1024, website: null, phone: '+33 1 39 07 04 40', holes: '18', operator: 'Château de Versailles Golf', address: 'Rue du Maréchal Juin 78000 Versailles' },
  { osm_id: 'fake/5', osm_type: 'way', name: 'Golf de Chantilly - Vineuil', lat: 49.1896, lng: 2.4621, website: 'https://www.golfdechantilly.com', phone: '+33 3 44 57 04 43', holes: '18', operator: null, address: '60500 Vineuil-Saint-Firmin' },
  { osm_id: 'fake/6', osm_type: 'way', name: 'Paris International Golf Club', lat: 49.0127, lng: 2.5534, website: 'https://www.parisgolf.com', phone: '+33 1 34 69 90 00', holes: '18', operator: 'Paris International', address: '95560 Baillet-en-France' },
  { osm_id: 'fake/7', osm_type: 'way', name: 'Golf de Saint-Cloud', lat: 48.8456, lng: 2.2134, website: null, phone: '+33 1 47 01 01 85', holes: '18', operator: null, address: '60 Rue du 19 Janvier 92210 Saint-Cloud' },
  { osm_id: 'fake/8', osm_type: 'way', name: 'Golf de Bussy-Guermantes', lat: 48.8386, lng: 2.7012, website: 'https://www.golfbussy.fr', phone: '+33 1 64 66 00 00', holes: '18', operator: 'Blue Green', address: '77600 Bussy-Saint-Georges' },
  { osm_id: 'fake/9', osm_type: 'way', name: 'Golf Disneyland Paris', lat: 48.8632, lng: 2.7845, website: 'https://www.disneylandparis.com/golf', phone: '+33 1 60 45 68 90', holes: '27', operator: 'Disneyland Paris', address: '77700 Magny-le-Hongre' },
  { osm_id: 'fake/10', osm_type: 'way', name: 'Golf de Meaux-Boutigny', lat: 48.9534, lng: 2.8812, website: null, phone: '+33 1 60 25 63 98', holes: '18', operator: null, address: '77470 Boutigny' },
  { osm_id: 'fake/11', osm_type: 'way', name: 'Golf de Rochefort-en-Yvelines', lat: 48.5812, lng: 1.9823, website: 'https://www.golfrochefort.com', phone: '+33 1 30 41 31 81', holes: '18', operator: null, address: '78730 Rochefort-en-Yvelines' },
  { osm_id: 'fake/12', osm_type: 'way', name: 'Golf de Villarceaux', lat: 49.1345, lng: 1.7423, website: null, phone: '+33 1 34 67 73 83', holes: '36', operator: 'Fondation Charles Léopold Mayer', address: '95710 Chaussy' },
  { osm_id: 'fake/13', osm_type: 'way', name: 'Golf de Cély', lat: 48.4612, lng: 2.5234, website: 'https://www.golfcely.com', phone: '+33 1 64 38 03 07', holes: '18', operator: null, address: '77930 Cély-en-Bière' },
  { osm_id: 'fake/14', osm_type: 'way', name: 'Golf des Yvelines', lat: 48.7823, lng: 1.8934, website: null, phone: '+33 1 34 86 48 89', holes: '18', operator: 'Blue Green', address: 'Château de la Couharde 78940 La Queue-les-Yvelines' },
  { osm_id: 'fake/15', osm_type: 'way', name: 'Golf de Marivaux', lat: 48.6534, lng: 2.4123, website: 'https://www.golfmarivaux.com', phone: '+33 1 64 98 85 85', holes: '18', operator: null, address: '91650 Janvry' },
  { osm_id: 'fake/16', osm_type: 'way', name: 'Golf de l\'Isle-Adam', lat: 49.1123, lng: 2.2345, website: null, phone: '+33 1 34 08 11 11', holes: '18', operator: 'Open Golf Club', address: '95290 L\'Isle-Adam' },
  { osm_id: 'fake/17', osm_type: 'way', name: 'Golf de Domont-Montmorency', lat: 49.0312, lng: 2.3245, website: 'https://www.golfdomont.fr', phone: '+33 1 39 91 07 50', holes: '18', operator: null, address: '95330 Domont' },
  { osm_id: 'fake/18', osm_type: 'way', name: 'Golf de Sénart', lat: 48.6312, lng: 2.4934, website: null, phone: '+33 1 60 63 79 00', holes: '9', operator: 'Blue Green', address: '77127 Lieusaint' },
  { osm_id: 'fake/19', osm_type: 'way', name: 'Golf de Courson-Monteloup', lat: 48.5923, lng: 2.1534, website: 'https://www.golfcourson.fr', phone: '+33 1 64 58 80 80', holes: '27', operator: null, address: '91680 Courson-Monteloup' },
  { osm_id: 'fake/20', osm_type: 'way', name: 'Golf de Béthemont', lat: 49.0234, lng: 2.0512, website: null, phone: '+33 1 34 38 68 68', holes: '18', operator: null, address: '95840 Béthemont-la-Forêt' },
];

const fakePricing = [
  { course_idx: 0, weekday_price: 75, weekend_price: 95, cart_price: 35, notes: 'Tarif haute saison' },
  { course_idx: 1, weekday_price: 105, weekend_price: 145, cart_price: 40, notes: 'Parcours Albatros - Ryder Cup 2018' },
  { course_idx: 2, weekday_price: 85, weekend_price: 110, cart_price: 30, notes: null },
  { course_idx: 3, weekday_price: 90, weekend_price: 120, cart_price: 35, notes: 'Vue sur le château' },
  { course_idx: 4, weekday_price: 95, weekend_price: 130, cart_price: 38, notes: 'Réservation obligatoire' },
  { course_idx: 5, weekday_price: 80, weekend_price: 110, cart_price: 32, notes: null },
  { course_idx: 6, weekday_price: 70, weekend_price: 90, cart_price: 28, notes: 'Parcours historique' },
  { course_idx: 7, weekday_price: 55, weekend_price: 75, cart_price: 25, notes: null },
  { course_idx: 8, weekday_price: 65, weekend_price: 85, cart_price: 30, notes: 'Green fee + accès Disney Village' },
  { course_idx: 9, weekday_price: 45, weekend_price: 60, cart_price: 22, notes: null },
  { course_idx: 10, weekday_price: 60, weekend_price: 80, cart_price: 28, notes: 'Cadre champêtre' },
  { course_idx: 11, weekday_price: 50, weekend_price: 70, cart_price: 25, notes: '36 trous disponibles' },
  { course_idx: 12, weekday_price: 65, weekend_price: 85, cart_price: 30, notes: null },
  { course_idx: 13, weekday_price: 48, weekend_price: 65, cart_price: 22, notes: null },
  { course_idx: 14, weekday_price: 55, weekend_price: 72, cart_price: 25, notes: 'Tarif réduit après 14h' },
  { course_idx: 15, weekday_price: 58, weekend_price: 78, cart_price: 28, notes: null },
  { course_idx: 16, weekday_price: 52, weekend_price: 68, cart_price: 24, notes: null },
  { course_idx: 17, weekday_price: 35, weekend_price: 45, cart_price: 20, notes: 'Parcours 9 trous compact' },
  { course_idx: 18, weekday_price: 68, weekend_price: 88, cart_price: 30, notes: '27 trous - tarif 18 trous' },
  { course_idx: 19, weekday_price: 62, weekend_price: 82, cart_price: 28, notes: null },
];

async function seed() {
  console.log('Seeding Supabase with fake golf courses...\n');

  // Insert courses
  const { data: insertedCourses, error: courseError } = await supabase
    .from('courses')
    .upsert(fakeCourses, { onConflict: 'osm_id' })
    .select();

  if (courseError) {
    console.error('Error inserting courses:', courseError.message);
    process.exit(1);
  }

  console.log(`Inserted ${insertedCourses.length} golf courses`);

  // Insert pricing
  const pricingRows = fakePricing.map((p) => ({
    course_id: insertedCourses[p.course_idx].id,
    weekday_price: p.weekday_price,
    weekend_price: p.weekend_price,
    cart_price: p.cart_price,
    currency: 'EUR',
    notes: p.notes,
    source: 'seed',
  }));

  const { data: insertedPricing, error: pricingError } = await supabase
    .from('pricing')
    .insert(pricingRows)
    .select();

  if (pricingError) {
    console.error('Error inserting pricing:', pricingError.message);
    process.exit(1);
  }

  console.log(`Inserted ${insertedPricing.length} pricing entries`);
  console.log('\nSeed complete! Fake golf courses around Paris are ready.');
}

seed();
