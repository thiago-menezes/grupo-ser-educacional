'use client';

import { Button, FormControl, Grid, TextField } from 'reshaped';
import { Icon } from '@/components/icon';
import styles from './styles.module.scss';

export function CourseSearchBar() {
  return (
    <Grid
      columns={'1fr auto'}
      gap={2}
      align="end"
      maxWidth="400px"
      className={styles.searchBar}
    >
      <FormControl>
        <FormControl.Label>Qual curso quer estudar?</FormControl.Label>
        <TextField name="course" placeholder="Exemplo: Java" size="medium" />
      </FormControl>

      <Button
        variant="solid"
        color="primary"
        size="medium"
        icon={<Icon name="search" />}
      >
        Buscar
      </Button>
    </Grid>
  );
}
