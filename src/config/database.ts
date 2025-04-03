import mysql from 'mysql2';

export const database = () => {
	try {
		const pool = mysql.createPool({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			port: Number(process.env.DB_PORT) || 3306,
			ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : undefined,
			// connectionLimit: 10, // Batas koneksi maksimum di pool
  		// queueLimit: 0, // Tidak ada batas untuk antrean koneksi
		});
		const promisePool = pool.promise();

		return promisePool;
	} catch (error) {
		console.error('Database connection failed:', error);
		process.exit(1);
	}
}
