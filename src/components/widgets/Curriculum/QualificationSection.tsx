import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Divider } from '@/components/common/Divider';
import { InfoRow } from '@/components/InfoRow';
import StyledText from '@/components/StyledText';

import { ACTION_BLACK } from '@/styles/colors';
import { SectionStyles } from '@/styles/common/sections';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { QualificationDataDTO, QualificationDTO } from '@/types/curriculum';
import { resolveIconSize } from '@/utils/utils';

interface QualificationSectionProps {
  qualification: QualificationDTO;
  messageWhenEmpty?: string;
  style?: any;
}

type QualificationCardGroup = {
  [title: string]: QualificationCardProps;
};

export const QualificationSection: React.FC<QualificationSectionProps> = ({
  qualification,
  messageWhenEmpty,
  style,
}) => {
  const { qualifications } = qualification;
  const noQualifications =
    !qualification.qualifications || qualifications.length === 0;

  const qualificationCards = useMemo(() => {
    if (noQualifications) {
      return [];
    }

    const qualificationCardGroup = qualifications.reduce(
      (group, item, index) => {
        if (!group[item.title]) {
          group[item.title] = {
            order: index,
            title: item.title,
            qualifications: [],
          };
        }

        group[item.title].qualifications.push(item);
        return group;
      },
      {} as QualificationCardGroup
    );

    return Object.values(qualificationCardGroup).sort(
      (c1, c2) => c1.order - c2.order
    );
  }, [noQualifications, qualifications]);

  return noQualifications && !messageWhenEmpty ? null : (
    <View style={[SectionStyles.section, styles.section, style]}>
      <View style={SectionStyles.sectionHeader}>
        <StyledText style={typographyStyles.heading.medium}>
          {qualification.title}
        </StyledText>
      </View>

      {noQualifications ? (
        <StyledText
          style={[typographyStyles.body.regular, styles.emptyCategoryMessage]}
        >
          {messageWhenEmpty}
        </StyledText>
      ) : (
        qualificationCards.map(
          (qualificationCard: QualificationCardProps, cardIndex: number) => (
            <QualificationCard
              {...qualificationCard}
              hideLastDivider={cardIndex >= qualificationCards.length - 1}
              key={qualificationCard.title + cardIndex}
            />
          )
        )
      )}
    </View>
  );
};

interface QualificationCardProps {
  order: number;
  title: string;
  qualifications: QualificationDataDTO[];
  hideLastDivider?: boolean;
}

function QualificationCard({
  qualifications,
  hideLastDivider,
}: QualificationCardProps) {
  return (
    <>
      {qualifications.map((qualification, qualificationIndex) => (
        <View style={SectionStyles.card}>
          <View style={SectionStyles.cardHeader}>
            <StyledText style={typographyStyles.subtitle.regular}>
              {qualification.title}
            </StyledText>
            {qualification.subtitle ? (
              <StyledText style={typographyStyles.body.small}>
                {qualification.subtitle}
              </StyledText>
            ) : null}
          </View>
          <View
            key={qualificationIndex}
            style={{ marginBottom: SPACE_VALUES.small }}
          >
            {qualification.details.map((detail) => (
              <View
                key={detail.displayText}
                style={{ marginBottom: detail.gap }}
              >
                <InfoRow
                  titleTypography={detail.displayTextTypography}
                  subtitleTypography={detail.additionalTextTypography}
                  title={detail.displayText}
                  subtitle={detail.additionalText}
                  iconName={detail.icon?.name}
                  iconColor={detail.icon?.color}
                  iconSize={
                    detail.icon?.width
                      ? resolveIconSize(detail.icon?.width)
                      : undefined
                  }
                  textWrap
                />
              </View>
            ))}
            {hideLastDivider ? null : <Divider style={styles.divider} />}
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: SPACE_VALUES.small,
  },
  emptyCategoryMessage: {
    marginBottom: SPACE_VALUES.xLarge,
    color: ACTION_BLACK,
  },
  divider: {
    marginTop: SPACE_VALUES.large,
  },
});
