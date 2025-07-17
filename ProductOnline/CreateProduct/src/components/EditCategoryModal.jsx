import React, { useState, useEffect } from 'react';
import styles from './EditCategoryModal.module.css';

const EditCategoryModal = ({ isOpen, onClose, onUpdate, initialValues }) => {
    const [nombre, setNombre] = useState('');
    const [indice, setIndice] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');


    useEffect(() => {
        if (initialValues) {
            setNombre(initialValues.nombre_categoria ?? '');
            setIndice(
                typeof initialValues.indice_pedido_categoria === 'number'
                    ? initialValues.indice_pedido_categoria.toString()
                    : ''
            );
            setSuccessMsg('');  // 🧹 Limpiar alerta cuando se abre
            setErrorMsg('');    // 🧹 También puedes limpiar errores
        }
    }, [initialValues]);


    if (!isOpen || !initialValues) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nombreLimpio = nombre.trim();
        const indiceNum = parseInt(indice); // o parseFloat/precio según el modal

        if (!nombreLimpio || isNaN(indiceNum) || indiceNum < 1) {
            setErrorMsg('Por favor completa todos los campos correctamente.');
            return;
        }

        try {
            const response = await onUpdate({
                nombre_categoria: nombreLimpio,
                indice_pedido_categoria: indiceNum
            });

            if (response?.error) {
                setErrorMsg(response.error);
                return;
            }

            setSuccessMsg('✅ ¡Actualizado exitosamente!');

            // Esperar 1.2 segundos antes de cerrar el modal
            setTimeout(() => {
                onClose();
            }, 1200);

        } catch (err) {
            setErrorMsg('Ocurrió un error al conectar con el servidor.');
        }
    };


    return (
        <div className={styles.modalOverlay}>
            <form className={styles.modal} onSubmit={handleSubmit}>
                <h2>Editar categoría</h2>

                {successMsg && <p className={styles.success}>{successMsg}</p>}



                <label htmlFor="nombre">Nombre</label>
                <input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    title='Nombre que se mostrarà en el menù de categorias'
                />

                <label htmlFor="indice">Orden</label>
                <input
                    id="indice"
                    type="number"
                    min="1"
                    value={indice}
                    onChange={(e) => setIndice(e.target.value)}
                    title='Nùmero que define el orden de vizualizaciòn de la lista'
                />
                <div className={styles.buttons}>
                    <button type="button" title='Cerrar formulario' onClick={onClose}>🔙</button>
                <button type="submit" title='Confirmar y actualizar los datos' disabled={!nombre || !indice}>
                    📝
                </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategoryModal;

