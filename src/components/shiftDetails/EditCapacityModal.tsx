import React, { useState } from 'react';
import { View } from 'react-native';
import { BottomModal } from '../modals/BottomModal';
import StyledText from '../StyledText';
import { typographyStyles } from '@/styles/livoFonts';
import SingleSelectTag from '../common/SingleSelectTag';
import ActionButton from '../buttons/ActionButton';
import { IconX } from 'react-native-tabler-icons/tabler';
import { useTranslation } from 'react-i18next';

interface EditCapacityProps extends React.ComponentProps<typeof BottomModal> {
  capacity: number;
  setCapacity: (capacity: number) => void;
  minimumCapacity: number;
}

export const EditCapacityModal: React.FC<EditCapacityProps> = ({
  capacity,
  setCapacity,
  minimumCapacity,
  ...props
}) => {
  const { t } = useTranslation();
  const [capacitySelection, setCapacitySelection] = useState<number>(capacity);

  const capacityItems = [
    { label: '1', id: '1' },
    { label: '2', id: '2' },
    { label: '3', id: '3' },
    { label: '4', id: '4' },
    { label: '5', id: '5' },
  ].reduce((acc, item) => {
    if (+item.id < minimumCapacity) {
      acc.push({ ...item, isDisabled: true });
    } else {
      acc.push(item);
    }
    return acc;
  }, [] as { label: string; id: string; isDisabled?: boolean }[]);

  return (
    <BottomModal {...props}>
      <View>
        <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
          <IconX
            size={24}
            color={'#303136'} // Icon/Strong
            style={{ alignSelf: 'flex-end' }}
            onPress={() => props.dismissModal()}
          />
        </View>
        <StyledText /* Label/Large */
          style={{
            ...typographyStyles.heading.small,
            marginBottom: 12, // TODO Locales
          }}
        >
          ¿Cuántos puestos quieres en este turno?
        </StyledText>
        <StyledText /* Label/Medium */
          style={{
            ...typographyStyles.subtitle.regular,
            color: '#616673', //Text-Sutle
            marginBottom: 12, // TODO Locales
          }}
        >
          Selecciona la cantidad de profesionales que necesitas para cubrir el
          turno.
        </StyledText>
        <SingleSelectTag
          style={{ marginBottom: 24 }}
          tags={capacityItems}
          previouslySelectedTag={capacity.toString()}
          onSelectTag={(newCapacity) => setCapacitySelection(+newCapacity)}
        />
        <ActionButton
          title={t('change_button_title')}
          disabled={capacitySelection === capacity}
          onPress={() => setCapacity(capacitySelection)}
          style={[
            { marginBottom: 12 },
            capacitySelection === capacity && {
              backgroundColor: '#EFF0F2',
              borderColor: '#EFF0F2',
            },
          ]}
          textStyle={
            capacitySelection === capacity && {
              color: '#8C95A7', //Text-Sutle
            }
          }
        />
      </View>
    </BottomModal>
  );
};
