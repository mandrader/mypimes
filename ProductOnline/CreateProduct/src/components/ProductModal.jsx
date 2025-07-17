import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';



const ProductModal = ({ isOpen, onClose, onSave, categoriaId, initialValues }) => {
  const [nombre, setNombre] = useState(initialValues?.nombre_producto || '');
  const [precio, setPrecio] = useState(initialValues?.precio_producto?.toString() || '');
  const [indice, setIndice] = useState(initialValues?.indice_pedido_producto?.toString() || '');

  useEffect(() => {
    if (initialValues) {
      setNombre(initialValues.nombre_producto || '');
      setPrecio(initialValues.precio_producto?.toString() || '');
      setIndice(initialValues.indice_pedido_producto?.toString() || '');
    }
  }, [initialValues]);


    if (!isOpen || !categoriaId) return null; // ⚠️ Verifica que haya categoría seleccionada

    const handleSubmit = async e => {
        e.preventDefault();

        await onSave({
            nombre_producto: nombre,
            precio_producto: parseFloat(precio),
            indice_pedido_producto: parseInt(indice),
            categoria_id: categoriaId
        });

        // 🔄 Limpieza de campos
        setNombre('');
        setPrecio('');
        setIndice('');
        onClose();
    };  

    

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>Agregar Producto</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="prod-name">Nombre</label>
                    <input
                        id="prod-name"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                        title='Ingresa el nombre del producto'
                    />
                    <label htmlFor="prod-price">Precio</label>
                    <input
                        id="prod-price"
                        type="number"
                        step="0.01"
                        value={precio}
                        onChange={e => setPrecio(e.target.value)}
                        required
                        min="0"
                        title='Ingresa el precio del producto'
                    />
                    <label htmlFor="prod-order">Orden</label>
                    <input
                        id="prod-order"
                        type="number"
                        value={indice}
                        onChange={e => setIndice(e.target.value)}
                        required
                        min="1"
                        title='posiciòn en la lista. 1 es el primero de la lista'
                    />
                    <div className={styles.buttons}>
                        <button type="button" title='Cerrar formulario' onClick={onClose}>🔙</button>
                        <button type="submit" title='Guardar los cambios realizados' disabled={!nombre || !precio || !indice}>
                            💾
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;