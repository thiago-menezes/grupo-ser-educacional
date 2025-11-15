import { Divider, View } from 'reshaped';
import styles from './styles.module.scss';

export type CourseAboutProps = {
  description: string;
};

export function CourseAbout({ description }: CourseAboutProps) {
  return (
    <View className={styles.about}>
      <Divider />
      <h2 className={styles.title}>Sobre o curso</h2>
      <View className={styles.description}>
        <p>{description}</p>
      </View>
    </View>
  );
}
