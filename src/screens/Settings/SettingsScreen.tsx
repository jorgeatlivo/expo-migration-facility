import { StackScreenProps } from '@react-navigation/stack';
import moment from 'moment';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import LivoIcon from '@/assets/icons/LivoIcon';
import { handleLinkPress } from '@/common/utils';
import Row from '@/components/atoms/Row';
import Col from '@/components/atoms/Col';
import StyledText from '@/components/StyledText';
import NoResultsAvailable from '@/components/NoResultsAvailable';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { TagComponent } from '@/components/profile/TagComponent';
import { removeUserSession, signOutRequest } from '@/services/authentication';
import { removeFCMToken } from '@/services/notifications';
import { signOutAction } from '@/store/actions/authenticationActions';
import { BADGE_GRAY, CORAL, DARK_BLUE, GRAY } from '@/styles/colors';
import { commonStyles } from '@/styles/commonStyles';
import { LayoutTextEnum } from '@/styles/fonts';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { RootState, UserFeatureEnum } from '@/types';
import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack';
import { TabRoutes, TabsParamsList } from '@/router/TabsNavigator';
import { CompositeScreenProps } from '@react-navigation/native';
import { useFetchFacility } from '@/hooks/useFetchFacility';

type SettingsModalProps = CompositeScreenProps<
  StackScreenProps<TabsParamsList, TabRoutes.Settings>,
  StackScreenProps<ProtectedStackParamsList, ProtectedStackRoutes.Home>
>;

