import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { database } from './config/database';
import { ResultSetHeader } from 'mysql2';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/products', async (req: Request, res: Response) => {
	try {
		const [query] = await database().query("select * from products order by id desc");

		res.status(200).json({
			"status": 200,
			"message": "success",
			"data": query
		});
	} catch (error: any) {
		res.status(500).json({
			"status": 500,
			"message": error.toString()
		});
	}
});

app.post('/products', async (req: Request, res: Response) => {
	try {
		const { name, price } = req.body;

		if (!name || price === undefined) {
			res.status(400).json({
				"status": 400,
				"message": "Nama dan harga produk harus diisi"
			});
			return;
		}

		await database().query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price]);

		res.status(200).json({
			"status": 200,
			"message": "success",
			"data": null
		});
	} catch (error: any) {
		res.status(500).json({
			"status": 500,
			"message": error.toString()
		});
	}
});

app.put('/products/:id', async (req: Request, res: Response) => {	
	try {
		const { id } = req.params;
		const { name, price } = req.body;

		const [product] = await database().query('SELECT * FROM products WHERE id = ?', [id]);

		if (Array.isArray(product) && product.length === 0) {
			res.status(400).json({
				"status": 400,
				"message": "Produk tidak ditemukan"
			});
			return;
		}

		await database().query('UPDATE products SET name = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [name, price, id]);

		res.status(200).json({
			"status": 200,
			"message": "success",
			"data": null
		});
	} catch (error: any) {
		res.status(500).json({
			"status": 500,
			"message": error.toString()
		});
	}
});

app.delete('/products/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const [result] = await database().query('DELETE FROM products WHERE id = ?', [id]);

		if ((result as ResultSetHeader).affectedRows === 0) {
			res.status(400).json({
				"status": 400,
				"message": "Produk tidak ditemukan"
			});
			return;
		}

		res.status(204).send();
	} catch (error: any) {
		res.status(500).json({
			"status": 500,
			"message": error.toString()
		});
	}
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
