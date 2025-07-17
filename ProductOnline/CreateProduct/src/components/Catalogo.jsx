import React, { useState, useEffect, useRef } from 'react';
import styles from './Catalogo.module.css';
import CategoryModal from './CategoryModal';
import ProductModal from './ProductModal';
import EditProductModal from './EditProductModal';
import EditCategoryModal from './EditCategoryModal';


const Catalogo = () => {
  const [catalogo, setCatalogo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const catalogoRef = useRef(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);







  // 🔄 Función reutilizable para cargar catálogo
  const fetchCatalogo = async () => {
    try {
      const response = await fetch('http://localhost:3000/v1/catalogo');
      if (!response.ok) throw new Error('No se pudo obtener el catálogo');
      const data = await response.json();
      setCatalogo(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogo();
  }, []);

  // 🔁 Reiniciar scroll al cambiar categoría
  useEffect(() => {
    if (catalogoRef.current) {
      catalogoRef.current.scrollTop = 0;
    }
  }, [activeIndex]);

  useEffect(() => {
    document.body.style.overflow = (showCategoryModal || showProductModal) ? 'hidden' : 'auto';
  }, [showCategoryModal, showProductModal]);

  if (loading) return <p>Cargando catálogo...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleAddCategory = async ({ nombre_categoria, indice_pedido_categoria }) => {
    try {
      const response = await fetch('http://localhost:3000/v1/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_categoria, indice_pedido_categoria })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Error al guardar categoría');
        return;
      }

      setShowCategoryModal(false);
      fetchCatalogo();
    } catch (err) {
      alert('Error de conexión con el servidor');
    }
  };

  const handleAddProduct = async ({ nombre_producto, precio_producto, indice_pedido_producto, categoria_id }) => {
    await fetch('http://localhost:3000/v1/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_producto, precio_producto, indice_pedido_producto, categoria_id })
    });
    setShowProductModal(false);
    fetchCatalogo(); // recarga productos
  };

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm('¿Seguro que deseas eliminar esta categoría?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/v1/categorias/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Error al eliminar');
        return;
      }

      fetchCatalogo();
    } catch (err) {
      alert('Error al conectar con el servidor');
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm('¿Eliminar este producto?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/v1/productos/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Error al eliminar producto');
        return;
      }

      fetchCatalogo(); // Recarga catálogo actualizado
    } catch (err) {
      alert('No se pudo conectar con el servidor');
    }
  };

  const handleEditCategory = async (id, { nombre_categoria, indice_pedido_categoria }) => {
    try {
      const response = await fetch(`http://localhost:3000/v1/categorias/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_categoria: nombre_categoria.trim(), indice_pedido_categoria })
      });

      const data = await response.json();

      if (!response.ok) {
        return data; // Devuelve el error para que el modal lo maneje
      }

      fetchCatalogo(); // Recarga categorías
      return data;
    } catch (err) {
      return { error: 'No se pudo conectar con el servidor' };
    }
  };


  const handleUpdateProduct = async (id, form) => {
    try {
      const response = await fetch(`http://localhost:3000/v1/productos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        return data; // Devuelve el error para que el modal lo maneje
      }

      fetchCatalogo(); // Recarga catálogo actualizado
      return data;
    } catch (err) {
      return { error: 'No se pudo conectar con el servidor' };
    }
  };





  return (
    <div className={styles.catalogoContainer}>
      <aside className={styles.sidebar}>
        <button
          className={styles.addBtnCategory}
          title='Agregar Categoria'
          onClick={() => setShowCategoryModal(true)}
        >
          ➕
        </button>
        <h2>Categorías</h2>
        <ul>
          {catalogo.map((cat, index) => (
            <li
              key={cat.id_categoria}
              className={`${styles.categoriaItem} ${index === activeIndex ? styles.active : ''}`}
              onClick={() => setActiveIndex(index)}
            ><span onClick={() => setActiveIndex(index)}>{cat.nombre_categoria}</span>
              <button
                className={styles.deleteBtn}
                title='Eliminar esta categoria'
                onClick={() => handleDeleteCategory(cat.id_categoria)}>🗑️</button>
              <button
                className={styles.editBtn}
                title='Editar esta categoria'
                onClick={() => {
                  console.log('Categoría seleccionada para editar:', cat);
                  setEditingCategory(cat);
                }}
              >
                ✏️
              </button>

            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.productosGrid} ref={catalogoRef}>
        <button
          className={styles.addBtn}
          title='Agregar producto'
          onClick={() => setShowProductModal(true)}
        >
          ➕
        </button>

        {catalogo[activeIndex]?.productos.map((prod) => (
          <div key={prod.id_producto} className={styles.productCard}>
            <div className={styles.productIcon}>📦</div>

            <div className={styles.productName}>
              {prod.nombre_producto}
              <button
                className={styles.deleteBtn}
                title="Eliminar este producto"
                onClick={() => handleDeleteProduct(prod.id_producto)}
              >
                🗑️
              </button>
              <button
                className={styles.editBtn}
                title="Editar este producto"
                onClick={() => setEditingProduct(prod)}
              >
                ✏️
              </button>
            </div>

            <div className={styles.productPrice}>
              ${Number(prod.precio_producto).toFixed(2)}
            </div>
          </div>
        ))}
      </main>

      {/* Modales al final del render */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleAddCategory}
      />

      <EditCategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onUpdate={(form) => handleEditCategory(editingCategory.id_categoria, form)}
        initialValues={editingCategory}
      />



      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSave={handleAddProduct}
        categoriaId={catalogo[activeIndex]?.id_categoria}
      />

      <EditProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onUpdate={(form) => handleUpdateProduct(editingProduct.id_producto, form)}
        initialValues={editingProduct}
      />




    </div>
  );
};

export default Catalogo;