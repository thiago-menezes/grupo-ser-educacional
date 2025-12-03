import Image from 'next/image';
import { useState } from 'react';
import { Button, Tabs, Text, View } from 'reshaped';
import { Icon } from '@/components';
import { MOCK_COORDINATOR, MOCK_TEACHERS } from '../mock';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CourseCoordinationProps = {
  course: CourseDetails;
};

export function CourseCoordination({
  course: _course,
}: CourseCoordinationProps) {
  const [activeTab, setActiveTab] = useState<'coordination' | 'pedagogical'>(
    'coordination',
  );

  return (
    <View className={styles.coordination}>
      <Tabs
        onChange={(args) =>
          setActiveTab(args.value as 'coordination' | 'pedagogical')
        }
        variant="borderless"
        defaultValue="coordination"
      >
        <Tabs.List>
          <Tabs.Item value="coordination" icon={<Icon name="user" />}>
            Coordenação e Docentes
          </Tabs.Item>

          <Tabs.Item value="pedagogical" icon={<Icon name="book" />}>
            Projeto pedagógico
          </Tabs.Item>
        </Tabs.List>
      </Tabs>

      <View className={styles.tabContent}>
        {activeTab === 'coordination' && (
          <View className={styles.coordinatorContent}>
            <View className={styles.coordinatorCard}>
              {MOCK_COORDINATOR.photo ? (
                <Image
                  src={MOCK_COORDINATOR.photo}
                  alt={`Foto do coordenador(a) ${MOCK_COORDINATOR.name}`}
                  className={styles.coordinatorPhoto}
                  width={120}
                  height={120}
                />
              ) : (
                <View className={styles.coordinatorPhotoPlaceholder}>
                  <Icon name="user" size={64} />
                </View>
              )}
              <View className={styles.coordinatorInfo}>
                <Text
                  as="h3"
                  variant="body-2"
                  weight="bold"
                  className={styles.coordinatorName}
                >
                  {MOCK_COORDINATOR.name}
                </Text>
                <Text
                  variant="body-3"
                  color="neutral-faded"
                  className={styles.coordinatorDescription}
                >
                  {MOCK_COORDINATOR.description}
                </Text>
                <Button variant="outline" size="small">
                  Contate a coordenação
                </Button>
              </View>
            </View>

            <View className={styles.teachersContent}>
              <Text
                as="h3"
                variant="featured-2"
                weight="bold"
                className={styles.teachersTitle}
              >
                Corpo docente
              </Text>
              <View className={styles.teachersList}>
                {MOCK_TEACHERS.map((teacher, index) => (
                  <View key={index} className={styles.teacherRow}>
                    <Text
                      as="h4"
                      variant="body-3"
                      weight="bold"
                      className={styles.teacherName}
                    >
                      {teacher.name}
                    </Text>
                    <Text
                      variant="body-3"
                      color="neutral-faded"
                      className={styles.teacherRole}
                    >
                      {teacher.role}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'pedagogical' && (
          <View className={styles.pedagogicalContent}>
            <View className={styles.section}>
              <Text as="h3" variant="featured-2" weight="bold">
                Objetivos do curso de Ciência de Dados
              </Text>
              <Text variant="body-2" color="neutral-faded">
                O curso de Ciência de Dados forma profissionais capazes de
                analisar grandes volumes de dados e transformá-los em
                informações úteis para a tomada de decisão. A formação combina
                matemática, estatística, computação e inteligência artificial,
                garantindo atuação flexível em diversos setores. Além da base
                teórica, o aluno desenvolve competências práticas em ferramentas
                de mercado, como Python, R, bancos de dados, machine learning e
                computação em nuvem.
              </Text>
              <Text variant="body-2" color="neutral-faded">
                Com essa preparação, o cientista de dados está apto a criar
                modelos preditivos, interpretar resultados e apoiar estratégias
                de negócio, tornando-se essencial para organizações que buscam
                competitividade por meio da tecnologia e do uso inteligente de
                dados.
              </Text>
            </View>

            <View className={styles.section}>
              <Text as="h3" variant="featured-2" weight="bold">
                Atividades Principais
              </Text>
              <Text variant="body-2" color="neutral-faded">
                Basicamente, o cientista de dados trabalha em:
              </Text>
              <View as="ul" className={styles.list}>
                <Text as="li" variant="body-2" color="neutral-faded">
                  empresas de tecnologia, startups e organizações que utilizam
                  dados como base de produtos e serviços;
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  departamentos de análise e inteligência de negócios (BI);
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  construção e implantação de modelos de machine learning;
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  desenvolvimento de pipelines de dados e automação de processos
                  analíticos;
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  análise estatística e mineração de dados para apoio à decisão;
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  setores financeiros, bancários e de seguros;
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  indústrias, varejo, saúde e telecomunicações que utilizam
                  dados para otimizar operações;
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  consultorias especializadas em análise de dados e
                  transformação digital.
                </Text>
              </View>
              <Text variant="body-2" color="neutral-faded">
                Trata-se, portanto, de um mercado de trabalho dinâmico,
                interdisciplinar e em constante expansão, impulsionado pela
                crescente demanda por soluções baseadas em dados em todos os
                segmentos.
              </Text>
            </View>

            <View className={styles.section}>
              <Text as="h3" variant="featured-2" weight="bold">
                Práticas
              </Text>
              <View as="ul" className={styles.list}>
                <Text as="li" variant="body-2" color="neutral-faded">
                  Estágio Supervisionado
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  Monitoria
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  Iniciação Científica
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  Laboratórios de Programação, Estatística, Banco de Dados e
                  Inteligência Artificial
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  Laboratórios de Informática com softwares e ferramentas
                  modernas (Python, R, SQL, TensorFlow, Power BI, Jupyter, entre
                  outros)
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  Projetos práticos integradores baseados em desafios reais
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  Hackathons e competições de ciência de dados
                </Text>
                <Text as="li" variant="body-2" color="neutral-faded">
                  Visitas Técnicas
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
