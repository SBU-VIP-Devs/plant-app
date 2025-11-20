/**
 * Database Service Entry Point
 *
 * This is the single point of access for all database operations.
 * To switch database providers, simply change the import below.
 */

// Export types and interfaces
export * from './types';
export * from './interface';

// Import the active database implementation
import { firebaseDatabaseService } from './firebase';

// Export the database service
// To switch to a different database (e.g., MongoDB), change the import above:
// import { mongoDatabaseService } from './mongodb';
// export const db = mongoDatabaseService;
export const db = firebaseDatabaseService;

// Also export as default for convenience
export default db;
