import React, { useState, useEffect } from 'react';
import styles from './EditProductModal.module.css';

const EditProductModal = ({ isOpen, onClose, onUpdate, initialValues }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [indice, setIndice] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialValues) {
      setNombre(initialValues.nombre_producto ?? '');
      setPrecio(
        initialValues.precio_producto !== undefined
          ? initialValues.precio_producto.toString()
          : ''
      );
      setIndice(
        typeof initialValues.indice_pedido_producto === 'number'
          ? initialValues.indice_pedido_producto.toString()
          : ''
      );
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [initialValues]);



  if (!isOpen || !initialValues) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombreLimpio = nombre.trim();
    const precioNum = parseFloat(precio);
    const indiceNum = parseInt(indice);

    if (
      !nombreLimpio ||
      isNaN(precioNum) || precioNum < 0 ||
      isNaN(indiceNum) || indiceNum < 1
    ) {
      setErrorMsg('Por favor completa todos los campos correctamente.');
      return;
    }

    try {
      const response = await onUpdate({
        nombre_producto: nombreLimpio,
        precio_producto: precioNum,
        indice_pedido_producto: indiceNum
      });

      if (response?.error) {
        setErrorMsg(response.error);
        return;
      }

      setSuccessMsg('✅ ¡Actualizado exitosamente!');

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
        <h2>Editar producto</h2>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        {successMsg && <p className={styles.success}>{successMsg}</p>}

        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          title='Nombre que se mostrara el menù de productos'
        />

        <label htmlFor="precio">Precio</label>
        <input
          id="precio"
          type="number"
          step="0.01"
          min="0"
          value={precio ?? ''}
          onChange={(e) => setPrecio(e.target.value)}
          title='Precio que se va mostrar en el menù de productos'
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
        <div  className={styles.buttons}>
          <button type="button" title='Cerrar formulario' onClick={onClose}>🔙</button>
          <button type="submit" title='Confirmar y actualizar los datos' disabled={!nombre || !precio || !indice}>
            📝
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductModal;

