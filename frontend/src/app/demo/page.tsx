import {
  Badge,
  Button,
  Card,
  Checkbox,
  FormControl,
  Hidden,
  Radio,
  Switch,
  Text,
  TextField,
  View,
} from 'reshaped';
import {
  getCurrentInstitution,
  getInstitutionTheme,
  getAvailableInstitutions,
} from '@/config/institutions';
import styles from './demo.module.scss';

/**
 * Theme Demo Page
 *
 * This page demonstrates the dynamic institution theming system.
 * It showcases how Reshaped components inherit the institution's
 * brand colors at runtime based on the NEXT_PUBLIC_INSTITUTION
 * environment variable.
 *
 * Features:
 * - Current institution display
 * - Color palette visualization
 * - Reshaped component showcase
 * - Form elements demonstration
 *
 * @see /src/config/institutions.ts for color definitions
 * @see /src/components/InstitutionThemeInjector.tsx for theme injection
 */
export default function DemoPage() {
  const institutionId = getCurrentInstitution();
  const theme = getInstitutionTheme(institutionId);
  const allInstitutions = getAvailableInstitutions();

  return (
    <View padding={6}>
      <View gap={6}>
        {/* Header Section */}
        <View gap={2}>
          <Text variant="title-1" weight="bold">
            Institution Theme Demo
          </Text>
          <Text variant="body-2" color="neutral-faded">
            Dynamic theming system for Grupo SER institutions
          </Text>
        </View>

        {/* Current Institution Card */}
        <Card padding={4}>
          <View gap={3}>
            <Text variant="title-3" weight="bold">
              Current Institution
            </Text>
            <View direction="row" gap={2} align="center">
              <Badge color="primary">{theme.code}</Badge>
              <Text variant="body-1">{theme.name}</Text>
            </View>
            <View gap={1}>
              <Text variant="body-3" color="neutral-faded">
                Environment variable:{' '}
                <Text variant="body-3" weight="medium">
                  NEXT_PUBLIC_INSTITUTION={institutionId}
                </Text>
              </Text>
            </View>
          </View>
        </Card>

        {/* Color Palette Section */}
        <Card padding={4}>
          <View gap={4}>
            <Text variant="title-3" weight="bold">
              Brand Colors
            </Text>

            {/* Primary Color */}
            <View gap={2}>
              <Text variant="body-2" weight="medium">
                Primary Color
              </Text>
              <View direction="row" gap={3} align="center">
                <div
                  className={styles.colorSwatch}
                  style={{ backgroundColor: theme.primary }}
                />
                <View gap={1}>
                  <Text variant="body-3" color="neutral-faded">
                    Used for buttons, links, active states
                  </Text>
                  <Text variant="body-3" weight="medium">
                    {theme.primary}
                  </Text>
                </View>
              </View>
            </View>

            {/* Secondary Color */}
            <View gap={2}>
              <Text variant="body-2" weight="medium">
                Secondary Color
              </Text>
              <View direction="row" gap={3} align="center">
                <div
                  className={styles.colorSwatch}
                  style={{ backgroundColor: theme.secondary }}
                />
                <View gap={1}>
                  <Text variant="body-3" color="neutral-faded">
                    Used for accents, badges, highlights
                  </Text>
                  <Text variant="body-3" weight="medium">
                    {theme.secondary}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Available Institutions */}
        <Card padding={4}>
          <View gap={3}>
            <Text variant="title-3" weight="bold">
              Available Institutions
            </Text>
            <Text variant="body-3" color="neutral-faded">
              To switch themes, change the NEXT_PUBLIC_INSTITUTION environment
              variable and restart the dev server.
            </Text>
            <View direction="row" gap={2} wrap>
              {allInstitutions.map((id) => (
                <Badge
                  key={id}
                  color={id === institutionId ? 'primary' : 'neutral'}
                >
                  {id}
                </Badge>
              ))}
            </View>
          </View>
        </Card>

        {/* Component Showcase - Buttons */}
        <Card padding={4}>
          <View gap={4}>
            <Text variant="title-3" weight="bold">
              Buttons
            </Text>

            {/* Solid Buttons */}
            <View gap={2}>
              <Text variant="body-2" weight="medium">
                Solid Variant
              </Text>
              <View direction="row" gap={2} wrap>
                <Button variant="solid" color="primary">
                  Primary Button
                </Button>
                <Button variant="solid" color="primary" disabled>
                  Disabled
                </Button>
              </View>
            </View>

            {/* Faded Buttons */}
            <View gap={2}>
              <Text variant="body-2" weight="medium">
                Faded Variant
              </Text>
              <View direction="row" gap={2} wrap>
                <Button variant="faded" color="primary">
                  Faded Button
                </Button>
                <Button variant="faded" color="primary" disabled>
                  Disabled
                </Button>
              </View>
            </View>

            {/* Outline Buttons */}
            <View gap={2}>
              <Text variant="body-2" weight="medium">
                Outline Variant
              </Text>
              <View direction="row" gap={2} wrap>
                <Button variant="outline" color="primary">
                  Outline Button
                </Button>
                <Button variant="outline" color="primary" disabled>
                  Disabled
                </Button>
              </View>
            </View>

            {/* Ghost Buttons */}
            <View gap={2}>
              <Text variant="body-2" weight="medium">
                Ghost Variant
              </Text>
              <View direction="row" gap={2} wrap>
                <Button variant="ghost" color="primary">
                  Ghost Button
                </Button>
                <Button variant="ghost" color="primary" disabled>
                  Disabled
                </Button>
              </View>
            </View>
          </View>
        </Card>

        {/* Component Showcase - Form Elements */}
        <Card padding={4}>
          <View gap={4}>
            <Text variant="title-3" weight="bold">
              Form Elements
            </Text>

            {/* Text Input */}
            <View gap={2}>
              <Text variant="body-2" weight="medium">
                Text Input
              </Text>
              <FormControl>
                <TextField
                  name="example"
                  placeholder="Type something..."
                  inputAttributes={{
                    'aria-label': 'Example text input',
                  }}
                />
              </FormControl>
            </View>

            {/* Checkboxes */}
            <View gap={2}>
              <Text variant="body-2" weight="medium">
                Checkboxes
              </Text>
              <View gap={2}>
                <Checkbox
                  name="checkbox1"
                  defaultChecked
                  inputAttributes={{
                    'aria-label': 'Checked checkbox',
                  }}
                >
                  Checked checkbox
                </Checkbox>
                <Checkbox
                  name="checkbox2"
                  inputAttributes={{
                    'aria-label': 'Unchecked checkbox',
                  }}
                >
                  Unchecked checkbox
                </Checkbox>
                <Checkbox
                  name="checkbox3"
                  disabled
                  inputAttributes={{
                    'aria-label': 'Disabled checkbox',
                  }}
                >
                  Disabled checkbox
                </Checkbox>
              </View>
            </View>

            {/* Radio Buttons */}
            <View gap={2}>
              <Text variant="body-2" weight="medium">
                Radio Buttons
              </Text>
              <View gap={2}>
                <Radio
                  name="radio-group"
                  value="option1"
                  defaultChecked
                  inputAttributes={{
                    'aria-label': 'Option 1',
                  }}
                >
                  Option 1 (selected)
                </Radio>
                <Radio
                  name="radio-group"
                  value="option2"
                  inputAttributes={{
                    'aria-label': 'Option 2',
                  }}
                >
                  Option 2
                </Radio>
                <Radio
                  name="radio-group"
                  value="option3"
                  disabled
                  inputAttributes={{
                    'aria-label': 'Option 3',
                  }}
                >
                  Option 3 (disabled)
                </Radio>
              </View>
            </View>

            {/* Switch */}
            <View gap={2}>
              <Text variant="body-2" weight="medium">
                Switch
              </Text>
              <View gap={2}>
                <Switch
                  name="switch1"
                  defaultChecked
                  inputAttributes={{
                    'aria-label': 'Enabled switch',
                  }}
                >
                  Enabled switch
                </Switch>
                <Switch
                  name="switch2"
                  inputAttributes={{
                    'aria-label': 'Disabled switch',
                  }}
                >
                  Disabled switch
                </Switch>
              </View>
            </View>
          </View>
        </Card>

        {/* Component Showcase - Badges */}
        <Card padding={4}>
          <View gap={4}>
            <Text variant="title-3" weight="bold">
              Badges
            </Text>
            <View direction="row" gap={2} wrap>
              <Badge color="primary">Primary Badge</Badge>
              <Badge color="positive">Positive Badge</Badge>
              <Badge color="critical">Critical Badge</Badge>
              <Badge color="warning">Warning Badge</Badge>
              <Badge color="neutral">Neutral Badge</Badge>
            </View>
          </View>
        </Card>

        {/* Component Showcase - Cards */}
        <Card padding={4}>
          <View gap={4}>
            <Text variant="title-3" weight="bold">
              Cards with Content
            </Text>
            <View
              direction="row"
              gap={3}
              wrap
              attributes={{
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                },
              }}
            >
              <Card padding={3}>
                <View gap={2}>
                  <Badge color="primary">Feature</Badge>
                  <Text variant="body-2" weight="bold">
                    Dynamic Theming
                  </Text>
                  <Text variant="body-3" color="neutral-faded">
                    Switch institution themes at runtime without rebuilding the
                    application.
                  </Text>
                  <Hidden hide={{ s: false, m: true }}>
                    <Button variant="faded" color="primary" fullWidth>
                      Learn More
                    </Button>
                  </Hidden>
                </View>
              </Card>

              <Card padding={3}>
                <View gap={2}>
                  <Badge color="positive">Scalable</Badge>
                  <Text variant="body-2" weight="bold">
                    Multi-Institution
                  </Text>
                  <Text variant="body-3" color="neutral-faded">
                    Support for 7+ institutions with unique brand colors and
                    identity.
                  </Text>
                  <Hidden hide={{ s: false, m: true }}>
                    <Button variant="faded" color="primary" fullWidth>
                      Learn More
                    </Button>
                  </Hidden>
                </View>
              </Card>

              <Card padding={3}>
                <View gap={2}>
                  <Badge color="warning">Type-Safe</Badge>
                  <Text variant="body-2" weight="bold">
                    TypeScript First
                  </Text>
                  <Text variant="body-3" color="neutral-faded">
                    Full TypeScript support with type-safe configuration and
                    validation.
                  </Text>
                  <Hidden hide={{ s: false, m: true }}>
                    <Button variant="faded" color="primary" fullWidth>
                      Learn More
                    </Button>
                  </Hidden>
                </View>
              </Card>
            </View>
          </View>
        </Card>

        {/* How to Test Section */}
        <Card padding={4}>
          <View gap={3}>
            <Text variant="title-3" weight="bold">
              How to Test Theme Switching
            </Text>
            <View gap={2} paddingStart={3}>
              <View gap={1}>
                <Text variant="body-3" weight="medium">
                  1. Stop the development server (Ctrl+C)
                </Text>
              </View>
              <View gap={1}>
                <Text variant="body-3" weight="medium">
                  2. Update your .env.local file:
                </Text>
                <View
                  paddingStart={3}
                  paddingTop={2}
                  paddingBottom={2}
                  paddingEnd={3}
                  backgroundColor="neutral-faded"
                  borderRadius="medium"
                >
                  <Text variant="body-3">
                    <code>NEXT_PUBLIC_INSTITUTION=UNG</code>
                  </Text>
                </View>
              </View>
              <View gap={1}>
                <Text variant="body-3" weight="medium">
                  3. Start the dev server again:
                </Text>
                <View
                  paddingStart={3}
                  paddingTop={2}
                  paddingBottom={2}
                  paddingEnd={3}
                  backgroundColor="neutral-faded"
                  borderRadius="medium"
                >
                  <Text variant="body-3">
                    <code>npm run dev</code>
                  </Text>
                </View>
              </View>
              <View gap={1}>
                <Text variant="body-3" weight="medium">
                  4. Refresh this page to see the new theme
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}
