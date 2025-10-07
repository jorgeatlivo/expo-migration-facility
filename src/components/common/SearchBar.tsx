import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import LivoIcon from '@/assets/icons/LivoIcon';
import {SPACE_VALUES} from '@/styles/spacing';
import {typographyStyles} from '@/styles/livoFonts';
import {ACTION_BLACK, BADGE_GRAY, LIGHT_GRAY} from '@/styles/colors';
import {useTranslation} from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder,
  style,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const {t} = useTranslation();

  const handleClearText = () => {
    onChangeText('');
  };

  return (
    <View style={[styles.container, isFocused ? styles.focus : {}, style]}>
      <LivoIcon
        name="search"
        size={16}
        color={BADGE_GRAY}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder ?? t('common_search_placeholder')}
        value={value}
        onChangeText={(text: string) => {
          onChangeText(text);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClearText} style={styles.close}>
          <LivoIcon
            name="close"
            size={16}
            color={ACTION_BLACK}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 100,
    paddingHorizontal: SPACE_VALUES.medium,
    paddingVertical: SPACE_VALUES.small,
    backgroundColor: '#fff',
  },
  focus: {
    borderWidth: 2,
    borderColor: '#325986',
  },
  input: {
    flex: 1,
    ...typographyStyles.body.regular,
    height: 24,
    lineHeight: Platform.OS === 'ios' ? 0 : undefined,
    paddingBottom: 0,
    paddingTop: 0,
    paddingHorizontal: SPACE_VALUES.tiny,
  },
  icon: {
    marginHorizontal: SPACE_VALUES.tiny,
  },
  close: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 75,
    padding: SPACE_VALUES.tiny,
  },
});
