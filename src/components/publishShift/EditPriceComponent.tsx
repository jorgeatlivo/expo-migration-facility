import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View , StyleSheet } from 'react-native';
import LivoIcon from '@/assets/icons/LivoIcon';
import {
  BLACK,
  BLUE_FADED,
  DIVIDER_GRAY,
  NOTIFICATION_RED,
  WHITE,
} from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import StyledText from '@/components/StyledText';
import CustomTextInput, { customInputStyles } from '@/components/common/CustomTextInput';
import { DropDownPickerModal } from './DropDownPickerModal';
import Row from '@/components/atoms/Row';
import Col from '@/components/atoms/Col';


interface EditPriceComponentProps {
  price?: string;
  setPrice: (price: string) => void;
  priceVariant: string;
  disabled?: boolean;
  errorMessage?: string;
  priceVariantItems: { label: string; value: string }[];
  setPriceVariant: (priceVariant: string) => void;
  onboardingShiftPrice?: string;
}

export const EditPriceComponent: React.FC<EditPriceComponentProps> = ({
  price,
  setPrice,
  priceVariant,
  disabled,
  errorMessage,
  priceVariantItems,
  setPriceVariant,
  onboardingShiftPrice,
}) => {
  const { t } = useTranslation();
  const [isPriceVariantPickerVisible, setIsPriceVariantPickerVisible] =
    useState(false);

  return (
    <>
      <Col style={styles.wrapper}>
        <View style={styles.flex}>
          <Row flex={1} alignItems={'center'} gap={SPACE_VALUES.small}>
            <CustomTextInput
              keyboardType="numeric"
              onChangeText={setPrice}
              placeholder={t('publish_shift_price_placeholder')}
              value={price?.toString() ?? ''}
              style={styles.priceInput}
              editable={!disabled}
              endAdornment={t('publish_shift_price_currency')}
              leftIcon="money"
            />
            <TouchableOpacity
              onPress={() => setIsPriceVariantPickerVisible(true)}
              disabled={disabled}
            >
              <Row
                style={[
                  styles.variantInput,
                  disabled && customInputStyles.disabled,
                ]}
              >
                <StyledText
                  style={[styles.variant, disabled && styles.disabled]}
                >
                  {priceVariantItems.find((item) => item.value === priceVariant)
                    ?.label ?? '-'}
                </StyledText>
                <LivoIcon
                  name="chevron-down"
                  size={SPACE_VALUES.xLarge}
                  color={disabled ? DIVIDER_GRAY : BLACK}
                />
              </Row>
            </TouchableOpacity>
          </Row>

          {onboardingShiftPrice ? (
            <StyledText style={styles.disclaimer}>
              {t('onboarding_shift_title')} {onboardingShiftPrice}€
            </StyledText>
          ) : null}

          {errorMessage ? (
            <StyledText style={styles.error}>{errorMessage}</StyledText>
          ) : null}
        </View>
      </Col>
      <DropDownPickerModal
        value={priceVariant}
        items={priceVariantItems}
        isVisible={isPriceVariantPickerVisible}
        setValue={(newVariant) => setPriceVariant(newVariant)}
        closeModal={() => setIsPriceVariantPickerVisible(false)}
        placeHolder={'-'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACE_VALUES.large,
  },
  flex: {
    flex: 1,
  },
  label: {
    ...typographyStyles.heading.small,
    color: BLACK,
  },
  disabled: {
    color: DIVIDER_GRAY,
  },
  variantInput: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: BLUE_FADED,
    backgroundColor: WHITE,
    paddingVertical: SPACE_VALUES.medium,
    paddingHorizontal: SPACE_VALUES.large,
  },
  variant: {
    ...typographyStyles.body.regular,
    marginRight: SPACE_VALUES.small,
    minWidth: 70,
  },
  priceInput: {
    flex: 1,
  },
  currency: {
    ...typographyStyles.body.regular,
    color: DIVIDER_GRAY,
  },
  disclaimer: {
    ...typographyStyles.body.small,
    marginTop: SPACE_VALUES.tiny,
    color: BLUE_FADED,
  },
  error: {
    ...typographyStyles.info.caption,
    color: NOTIFICATION_RED,
    marginTop: SPACE_VALUES.tiny,
  },
});
