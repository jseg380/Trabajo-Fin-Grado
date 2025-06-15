import React, { useState } from 'react';
import { Menu, Divider, Button } from 'react-native-paper';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGE_KEY } from '@/localization';
import { Stack } from 'expo-router';
import TitleSetterWebPage from '@/components/TitleSetter';
import { withAuth } from '@/utils/withAuth';
import CustomHeaderBackButton from '@/components/CustomHeaderBackButton';

type LanguageOption = {
  [key: string]: string;
};

type DistanceUnitsOption = {
  [key: string]: string;
};

type FuelEfficiencyUnitsOptions = {
  [key: string]: string;
};

const languageOptions: LanguageOption = {
  'Español (España)': 'es-ES',
  'English (United Kingdom)': 'en-UK',
};

const distanceUnitsOptions: DistanceUnitsOption = {
  Kilometers: 'km',
  Miles: 'mi',
};

const fuelEfficiencyUnitsOptions: FuelEfficiencyUnitsOptions = {
  'Liters per 100 km': 'l/100km',
  'Miles per gallon (UK)': 'mpg-uk',
  'Miles per gallon (US)': 'mpg-us',
};

function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedLanguageLabel, setSelectedLanguageLabel] = useState<string | null>(null);

  const handleLanguageChange = async (label: string, value: string) => {
    setSelectedLanguageLabel(label);
    i18n.changeLanguage(value);
    setIsMenuVisible(false);
    await AsyncStorage.setItem(LANGUAGE_KEY, value);
  };

  const handleDistanceUnitsChange = async (label: string, value: string) => {
    console.log(`Distance units changed to: ${label} (${value})`);
  };

  const handleFuelEfficiencyUnitsChange = async (label: string, value: string) => {
    console.log(`Fuel efficiency units changed to: ${label} (${value})`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t('pages.settings.title'),
          headerLeft: () => <CustomHeaderBackButton route='/profile' />,
        }}
      />
      <TitleSetterWebPage title={t('pages.settings.title')} />

      <View style={styles.menuContainer}>
        <Text style={styles.title}>{t('settings.language.meta')}</Text>
        <Menu
          visible={isMenuVisible}
          onDismiss={() => setIsMenuVisible(false)}
          anchor={
            <Button onPress={() => setIsMenuVisible(true)}>
              {selectedLanguageLabel || t('settings.language.select')}
            </Button>
          }
        >
          {Object.entries(languageOptions).map(([label, value], index) => (
            <React.Fragment key={value}>
              <Menu.Item
                onPress={() => handleLanguageChange(label, value)}
                title={label}
              />
              {index < Object.keys(languageOptions).length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Menu>
      </View>

        {/* <Text style={styles.title}>{t('language.meta')}</Text> */}
        {/* <Menu */}
        {/*   visible={isMenuVisible} */}
        {/*   onDismiss={() => setIsMenuVisible(false)} */}
        {/*   anchor={<Button onPress={() => setIsMenuVisible(true)}>{t('language.select')}</Button>} */}
        {/* > */}
        {/*   {Object.entries(distanceUnitsOptions).map(([label, value], index) => ( */}
        {/*     <React.Fragment key={value}> */}
        {/*       <Menu.Item */}
        {/*         onPress={() => handleDistanceUnitsChange(label, value)} */}
        {/*         title={label} */}
        {/*       /> */}
        {/*       {index < Object.keys(distanceUnitsOptions).length - 1 && <Divider />} */}
        {/*     </React.Fragment> */}
        {/*   ))} */}
        {/* </Menu> */}

        {/* <Menu */}
        {/*   visible={isMenuVisible} */}
        {/*   onDismiss={() => setIsMenuVisible(false)} */}
        {/*   anchor={<Button onPress={() => setIsMenuVisible(true)}>{t('fuelEfficiency.select')}</Button>} */}
        {/* > */}
        {/*   {Object.entries(fuelEfficiencyUnitsOptions).map(([label, value], index) => ( */}
        {/*     <React.Fragment key={value}> */}
        {/*       <Menu.Item */}
        {/*         onPress={() => handleFuelEfficiencyUnitsChange(label, value)} */}
        {/*         title={label} */}
        {/*       /> */}
        {/*       {index < Object.keys(fuelEfficiencyUnitsOptions).length - 1 && <Divider />} */}
        {/*     </React.Fragment> */}
        {/*   ))} */}
        {/* </Menu> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'black',
  },
  menuContainer: {
    padding: 20,
  },
});

export default withAuth(SettingsScreen);
