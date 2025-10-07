import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import { GRAY } from '@/styles/colors';

import { Avatar } from '@/assets/images/Avatar';

interface ProfessionalImageProps {
  imageSize: number;
  url: string | undefined; // The image URI received as a parameter
}

export const ProfessionalImage: React.FC<ProfessionalImageProps> = ({
  imageSize,
  url,
}) => {
  return (
    <View style={styles.imageContainer}>
      {url ? (
        <Image
          source={{ uri: url }}
          style={{
            width: imageSize,
            height: imageSize,
            borderRadius: 8,
          }}
        />
      ) : (
        <Avatar size={imageSize} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageIcon: {
    color: GRAY,
  },
});
