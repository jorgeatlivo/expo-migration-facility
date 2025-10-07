import React from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Pdf from 'react-native-pdf';
import { StackScreenProps } from '@react-navigation/stack';

import { DARK_BLUE } from '@/styles/colors';

import LivoIcon from '@/assets/icons/LivoIcon';
import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack';

type PdfViewerScreenProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.PdfViewer
>;

const PdfViewerScreen: React.FC<PdfViewerScreenProps> = ({ route }) => {
  const uri = route.params.uri;

  const handleDownload = () => {
    Linking.openURL(uri).catch((error) => {
      Alert.alert('Error', error.message);
    });
  };
  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri }}
        onLoadComplete={(pageNum) => console.log(`Number of pages: ${pageNum}`)}
        onPageChanged={(page) => console.log(`Current page: ${page}`)}
        onError={(error) => console.log(error)}
        style={styles.pdf}
        trustAllCerts={false}
      />
      <View style={styles.downloadButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDownload()}
        >
          <LivoIcon name="download" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  downloadButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  button: {
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: DARK_BLUE,
    alignItems: 'center',
  },
});

export default PdfViewerScreen;
