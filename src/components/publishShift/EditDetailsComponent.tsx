import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import Col from '@/components/atoms/Col';
import CustomTextInput from '@/components/common/CustomTextInput';
import StyledText from '@/components/StyledText';

import { BLUE_FADED } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

interface EditDetailsComponentProps {
  details: string;
  setDetails: (details: string) => void;
}

export const EditDetailsComponent: React.FC<EditDetailsComponentProps> = ({
  details,
  setDetails,
}) => {
  const { t } = useTranslation();

  return (
    <Col style={styles.wrapper}>
      <CustomTextInput
        editable
        multiline
        alignTop
        onChangeText={setDetails}
        placeholder={t('shift_list_shift_details_field_label')}
        value={details}
        textInputStyle={styles.textInput}
        leftIcon="description"
      />
      <StyledText style={styles.disclaimer}>
        {t('publish_shift_edit_detail_subtitle')}
      </StyledText>
    </Col>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACE_VALUES.large,
  },
  textInput: {
    minHeight: 64,
  },
  disclaimer: {
    ...typographyStyles.body.small,
    marginTop: SPACE_VALUES.tiny,
    color: BLUE_FADED,
  },
});
