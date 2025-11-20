import { Accordion, Divider, Text, View } from 'reshaped';
import { MOCK_FAQ_ITEMS } from '../mock';
import styles from './styles.module.scss';

export function CourseFAQSection() {
  return (
    <View className={styles.section}>
      <Divider />
      <View className={styles.header}>
        <Text
          as="h2"
          variant="featured-2"
          weight="medium"
          className={styles.title}
        >
          Perguntas frequentes
        </Text>
        <Text as="p" variant="body-3" className={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
      </View>

      <View className={styles.faqList}>
        {MOCK_FAQ_ITEMS.map((item) => (
          <Accordion key={item.id}>
            <Accordion.Trigger>
              <View
                backgroundColor="primary-faded"
                height="32px"
                borderRadius="small"
              >
                {item.question}
              </View>
            </Accordion.Trigger>
            <Accordion.Content>
              <Text variant="body-2" color="neutral-faded">
                {item.answer}
              </Text>
            </Accordion.Content>
          </Accordion>
        ))}
      </View>
    </View>
  );
}
