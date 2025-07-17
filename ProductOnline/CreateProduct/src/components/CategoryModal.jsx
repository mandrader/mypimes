import React, { useState } from 'react';
import styles from './Modal.module.css';

const CategoryModal = ({ isOpen, onClose, onSave }) => {
    const [nombre, setNombre] = useState('');
    const [indice, setIndice] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async e => {
        e.preventDefault();

        await onSave({
            nombre_categoria: nombre.trim(),
            indice_pedido_categoria: parseInt(indice)
        });

        setNombre('');
        setIndice('');
        onClose(); // ⚠️ Cierra el modal después de guardar
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>Agregar Categoría</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="cat-name">Nombre</label>
                    <input
                        id="cat-name"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                        title='Ingresa el nombre de la categoria'
                    />

                    <label htmlFor="cat-order">Orden</label>
                    <input
                        id="cat-order"
                        type="number"
                        min="1"
                        value={indice}
                        onChange={e => setIndice(e.target.value)}
                        required
                        title='posiciòn en la lista. 1 es el primero de la lista'
                    />

                    <div className={styles.buttons}>
                        <button type="button" title='Cerrar formulario' onClick={onClose}>🔙</button>
                        <button type="submit" title='Guardar los cambios realizados' disabled={!nombre || !indice}>
                             💾 
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;