import React, { useEffect } from 'react';
import { RefreshControl, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';

import { fetchProfessionalAgendaThunk } from '@/store/actions/professionalAgendaActions';
import { AppDispatch } from '@/store/configureStore';

import {
  ProfessionalAgendaStackParamList,
  ProfessionalAgendaStackRoutes,
} from '@/screens/ProfessionalAgenda/ProfessionalAgendaStack.types';

import { EmptyScreen } from '@/components/common/EmptyScreen';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ProfessionalAgendaHeader } from '@/components/professionalAgenda/header';
import { ProfessionalImage } from '@/components/professionalAgenda/ProfessionalImage';
import StyledText from '@/components/StyledText';

import { LIGHT_GRAY, WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import { RootState, ShiftTimeInDayEnum } from '@/types';

type ProfessionalAgendaList = StackScreenProps<
  ProfessionalAgendaStackParamList,
  ProfessionalAgendaStackRoutes.ProfessionalAgendaList
>;

export const ProfessionalAgendaList: React.FC<ProfessionalAgendaList> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    loadPage();
  }, []);

  const professionalAgendaList = useSelector(
    (state: RootState) => state.professionalAgendaData.professionalAgendaList
  );
  const loadPage = (date?: string, shiftTimeInDay?: ShiftTimeInDayEnum) => {
    dispatch(fetchProfessionalAgendaThunk(date, shiftTimeInDay));
  };
  const reloadData = () => {
    loadPage(
      professionalAgendaList.professionalAgenda?.date,
      professionalAgendaList.professionalAgenda?.shiftTimeInDay
    );
  };

  return professionalAgendaList.professionalAgenda ||
    professionalAgendaList.isLoading ? (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: WHITE,
        flex: 1,
      }}
    >
      <ProfessionalAgendaHeader
        date={professionalAgendaList.professionalAgenda?.date}
        onClickLeft={
          professionalAgendaList.professionalAgenda?.previous
            ? () =>
                loadPage(
                  professionalAgendaList.professionalAgenda!.previous!.date,
                  professionalAgendaList.professionalAgenda!.previous!
                    .shiftTimeInDay
                )
            : undefined
        }
        onClickRight={
          professionalAgendaList.professionalAgenda?.next
            ? () =>
                loadPage(
                  professionalAgendaList.professionalAgenda!.next!.date,
                  professionalAgendaList.professionalAgenda!.next!
                    .shiftTimeInDay
                )
            : undefined
        }
        shiftTimeInDay={
          professionalAgendaList.professionalAgenda?.shiftTimeInDay
        }
      />
      {professionalAgendaList.isLoading ? (
        <LoadingScreen style={{ backgroundColor: LIGHT_GRAY }} />
      ) : (
        <ScrollView
          style={{
            backgroundColor: LIGHT_GRAY,
          }}
          contentContainerStyle={{
            flexGrow: 1,
            padding: SPACE_VALUES.medium,
            backgroundColor: LIGHT_GRAY,
          }}
          refreshControl={
            <RefreshControl
              refreshing={professionalAgendaList.isLoading}
              onRefresh={reloadData}
            />
          }
        >
          {professionalAgendaList.professionalAgenda &&
          professionalAgendaList.professionalAgenda.professionalsPerUnit
            .length > 0 ? (
            professionalAgendaList.professionalAgenda.professionalsPerUnit.map(
              (professionalPerUnit, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: SPACE_VALUES.medium,
                  }}
                >
                  <StyledText
                    style={{
                      ...typographyStyles.heading.small,
                      marginBottom: SPACE_VALUES.small,
                    }}
                  >
                    {professionalPerUnit.unit}
                  </StyledText>
                  <View
                    style={{
                      paddingVertical: SPACE_VALUES.tiny,
                      borderRadius: 8,
                      backgroundColor: WHITE,
                    }}
                  >
                    {professionalPerUnit.professionals.map(
                      (professional, index) => (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate(
                              ProfessionalAgendaStackRoutes.ProfessionalAgendaDetail,
                              { professionalId: professional.professionalId }
                            );
                          }}
                          key={index}
                          style={{
                            flexDirection: 'row',
                            paddingVertical: SPACE_VALUES.small,
                            alignItems: 'center',
                            borderBottomWidth:
                              index ===
                              professionalPerUnit.professionals.length - 1
                                ? 0
                                : 1,
                            borderBottomColor: '#C6D0DB',
                            justifyContent: 'space-between',
                            paddingHorizontal: SPACE_VALUES.medium,
                          }}
                        >
                          <View style={{}}>
                            <StyledText
                              style={{
                                ...typographyStyles.subtitle.regular,
                              }}
                            >
                              {professional.firstName} {professional.lastName}
                            </StyledText>
                            {professional.tag ? (
                              <StyledText
                                style={{
                                  ...typographyStyles.info.caption,
                                  color: professional.tag.color,
                                }}
                              >
                                {professional.tag.text}
                              </StyledText>
                            ) : null}
                          </View>
                          <ProfessionalImage
                            url={professional.profilePictureUrl}
                            imageSize={48}
                          />
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>
              )
            )
          ) : (
            <View>
              <StyledText
                style={{
                  ...typographyStyles.heading.small,
                  marginBottom: SPACE_VALUES.tiny,
                }}
              >
                {t('professional_agenda_empty_title')}
              </StyledText>
              <StyledText
                style={{
                  ...typographyStyles.body.regular,
                  marginBottom: SPACE_VALUES.tiny,
                }}
              >
                {t('professional_agenda_empty_subtitle')}
              </StyledText>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  ) : (
    <EmptyScreen
      onPress={() => {
        loadPage();
      }}
    />
  );
};
