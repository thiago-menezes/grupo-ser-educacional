import { Divider, Text, View } from 'reshaped';
import styles from './styles.module.scss';

export type CourseAboutProps = {
  description: string;
};

export function CourseAbout({ description }: CourseAboutProps) {
  return (
    <View className={styles.about}>
      <Divider />
      <Text as="h2" variant="featured-2" weight="medium">
        Sobre o curso
      </Text>

      <View className={styles.description}>
        <Text variant="body-2" color="neutral-faded">
          {description}
        </Text>
      </View>
    </View>
  );
}
