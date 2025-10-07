import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, RefreshControl, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { IconButton } from '@/components/buttons/IconButton';
import { Divider } from '@/components/common/Divider';
import { ProfessionalImage } from '@/components/professionalAgenda/ProfessionalImage';
import StyledText from '@/components/StyledText';
import { ApiApplicationError } from '@/services/api';
import { fetchProfessionalAgendaDetailView } from '@/services/professionalAgenda';
import { WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { ProfessionalAgendaDetailView } from '@/types/professionalAgenda';
import {
  ProfessionalAgendaStackParamList,
  ProfessionalAgendaStackRoutes,
} from './ProfessionalAgendaStack';

type ProfessionalAgendaDetailViewProps = StackScreenProps<
  ProfessionalAgendaStackParamList,
  ProfessionalAgendaStackRoutes.ProfessionalAgendaDetail
>;
export const ProfessionalAgendaDetailViewComponent: React.FC<
  ProfessionalAgendaDetailViewProps
> = ({ navigation, route }) => {
  const { t } = useTranslation();

  const [professionalAgendaDetailView, setProfessionalAgendaDetailView] =
    useState<ProfessionalAgendaDetailView | null>(null);

  // on mount fetch the professional detail view
  useEffect(() => {
    fetchProfessionalAgendaDetailView(route.params.professionalId)
      .then((response) => {
        setProfessionalAgendaDetailView(response);
      })
      .catch((error) => {
        if (error instanceof ApiApplicationError) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Error', t('shift_list_error_server_message'));
        }
        navigation.goBack();
      });
  }, [route.params.professionalId]);

  const handleCallPress = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return professionalAgendaDetailView ? (
    <ScrollView
      style={{
        padding: SPACE_VALUES.medium,
        flex: 1,
      }}
      contentContainerStyle={{
        paddingBottom: SPACE_VALUES.xLarge,
      }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            fetchProfessionalAgendaDetailView(route.params.professionalId)
              .then((response) => {
                setProfessionalAgendaDetailView(response);
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        />
      }
    >
      <ProfessionalImage
        imageSize={92}
        url={professionalAgendaDetailView.profilePictureUrl}
      />
      <View
        style={{
          paddingVertical: SPACE_VALUES.medium,
        }}
      >
        <StyledText
          style={{
            ...typographyStyles.heading.medium,
            textAlign: 'center',
          }}
        >
          {professionalAgendaDetailView.firstName}{' '}
          {professionalAgendaDetailView.lastName}
        </StyledText>
        {professionalAgendaDetailView.tag ? (
          <StyledText
            style={{
              ...typographyStyles.body.regular,
              color: professionalAgendaDetailView.tag.color,
              textAlign: 'center',
            }}
          >
            {professionalAgendaDetailView.tag.text}
          </StyledText>
        ) : null}
      </View>
      {professionalAgendaDetailView.currentUnit ? (
        <View
          style={{
            backgroundColor: WHITE,
            borderRadius: 8,
            padding: SPACE_VALUES.medium,
            marginBottom: SPACE_VALUES.medium,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: SPACE_VALUES.medium,
            }}
          >
            <StyledText
              style={{
                ...typographyStyles.body.regular,
              }}
            >
              {t('professional_agenda_current_unit')}
            </StyledText>
            <StyledText
              style={{
                ...typographyStyles.heading.medium,
              }}
            >
              {professionalAgendaDetailView.currentUnit}
            </StyledText>
          </View>
          <Divider />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: SPACE_VALUES.medium,
            }}
          >
            <View
              style={{
                marginRight: SPACE_VALUES.medium,
              }}
            >
              <StyledText
                style={{
                  ...typographyStyles.subtitle.regular,
                  marginBottom: SPACE_VALUES.tiny,
                }}
              >
                {t('professional_agenda_no_show_title')}
              </StyledText>
              <StyledText
                style={{
                  ...typographyStyles.body.small,
                }}
              >
                {t('professional_agenda_no_show_subtitle')}
              </StyledText>
            </View>
            <TouchableOpacity
              onPress={() => {
                handleCallPress(
                  professionalAgendaDetailView.noShowContactNumber
                );
              }}
            >
              <IconButton
                name="phone"
                color="#149EF2"
                backgroundColor="#E0EFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      <View
        style={{
          backgroundColor: WHITE,
          borderRadius: 8,
          paddingVertical: SPACE_VALUES.medium,
          marginBottom: SPACE_VALUES.medium,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: SPACE_VALUES.medium,
          }}
        >
          <View>
            <StyledText
              style={{
                ...typographyStyles.heading.small,
              }}
            >
              {t('professional_agenda_history')}
            </StyledText>
            <StyledText
              style={{
                ...typographyStyles.info.caption,
              }}
            >
              {
                professionalAgendaDetailView.professionalHistoryInfo
                  .facilityName
              }
            </StyledText>
          </View>
          <StyledText
            style={{
              ...typographyStyles.heading.small,
              color: '#055186',
            }}
          >
            {
              professionalAgendaDetailView.professionalHistoryInfo
                .totalShiftsInFacility
            }{' '}
            {t('professional_agenda_shift_label')}
          </StyledText>
        </View>
        {professionalAgendaDetailView.professionalHistoryInfo
          .totalShiftsInFacility > 0 ? (
          <View
            style={{
              marginTop: SPACE_VALUES.medium,
              paddingTop: SPACE_VALUES.medium,
              paddingHorizontal: SPACE_VALUES.medium,
              borderTopWidth: 1,
              borderTopColor: '#DEE2E8',
            }}
          >
            {
              // professional history rows unit  and shifts
              professionalAgendaDetailView.professionalHistoryInfo.shiftsInFacility.map(
                (unitShift, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: SPACE_VALUES.medium,
                      marginBottom:
                        index ===
                        professionalAgendaDetailView.professionalHistoryInfo
                          .shiftsInFacility.length -
                          1
                          ? 0
                          : SPACE_VALUES.medium,
                    }}
                  >
                    <StyledText
                      style={{
                        ...typographyStyles.subtitle.regular,
                        marginRight: SPACE_VALUES.small,
                      }}
                    >
                      {unitShift.unit}
                    </StyledText>
                    <StyledText
                      style={{
                        ...typographyStyles.body.regular,
                        color: '#055186',
                      }}
                    >
                      {unitShift.numberOfShifts}{' '}
                      {t('professional_agenda_shift_label')}
                    </StyledText>
                  </View>
                )
              )
            }
          </View>
        ) : null}
      </View>
    </ScrollView>
  ) : null;
};
