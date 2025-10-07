import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  LinearTransition,
  SlideInUp,
  SlideOutUp,
} from 'react-native-reanimated';

import { CommonBannerDto, PredictionBandsCounter } from '@/services/shifts';

import Col from '@/components/atoms/Col';
import Row from '@/components/atoms/Row';
import { Typography } from '@/components/atoms/Typography';
import { Chip } from '@/components/common/Chip';

import { SPACE_VALUES } from '@/styles/spacing';
import { markdown } from '@/utils/markdown';

import LivoIcon from '@/assets/icons/LivoIcon';

type Props = {
  bands: PredictionBandsCounter;
  banner: CommonBannerDto;
};

export const FillRateBanner = ({
  bands,
  banner: { title, body, icon, backgroundColor },
}: Props) => {
  const { t } = useTranslation();

  return (
    <Animated.View
      layout={LinearTransition.duration(400)}
      entering={SlideInUp.duration(400)}
      exiting={SlideOutUp.duration(400)}
    >
      <Row
        gap={SPACE_VALUES.small}
        style={[styles.banner, { backgroundColor }]}
      >
        {icon && (
          <LivoIcon name={icon?.name} size={24} color={icon.color ?? '#000'} />
        )}

        <Col flex={1} gap={SPACE_VALUES.small}>
          <Row alignItems={'center'} gap={SPACE_VALUES.small}>
            <Typography variant={'body/regular'}>{title}</Typography>
            {bands.low ? (
              <Chip label={t('prediction_low')} backgroundColor={'#c11314'} />
            ) : null}
            {bands.medium ? (
              <Chip
                label={t('prediction_medium')}
                backgroundColor={'#a46107'}
              />
            ) : null}
          </Row>
          <Typography variant={'body/small'}>{markdown(body)}</Typography>
        </Col>
      </Row>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingVertical: SPACE_VALUES.large,
    paddingHorizontal: SPACE_VALUES.medium,
  },
});
