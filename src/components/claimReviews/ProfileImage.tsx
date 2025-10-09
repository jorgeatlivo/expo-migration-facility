import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { GRAY } from '@/styles/colors';

import LivoIcon from '@/assets/icons/LivoIcon';

interface ProfileImageProps {
  imageSize: number;
  profileImage: string | undefined; // The image URI received as a parameter
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  imageSize,
  profileImage,
}) => {
  return (
    <View style={styles.imageContainer}>
      {profileImage ? (
        <Image
          source={{ uri: profileImage }}
          style={{
            width: imageSize,
            height: imageSize,
            borderRadius: imageSize / 2,
          }}
        />
      ) : (
        <LivoIcon color={GRAY} size={imageSize} name="user-circle" />
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
});
