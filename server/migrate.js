import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const sql = readFileSync(path.join(__dirname, 'migration.sql'), 'utf-8');

console.log('Running migration on Supabase...');
console.log('SQL:\n', sql);
console.log('\n--- IMPORTANT ---');
console.log('Copiez le SQL ci-dessus et exécutez-le dans le SQL Editor de Supabase :');
console.log(`${process.env.SUPABASE_URL}/project/default/sql`);
console.log('\nOu utilisez le dashboard Supabase > SQL Editor > New query > Coller > Run');
