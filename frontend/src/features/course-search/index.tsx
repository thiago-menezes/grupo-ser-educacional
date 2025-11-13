'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Badge,
  Button,
  Modal,
  Text,
  TextField,
  FormControl,
  Select,
  View,
  Grid,
} from 'reshaped';
import { Icon } from '@/components/icon';
import { useCurrentInstitution } from '@/hooks/useInstitution';
import { CourseFiltersProvider, useCourseFiltersContext } from './context';
import { FiltersContent } from './filters-content';
import styles from './styles.module.scss';

function CourseSearchPageContent() {
  const {
    activeFilters,
    activeFiltersCount,
    handleRemoveFilter,
    handleClearAllFilters,
  } = useCourseFiltersContext();

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const { institutionId } = useCurrentInstitution();

  return (
    <View className={styles.page}>
      <View className={styles.container}>
        {/* Header Section */}
        <View className={styles.header}>
          <Text variant="body-2" color="neutral-faded">
            <Link className={styles.homeLink} href={`/${institutionId}`}>
              Home
            </Link>{' '}
            /{' '}
            <Text as="strong" color="primary" weight="bold">
              Lista de cursos
            </Text>
          </Text>
          <Text
            as="h1"
            variant={{ m: 'title-6', s: 'featured-3' }}
            weight="bold"
            color="neutral"
          >
            Encontre o curso ideal para você
          </Text>
        </View>

        {/* Search Bar - Mobile/Tablet */}
        <Grid
          columns={'1fr auto'}
          gap={2}
          align="end"
          maxWidth="400px"
          className={styles.searchBar}
        >
          <FormControl>
            <FormControl.Label>Qual curso quer estudar?</FormControl.Label>
            <TextField
              name="course"
              placeholder="Exemplo: Java"
              size="medium"
            />
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

        {/* Filters Button - Only when sidebar is hidden */}
        <View className={styles.filtersButtonSection}>
          <Badge.Container>
            <Badge
              color="critical"
              size="small"
              rounded
              hidden={activeFiltersCount === 0}
            >
              {activeFiltersCount}
            </Badge>
            <Button
              variant="outline"
              size="medium"
              className={styles.filtersButton}
              icon={<Icon name="filter" />}
              onClick={() => setIsFiltersModalOpen(true)}
            >
              Filtros
            </Button>
          </Badge.Container>
        </View>

        {/* Active Filters Tags - Mobile/Tablet (outside sidebar) */}
        {activeFilters.length > 0 && (
          <View className={styles.activeFiltersSection}>
            <View className={styles.activeFilters}>
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant="outline"
                  color="primary"
                  onDismiss={() => handleRemoveFilter(filter.id)}
                  dismissAriaLabel={`Remover filtro ${filter.label}`}
                >
                  {filter.label}
                </Badge>
              ))}
            </View>

            <div>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  handleClearAllFilters();
                }}
                endIcon={<Icon name="trash" size={14} />}
              >
                Limpar todos
              </Button>
            </div>
          </View>
        )}

        {/* Main Content Area */}
        <View className={styles.mainContent}>
          {/* Filters Sidebar - Blue Container */}
          <View className={styles.filtersSidebar}>
            {/* Active Filters Tags - Desktop (inside sidebar) */}

            <FiltersContent isInModal={false} />
          </View>

          {/* Course Grid Container */}
          <View className={styles.coursesGridContainer}>
            {/* Results Header */}
            <View className={styles.resultsHeader}>
              <Text variant="body-2" color="neutral">
                150 cursos encontrados
              </Text>
              <View className={styles.sortContainer}>
                <Text variant="body-2" color="neutral">
                  Ordenar por
                </Text>
                <Select
                  name="sort"
                  options={[{ value: 'relevance', label: 'Mais relevantes' }]}
                  size="small"
                />
              </View>
            </View>

            {/* Course Grid - Pink Containers */}
            <Grid
              columns={{ s: 1, m: 2, l: 2, xl: 3 }}
              gap={4}
              className={styles.coursesGrid}
            >
              {/* First 6 course cards - Pink containers */}
              {Array.from({ length: 6 }).map((_, index) => (
                <View key={index} className={styles.courseCard}>
                  {/* Course card content */}
                </View>
              ))}

              {/* Banner Container - Green Container */}
              <View className={styles.bannerContainer}>
                {/* Banner content will go here */}
              </View>

              {/* Remaining course cards - Pink containers */}
              {Array.from({ length: 6 }).map((_, index) => (
                <View key={`more-${index}`} className={styles.courseCard}>
                  {/* Course card content */}
                </View>
              ))}
            </Grid>
          </View>
        </View>
      </View>

      {/* Filters Modal - Mobile/Tablet */}
      <Modal
        active={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        size="large"
        className={styles.filtersModal}
      >
        <View className={styles.filtersModalContent}>
          <FiltersContent isInModal={true} />
        </View>
      </Modal>
    </View>
  );
}

export function CourseSearchPage() {
  return (
    <CourseFiltersProvider>
      <CourseSearchPageContent />
    </CourseFiltersProvider>
  );
}
