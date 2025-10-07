import React from 'react';
import {View, StyleSheet, TouchableOpacityProps, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomTagProps extends TouchableOpacityProps {
  iconName: string;
  tagSize: number;
  iconColor: string;
  backgroundColor: string;
}

const CustomTag: React.FC<CustomTagProps> = ({
  iconName,
  tagSize,
  iconColor,
  backgroundColor,
}) => {
  return (
    <View
      style={{
        ...styles.tagStyle,
        backgroundColor: backgroundColor,
        width: tagSize,
        height: tagSize,
      }}>
      <Text>
        <Icon name={iconName} size={tagSize / 2} color={iconColor} />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tagStyle: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
});

export default CustomTag;
