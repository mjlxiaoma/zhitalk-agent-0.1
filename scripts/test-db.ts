
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../lib/db/schema';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function main() {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error('Error: POSTGRES_URL is not defined in .env.local');
    process.exit(1);
  }

  console.log('Attempting to connect to database...');
  
  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, { schema });

  try {
    // Simple query to test connection
    const result = await db.execute('SELECT 1');
    console.log('Connection successful!');
    console.log('Test query result:', result);
    
    // Optional: Try to query users table if it exists
    // const users = await db.query.user.findMany({ limit: 1 });
    // console.log('Users found:', users.length);

  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await client.end();
  }
}

main();
