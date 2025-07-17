const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// 📦 Obtener todas las categorías
router.get('/categorias', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_categoria, nombre_categoria, indice_pedido AS indice_pedido_categoria FROM catalogo_categoria ORDER BY indice_pedido'
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Error al cargar categorías' });
  }
});

// 🍽️ Obtener productos por categoría
router.get('/categorias/:id/productos', async (req, res) => {
  const categoriaId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT 
         p.id_producto,
         p.nombre_producto,
         p.precio_producto,
         p.indice_pedido_producto,
         c.id_categoria,
         c.nombre_categoria
       FROM catalogo_producto p
       JOIN catalogo_categoria c ON p.categoria_id = c.id_categoria
       WHERE p.categoria_id = ?
       ORDER BY p.indice_pedido_producto`,
      [categoriaId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: 'No se encontraron productos para esta categoría.'
      });
    }

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Error al obtener productos por categoría',
      error: error.message
    });
  }
});

// 🗂️ Vista agrupada para componente Catalogo.jsx
router.get('/catalogo', async (req, res) => {
  try {
    const [categorias] = await db.query(
      'SELECT id_categoria, nombre_categoria, indice_pedido AS indice_pedido_categoria FROM catalogo_categoria ORDER BY indice_pedido'
    );


    const catalogo = [];

    for (const categoria of categorias) {
      const [productos] = await db.query(
        'SELECT id_producto, nombre_producto, precio_producto, indice_pedido_producto FROM catalogo_producto WHERE categoria_id = ? ORDER BY indice_pedido_producto',
        [categoria.id_categoria]
      );

      catalogo.push({
        ...categoria,
        productos
      });
    }

    res.status(200).json(catalogo);
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Error al cargar el catálogo completo',
      error: error.message
    });
  }
});

// 📤 POST: Agregar nueva categoría
router.post('/categorias', async (req, res) => {
  const { nombre_categoria, indice_pedido_categoria } = req.body;

  if (!nombre_categoria || indice_pedido_categoria == null)
    return res.status(400).json({ error: 'Faltan campos requeridos' });

  if (typeof nombre_categoria !== 'string' || nombre_categoria.trim() === '')
    return res.status(400).json({ error: 'Nombre inválido' });

  if (isNaN(indice_pedido_categoria) || indice_pedido_categoria < 1)
    return res.status(400).json({ error: 'El orden debe ser un número positivo' });

  try {
    const [existente] = await db.query(
      'SELECT * FROM catalogo_categoria WHERE nombre_categoria = ?',
      [nombre_categoria]
    );

    if (existente.length > 0)
      return res.status(409).json({ error: 'La categoría ya existe' });

    await db.query(
      'INSERT INTO catalogo_categoria (nombre_categoria, indice_pedido) VALUES (?, ?)',
      [nombre_categoria, indice_pedido_categoria]
    );

    res.status(201).json({ mensaje: 'Categoría agregada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🆕 POST: Agregar nuevo producto
router.post('/productos', async (req, res) => {
  const {
    nombre_producto,
    precio_producto,
    indice_pedido_producto,
    categoria_id
  } = req.body;

  if (!nombre_producto || precio_producto == null || indice_pedido_producto == null || !categoria_id)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });

  if (typeof nombre_producto !== 'string' || nombre_producto.trim() === '')
    return res.status(400).json({ error: 'Nombre inválido' });

  if (isNaN(precio_producto) || precio_producto < 0)
    return res.status(400).json({ error: 'Precio inválido' });

  if (isNaN(indice_pedido_producto) || indice_pedido_producto < 1)
    return res.status(400).json({ error: 'El orden debe ser un número positivo' });

  try {
    const [categoria] = await db.query(
      'SELECT * FROM catalogo_categoria WHERE id_categoria = ?',
      [categoria_id]
    );

    if (categoria.length === 0)
      return res.status(404).json({ error: 'La categoría no existe' });

    await db.query(
      'INSERT INTO catalogo_producto (nombre_producto, precio_producto, indice_pedido_producto, categoria_id) VALUES (?, ?, ?, ?)',
      [nombre_producto, precio_producto, indice_pedido_producto, categoria_id]
    );

    res.status(201).json({ mensaje: 'Producto agregado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


//Endpoint Delete - Backend Express
//DELETE/v1/categorias/:id
router.delete('/categorias/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    // ✅ Elimina productos asociados primero (efecto cascada manual)
    await db.query('DELETE FROM catalogo_producto WHERE categoria_id = ?', [id]);

    // ✅ Luego elimina la categoría
    const [result] = await db.query('DELETE FROM catalogo_categoria WHERE id_categoria = ?', [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });

    res.status(200).json({ mensaje: 'Categoría eliminada con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

//Delete/v1/productos/:id
router.delete('/productos/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result] = await db.query('DELETE FROM catalogo_producto WHERE id_producto = ?', [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    res.status(200).json({ mensaje: 'Producto eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

//Endpoints PATCH
//PATCH /v1/categorias/:id
router.patch('/categorias/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre_categoria, indice_pedido_categoria } = req.body;

  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  if (!nombre_categoria || typeof nombre_categoria !== 'string' || nombre_categoria.trim() === '')
    return res.status(400).json({ error: 'Nombre inválido' });

  if (isNaN(indice_pedido_categoria) || indice_pedido_categoria < 1)
    return res.status(400).json({ error: 'Índice inválido' });

  try {
    const [result] = await db.query(
      'UPDATE catalogo_categoria SET nombre_categoria = ?, indice_pedido = ? WHERE id_categoria = ?',
      [nombre_categoria, indice_pedido_categoria, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Categoría no encontrada' });

    res.status(200).json({ mensaje: 'Categoría actualizada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno al actualizar categoría' });
  }
});

//PATCH /v1/productos/:id
router.patch('/productos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre_producto, precio_producto, indice_pedido_producto } = req.body;

  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  if (!nombre_producto || typeof nombre_producto !== 'string' || nombre_producto.trim() === '')
    return res.status(400).json({ error: 'Nombre inválido' });

  if (isNaN(precio_producto) || precio_producto < 0)
    return res.status(400).json({ error: 'Precio inválido' });

  if (isNaN(indice_pedido_producto) || indice_pedido_producto < 1)
    return res.status(400).json({ error: 'Índice inválido' });

  try {
    const [result] = await db.query(
      'UPDATE catalogo_producto SET nombre_producto = ?, precio_producto = ?, indice_pedido_producto = ? WHERE id_producto = ?',
      [nombre_producto, precio_producto, indice_pedido_producto, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });

    res.status(200).json({ mensaje: 'Producto actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno al actualizar producto' });
  }
});




module.exports = router;