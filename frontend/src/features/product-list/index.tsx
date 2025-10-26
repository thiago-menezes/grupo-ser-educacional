'use client';

import { useProductList } from './hooks';
import styles from './styles.module.scss';
import { currency } from './utils';

export const ProductList = () => {
  const { products, isLoading, isError } = useProductList();

  if (isLoading) return <p className={styles.loading}>Loading products…</p>;

  if (isError)
    return (
      <p className={`${styles.loading} ${styles.error}`}>
        Failed to load products.
      </p>
    );

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Products</h2>
      </div>
      <ul className={styles.list}>
        {products.map((p) => (
          <li key={p.id} className={styles.item}>
            <span>{p.name}</span>
            <span className={styles.price}>{currency(p.price)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