export const SettingsScreen: React.FC<SettingsModalProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const {
    data: facilityProfile,
    isLoading,
    isRefetching,
    refetch,
  } = useFetchFacility();

  const { livoContact } = useSelector(
    (state: RootState) => state.configurationData
  );
  const dispatch = useDispatch();
  const openWhatsAppChat = async () => {
    try {
      const phoneNumber = '34936075629';
      const url =
        livoContact!!.whatsappLink || `whatsapp://send?phone=${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t('shift_list_error_opening_whatsapp'));
      }
    } catch (error: any) {
      Alert.alert(t('shift_list_error_opening_whatsapp'), error.message);
    }
  };

  const signOut = () => {
    signOutRequest().finally(() => {
      removeUserSession();
      removeFCMToken();
      dispatch(signOutAction());
    });
  };

  const settingsContent =
    facilityProfile == null ? (
      <NoResultsAvailable
        cardTitle={t('shift_list_no_profile_results_title')}
        cardSubTitle={t('shift_list_no_profile_results_subtitle')}
      />
    ) : (
      <Col gap={SPACE_VALUES.medium}>
        <StyledText type={LayoutTextEnum.header} style={styles.title}>
          {t('shift_list_facility_staff_info_title')}
        </StyledText>
        <Col gap={SPACE_VALUES.medium} style={styles.card}>
          <DetailRow>
            <View style={styles.iconContainer}>
              <LivoIcon name="user" size={24} color={DARK_BLUE} />
            </View>
            <StyledText type={LayoutTextEnum.headerSmall}>
              {facilityProfile!!.firstName} {facilityProfile!!.lastName}
            </StyledText>
          </DetailRow>
          <DetailRow>
            <View style={styles.iconContainer}>
              <LivoIcon name="mail" size={24} color={DARK_BLUE} />
            </View>
            <StyledText type={LayoutTextEnum.headerSmall}>
              {facilityProfile!!.email}
            </StyledText>
          </DetailRow>
        </Col>
        {facilityProfile!!.lastTimeSignIn ? (
          <StyledText style={styles.lastLogin}>
            {`${t('last_login_label')}: `}
            {moment(facilityProfile!!.lastTimeSignIn).format(
              'DD/MM/YYYY - HH:mm[h]'
            )}
          </StyledText>
        ) : null}
        <StyledText type={LayoutTextEnum.header} style={styles.title}>
          {t('shift_list_facility_info_title')}
        </StyledText>
        <Col gap={SPACE_VALUES.medium} style={styles.card}>
          <DetailRow>
            <View style={styles.iconContainer}>
              <LivoIcon name="internal-hospital" size={24} color={DARK_BLUE} />
            </View>
            <StyledText type={LayoutTextEnum.headerSmall}>
              {facilityProfile!!.facility.name}
            </StyledText>
          </DetailRow>
          {facilityProfile.units && facilityProfile.units.length > 0 && (
            <Row alignItems={'center'} style={styles.tagsContainer}>
              <View style={styles.iconContainer}>
                <LivoIcon name="patient-in-bed" size={24} color={DARK_BLUE} />
              </View>
              <Row wrap gap={SPACE_VALUES.tiny} flexShrink={1}>
                {facilityProfile.units.map((unit) => (
                  <TagComponent
                    key={unit.value + unit.displayName}
                    text={unit.displayName}
                  />
                ))}
              </Row>
            </Row>
          )}
          <DetailRow>
            <View style={styles.iconContainer}>
              <LivoIcon name="map-pin" size={24} color={DARK_BLUE} />
            </View>
            <TouchableOpacity
              style={styles.safeArea}
              onPress={() =>
                handleLinkPress(facilityProfile!!.facility.mapLink)
              }
            >
              <StyledText
                numberOfLines={2}
                ellipsizeMode="tail"
                type={LayoutTextEnum.link}
                style={styles.shiftInfoText}
              >
                {facilityProfile!!.facility.address}
              </StyledText>
              {facilityProfile?.facility.addressCountry &&
                facilityProfile?.facility.addressCity && (
                  <StyledText
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    type={LayoutTextEnum.link}
                    style={styles.shiftInfoText}
                  >
                    {facilityProfile.facility.addressCity},{' '}
                    {facilityProfile.facility.addressCountry}
                  </StyledText>
                )}
            </TouchableOpacity>
          </DetailRow>
        </Col>
      </Col>
    );

  const footer = (
    <View style={styles.footerContainer}>
      <View style={styles.contactUsContainer}>
        <StyledText type={LayoutTextEnum.body} style={styles.contactUsText}>
          {t('shift_list_need_help')}
        </StyledText>
        <TouchableOpacity onPress={openWhatsAppChat}>
          <StyledText type={LayoutTextEnum.link}>
            {t('shift_list_contact_us_whatsapp')}
          </StyledText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const settingsScreen = (
    <View style={styles.safeArea}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={styles.body}>
          {settingsContent}
          {facilityProfile?.userFeatures.includes(
            UserFeatureEnum.FAVOURITE_PROFESSIONALS_MANAGEMENT
          ) && (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    ProtectedStackRoutes.FavoriteProfessionals
                  )
                }
              >
                <DetailRow>
                  <View style={styles.iconContainer}>
                    <LivoIcon name="heart" size={24} color={DARK_BLUE} />
                  </View>
                  <StyledText
                    type={LayoutTextEnum.subHeader}
                    style={styles.cardActionLabel}
                  >
                    {t('manage_favorite_professionals_title')}
                  </StyledText>
                </DetailRow>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ProtectedStackRoutes.ChangePassword)
              }
            >
              <DetailRow>
                <View style={styles.iconContainer}>
                  <LivoIcon name="key" size={24} color={DARK_BLUE} />
                </View>
                <StyledText
                  type={LayoutTextEnum.subHeader}
                  style={styles.cardActionLabel}
                >
                  {t('setting_change_password')}
                </StyledText>
              </DetailRow>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <TouchableOpacity onPress={signOut}>
              <DetailRow>
                <View style={styles.iconContainer}>
                  <LivoIcon name="power-off" size={20} color={CORAL} />
                </View>
                <StyledText
                  type={LayoutTextEnum.subHeader}
                  style={styles.cardActionLabel}
                >
                  {t('shift_list_logout')}
                </StyledText>
              </DetailRow>
            </TouchableOpacity>
          </View>
          {footer}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        {isLoading && !isRefetching ? (
          <>
            <LoadingScreen />
            {footer}
          </>
        ) : (
          settingsScreen
        )}
      </View>
    </SafeAreaView>
  );
};

const DetailRow = ({ children }: PropsWithChildren) => (
  <Row alignItems={'center'} style={styles.detailsContainer}>
    {children}
  </Row>
);

const styles = StyleSheet.create({
  card: {
    ...commonStyles.card,
  },
  safeArea: {
    ...commonStyles.safeArea,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  lastLogin: {
    ...typographyStyles.info.caption,
    color: BADGE_GRAY,
    textAlign: 'center',
  },
  shiftInfoText: {
    marginBottom: 2,
  },
  contactUsContainer: {
    alignItems: 'center',
  },
  contactUsText: {
    color: GRAY,
  },
  footerContainer: {
    margin: SPACE_VALUES.medium,
    paddingBottom: SPACE_VALUES.medium,
    justifyContent: 'center',
  },
  detailsContainer: {
    paddingVertical: SPACE_VALUES.small,
    flex: 1,
  },
  title: {
    marginVertical: 12,
    marginHorizontal: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  tagsContainer: {
    paddingVertical: SPACE_VALUES.small,
  },
  cardActionLabel: {
    color: DARK_BLUE,
  },
});
