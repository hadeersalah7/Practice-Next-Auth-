import db from './db';

export function getTrainings():any {
  const stmt = db.prepare('SELECT * FROM trainings');
  return stmt.all();
}
