import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { IconX } from 'tabler-icons-react-native';

import ActionButton from '@/components/buttons/ActionButton';
import SingleSelectTag from '@/components/common/SingleSelectTag';
import { BottomModal } from '@/components/modals/BottomModal';
import StyledText from '@/components/StyledText';

import { typographyStyles } from '@/styles/livoFonts';

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
  ].reduce(
    (acc, item) => {
      if (+item.id < minimumCapacity) {
        acc.push({ ...item, isDisabled: true });
      } else {
        acc.push(item);
      }
      return acc;
    },
    [] as { label: string; id: string; isDisabled?: boolean }[]
  );

  // todo localise
  return (
    <BottomModal {...props}>
      <View>
        <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
          <Pressable onPress={() => props.dismissModal()}>
            <IconX
              size={24}
              color={'#303136'} // Icon/Strong
              style={{ alignSelf: 'flex-end' }}
            />
          </Pressable>
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
