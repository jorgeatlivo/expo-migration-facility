import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';

interface CustomHeaderBackIconProps {
  goBack: () => void;
}

export const CustomHeaderBackIcon: React.FC<CustomHeaderBackIconProps> = ({
  goBack,
}) => {
  return (
    <TouchableOpacity onPress={goBack}>
      <View style={styles.container}>
        <LivoIcon
          name="chevron-left"
          size={SPACE_VALUES.xLarge}
          color={'#2C3038'}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACE_VALUES.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
