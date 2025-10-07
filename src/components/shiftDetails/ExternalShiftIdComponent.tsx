import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LivoIcon from '@/assets/icons/LivoIcon';
import {typographyStyles} from '@/styles/livoFonts';
import {SPACE_VALUES} from '@/styles/spacing';
import {copyToClipboard} from '@/utils/utils';
import StyledText from '@/components/StyledText';

interface ExternalShiftIdComponentProps {
  externalShiftId: string;
}

export const ExternalShiftIdComponent: React.FC<
  ExternalShiftIdComponentProps
> = ({externalShiftId}) => {
  const {t} = useTranslation();
  return (
    <View
      style={{
        padding: SPACE_VALUES.medium,
      }}>
      <StyledText
        style={{
          ...typographyStyles.heading.small,
          marginBottom: SPACE_VALUES.medium,
        }}>
        {t('shift_detail_external_identifier_label')}
      </StyledText>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <StyledText
          style={{
            ...typographyStyles.body.regular,
          }}>
          {externalShiftId}
        </StyledText>
        <TouchableOpacity
          onPress={() => {
            copyToClipboard(externalShiftId);
          }}>
          <LivoIcon name="copy" size={24} color="#149EF2" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
