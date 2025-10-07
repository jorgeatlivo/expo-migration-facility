import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {typographyStyles} from '@/styles/livoFonts';
import {SPACE_VALUES} from '@/styles/spacing';
import {ShiftModalityEnum} from '@/types';
import SelectTags from '@/components/common/CustomSelectTags';
import StyledText from '@/components/StyledText';

interface InternalExternalSwitchComponentProps {
  modality: ShiftModalityEnum;
  setModality: (modality: string) => void;
}

export const InternalExternalSwitchComponent: React.FC<
  InternalExternalSwitchComponentProps
> = ({modality, setModality}) => {
  const {t} = useTranslation();

  const modalityItems = [
    {
      label: t('publish_shift_internal_switch_label'),
      id: ShiftModalityEnum.INTERNAL,
    },
    {
      label: t('publish_shift_external_switch_label'),
      id: ShiftModalityEnum.EXTERNAL,
    },
  ];
  return (
    <View
      style={{
        marginBottom: SPACE_VALUES.xLarge,
      }}>
      <StyledText
        style={{
          ...typographyStyles.heading.small,
          marginBottom: SPACE_VALUES.medium,
        }}>
        {t('publish_shift_external_internal_shift_switch')}
      </StyledText>
      <SelectTags
        tags={modalityItems}
        onSelectTag={setModality}
        previouslySelectedTag={modality}
        tagContainerStyle={{
          flex: 1,
        }}
      />
    </View>
  );
};
