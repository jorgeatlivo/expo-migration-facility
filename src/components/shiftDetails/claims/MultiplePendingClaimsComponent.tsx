import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ClaimRequest, ShiftClaimStatus } from '@/services/shifts';
import { SPACE_VALUES } from '@/styles/spacing';
import { NotificationsBadge } from '../../common/NotificationsBadge';
import { PendingProfessionalClaimItem } from './PendingProfessionalClaimItem';
import { ProfessionalClaimRow } from './ProfessionalClaimRow';
import { Typography } from '@/components/atoms/Typography';
import { sortBy } from '@/utils/utils';

interface MultiplePendingClaimsComponentProps {
  shiftId: number;
  pendingClaims: ClaimRequest[];
  onHandleClaim: () => void;
  setLoading: (loading: boolean) => void;
  navigateToReviews: (claimRequest: ClaimRequest) => void;
  navigateToCV: (claimRequest: ClaimRequest) => void;
  navigateToLivoCV: (claimRequest: ClaimRequest) => void;
}

export const MultiplePendingClaimsComponent: React.FC<
  MultiplePendingClaimsComponentProps
> = ({
  shiftId,
  pendingClaims,
  onHandleClaim,
  setLoading,
  navigateToReviews,
  navigateToCV,
  navigateToLivoCV,
}) => {
  const { t } = useTranslation();

  const [selectedRequest, setSelectedRequest] = useState<ClaimRequest | null>(
    null
  );

  const sortedPendingClaims = sortBy(pendingClaims, (claim: ClaimRequest) =>
    claim.status === ShiftClaimStatus.PENDING_APPROVAL ? 0 : 1
  );

  return (
    <View>
      {selectedRequest ? (
        <PendingProfessionalClaimItem
          shiftId={shiftId}
          claimRequest={selectedRequest}
          onHandleClaim={() => {
            onHandleClaim();
            setSelectedRequest(null);
          }}
          setLoading={setLoading}
          navigateToCV={navigateToCV}
          navigateToLivoCV={navigateToLivoCV}
          navigateToReviews={navigateToReviews}
          goBack={() => setSelectedRequest(null)}
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Typography variant="heading/small">
              {t('shift_detail_pending_claims_label')}
            </Typography>
            <NotificationsBadge notifications={sortedPendingClaims.length} />
          </View>
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {sortedPendingClaims.map((claimRequest) => {
              return (
                <View
                  key={`pending-${claimRequest.id}`}
                  style={styles.claimRowContainer}
                >
                  <ProfessionalClaimRow
                    request={claimRequest}
                    onPress={() => setSelectedRequest(claimRequest)}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 220,
    gap: 8,
  },
  headerContainer: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACE_VALUES.small,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  claimRowContainer: {
    marginBottom: SPACE_VALUES.medium,
  },
});
