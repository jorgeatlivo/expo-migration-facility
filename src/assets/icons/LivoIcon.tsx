import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path, PathProps } from 'react-native-svg';

import {
  IconAdjustmentsHorizontal,
  IconAlertTriangle,
  IconArrowRight,
  IconBlockquote,
  IconBuildingHospital,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarMonth,
  IconCalendarSearch,
  IconCalendarWeek,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircleMinus,
  IconClockHour5,
  IconCoins,
  IconCopy,
  IconDownload,
  IconExclamationCircle,
  IconEye,
  IconEyeClosed,
  IconFileCheck,
  IconFileTime,
  IconFirstAidKit,
  IconGift,
  IconHeart,
  IconHeartbeat,
  IconHeartFilled,
  IconHeartHandshake,
  IconHistory,
  IconHome,
  IconIdBadge2,
  IconInfoCircle,
  IconKey,
  IconMail,
  IconMapPin,
  IconMoon,
  IconNotes,
  IconNurse,
  IconPencil,
  IconPhone,
  IconPlus,
  IconPower,
  IconRefresh,
  IconReplace,
  IconReportMedical,
  IconSearch,
  IconSettings,
  IconShare2,
  IconShield,
  IconSparkles,
  IconSquare,
  IconStar,
  IconStarFilled,
  IconStethoscope,
  IconSun,
  IconSunset,
  IconTrash,
  IconUrgent,
  IconUser,
  IconUserCheck,
  IconUsersGroup,
  IconUserX,
  IconX,
} from 'tabler-icons-react-native';

import { IconPatientInBed } from './LivoPatientInBed';

interface LivoIconProps {
  name: string;
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}

const LivoIcon: React.FC<LivoIconProps> = ({ name, size, color, style }) => {
  const getSvg = (path: string, pathProps?: PathProps) => (
    <View
      style={[
        {
          height: size,
          width: size,
        },
        style,
      ]}
    >
      <Svg
        width={'100%'}
        height={'100%'}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        <Path d={path} {...pathProps} />
      </Svg>
    </View>
  );

  function renderIcon() {
    switch (name) {
      case 'clock-filled':
        return getSvg(
          'M17.6523 3.79888C19.1606 4.66973 20.4153 5.9194 21.2922 7.42418C22.169 8.92895 22.6377 10.6366 22.6518 12.3782C22.6658 14.1198 22.2248 15.8348 21.3724 17.3536C20.5199 18.8723 19.2856 20.1421 17.7916 21.0372C16.2976 21.9323 14.5957 22.4217 12.8544 22.4569C11.1132 22.4922 9.39289 22.072 7.8639 21.2381C6.3349 20.4042 5.05021 19.1854 4.13701 17.7024C3.22381 16.2194 2.71375 14.5236 2.65734 12.7829L2.65234 12.4589L2.65734 12.1349C2.71335 10.4079 3.21589 8.72484 4.11598 7.24987C5.01608 5.7749 6.283 4.55833 7.79324 3.71876C9.30347 2.87919 11.0055 2.44527 12.7333 2.45931C14.4612 2.47336 16.1559 2.93487 17.6523 3.79888ZM12.6523 6.45888C12.4074 6.45891 12.171 6.54883 11.988 6.71159C11.8049 6.87435 11.688 7.09863 11.6593 7.34188L11.6523 7.45888V12.4589L11.6613 12.5899C11.6841 12.7634 11.7521 12.9279 11.8583 13.0669L11.9453 13.1669L14.9453 16.1669L15.0393 16.2489C15.2147 16.3849 15.4304 16.4588 15.6523 16.4588C15.8743 16.4588 16.09 16.3849 16.2653 16.2489L16.3593 16.1659L16.4423 16.0719C16.5784 15.8965 16.6523 15.6808 16.6523 15.4589C16.6523 15.2369 16.5784 15.0212 16.4423 14.8459L16.3593 14.7519L13.6523 12.0439V7.45888L13.6453 7.34188C13.6167 7.09863 13.4998 6.87435 13.3167 6.71159C13.1337 6.54883 12.8973 6.45891 12.6523 6.45888Z',
          { fill: color }
        );
      case 'circle-check-filled':
        return getSvg(
          'M17.6523 3.79888C19.1606 4.66973 20.4153 5.9194 21.2922 7.42418C22.169 8.92895 22.6377 10.6366 22.6518 12.3782C22.6658 14.1198 22.2248 15.8348 21.3724 17.3536C20.5199 18.8723 19.2856 20.1421 17.7916 21.0372C16.2976 21.9323 14.5957 22.4217 12.8544 22.4569C11.1132 22.4922 9.39289 22.072 7.8639 21.2381C6.3349 20.4042 5.05021 19.1854 4.13701 17.7024C3.22381 16.2194 2.71375 14.5236 2.65734 12.7829L2.65234 12.4589L2.65734 12.1349C2.71335 10.4079 3.21589 8.72484 4.11598 7.24987C5.01608 5.7749 6.283 4.55833 7.79324 3.71876C9.30347 2.87919 11.0055 2.44527 12.7333 2.45931C14.4612 2.47336 16.1559 2.93487 17.6523 3.79888ZM16.3593 9.75188C16.1872 9.5797 15.9581 9.47627 15.715 9.46099C15.472 9.44571 15.2317 9.51963 15.0393 9.66888L14.9453 9.75188L11.6523 13.0439L10.3593 11.7519L10.2653 11.6689C10.0729 11.5197 9.83272 11.4459 9.58975 11.4612C9.34678 11.4766 9.11775 11.58 8.94561 11.7521C8.77346 11.9243 8.67003 12.1533 8.6547 12.3963C8.63937 12.6392 8.7132 12.8795 8.86234 13.0719L8.94534 13.1659L10.9453 15.1659L11.0393 15.2489C11.2147 15.3849 11.4304 15.4588 11.6523 15.4588C11.8743 15.4588 12.09 15.3849 12.2653 15.2489L12.3593 15.1659L16.3593 11.1659L16.4423 11.0719C16.5916 10.8795 16.6655 10.6392 16.6502 10.3962C16.635 10.1532 16.5315 9.92407 16.3593 9.75188Z',
          { fill: color, scale: size / 24 }
        );
      case 'exclamation-circle':
        return <IconExclamationCircle size={size} color={color} />;
      case 'info-circle':
        return <IconInfoCircle size={size} color={color} />;
      case 'shield':
        return <IconShield size={size} color={color} />;
      case 'notes':
        return <IconNotes size={size} color={color} />;
      case 'urgent':
        return <IconUrgent size={size} color={color} />;
      case 'refresh':
        return <IconRefresh size={size} color={color} />;
      case 'icon-user-x':
        return <IconUserX size={size} color={color} />;
      case 'history':
        return <IconHistory size={size} color={color} />;
      case 'file-time':
        return <IconFileTime size={size} color={color} />;
      case 'file-check':
        return <IconFileCheck size={size} color={color} />;
      case 'first-aid-kit':
        return <IconFirstAidKit size={size} color={color} />;
      case 'calendar-due':
        return <IconCalendarDue size={size} color={color} />;
      case 'home':
        return <IconHome size={size} color={color} />;
      case 'user':
        return <IconUser size={size} color={color} />;
      case 'clock':
        return <IconClockHour5 size={size} color={color} />;
      case 'adjustments-horizontal':
        return <IconAdjustmentsHorizontal size={size} color={color} />;
      case 'close':
        return <IconX size={size} color={color} />;
      case 'chevron-up':
        return <IconChevronUp size={size} color={color} />;
      case 'chevron-down':
        return <IconChevronDown size={size} color={color} />;
      case 'chevron-right':
        return <IconChevronRight size={size} color={color} />;
      case 'chevron-left':
        return <IconChevronLeft size={size} color={color} />;
      case 'calendar-search':
        return <IconCalendarSearch size={size} color={color} />;
      case 'checkbox-unchecked':
        return <IconSquare size={size} color={color} />;
      case 'checkbox-checked':
        return getSvg(
          'M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005.195v12.666c0 1.96-1.537 3.56-3.472 3.662l-.195.005H5.667a3.667 3.667 0 01-3.662-3.472L2 18.333V5.667c0-1.96 1.537-3.56 3.472-3.662L5.667 2h12.666zm-2.626 7.293a1 1 0 00-1.414 0L11 12.585l-1.293-1.292-.094-.083a1 1 0 00-1.32 1.497l2 2 .094.083a1 1 0 001.32-.083l4-4 .083-.094a1 1 0 00-.083-1.32z',
          { fill: color }
        );
      case 'calendar-2':
        return getSvg(
          'M30.667 56H16a5.333 5.333 0 01-5.333-5.333v-32A5.333 5.333 0 0116 13.333h32a5.333 5.333 0 015.333 5.334v16M42.667 8v10.667M21.333 8v10.667M10.667 29.333h42.666m-12 11.908h6.75a2.25 2.25 0 012.25 2.25v4.5a2.25 2.25 0 01-2.25 2.25h-4.5a2.25 2.25 0 00-2.25 2.25v4.5a2.25 2.25 0 002.25 2.25h6.75',
          {
            stroke: '#149EF2',
            strokeWidth: 5.33333,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }
        );
      case 'download':
        return <IconDownload size={size} color={color} />;
      case 'share':
        return <IconShare2 size={size} color={color} />;
      case 'gift':
        return <IconGift size={size} color={color} />;
      case 'moon':
        return <IconMoon size={size} color={color} />;
      case 'sunset':
        return <IconSunset size={size} color={color} />;
      case 'sun':
        return <IconSun size={size} color={color} />;
      case 'livo':
        return getSvg(
          'M12.375 9V6.225A1.723 1.723 0 0114.1 4.5h7.8c.953 0 1.725.772 1.725 1.725v5.55c0 .952.773 1.725 1.725 1.725h4.425c.953 0 1.725.773 1.725 1.725V21.9c0 .953-.773 1.725-1.725 1.725h-10.05A1.725 1.725 0 0118 21.9v-6.675c0-.952-.773-1.725-1.725-1.725H6.225c-.952 0-1.725.773-1.725 1.725V21.9c0 .953.772 1.725 1.725 1.725h4.425c.952 0 1.725.773 1.725 1.725v4.425c0 .953.773 1.725 1.725 1.725h7.8a1.723 1.723 0 001.725-1.725v-1.65',
          {
            stroke: color,
            strokeWidth: 3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            scale: size / 36,
          }
        );
      case 'internal-hospital':
        return <IconBuildingHospital size={size} color={color} />;
      case 'calendar-month':
        return <IconCalendarMonth size={size} color={color} />;
      case 'coins':
        return <IconCoins size={size} color={color} />;
      case 'eye':
        return <IconEye size={size} color={color} />;
      case 'eye-closed':
        return <IconEyeClosed size={size} color={color} />;
      case 'exclamation-circle-filled':
        return getSvg(
          'M12 2c5.523 0 10 4.477 10 10a10 10 0 01-19.995.324L2 12l.004-.28C2.152 6.327 6.57 2 12 2zm.01 13l-.127.007a1 1 0 000 1.986L12 17l.127-.007a1 1 0 000-1.986L12.01 15zM12 7a1 1 0 00-.993.883L11 8v4l.007.117a1 1 0 001.986 0L13 12V8l-.007-.117A1 1 0 0012 7z',
          { fill: color, scale: size / 24 }
        );
      case 'users-group':
        return <IconUsersGroup size={size} color={color} />;
      case 'report-medical':
        return <IconReportMedical size={size} color={color} />;
      case 'calendar':
        return <IconCalendarWeek size={size} color={color} />;
      case 'settings':
        return <IconSettings size={size} color={color} />;
      case 'phone':
        return <IconPhone size={size} color={color} />;
      case 'user-check':
        return <IconUserCheck size={size} color={color} />;
      case 'copy':
        return <IconCopy size={size} color={color} />;
      case 'arrow-right':
        return <IconArrowRight size={size} color={color} />;
      case 'plus':
        return <IconPlus size={size} color={color} />;
      case 'replace':
        return <IconReplace size={size} color={color} />;
      case 'mail':
        return <IconMail size={size} color={color} />;
      case 'nurse':
        return <IconNurse size={size} color={color} />;
      case 'map-pin':
        return <IconMapPin size={size} color={color} />;
      case 'key':
        return <IconKey size={size} color={color} />;
      case 'stethoscope':
        return <IconStethoscope size={size} color={color} />;
      case 'heart':
        return <IconHeart size={size} color={color} />;
      case 'heartbeat':
        return <IconHeartbeat size={size} color={color} />;
      case 'heart-filled':
        return <IconHeartFilled size={size} color={color} />;
      case 'search':
        return <IconSearch size={size} color={color} />;
      case 'star':
        return <IconStar size={size} color={color} />;
      case 'star-filled':
        return <IconStarFilled size={size} color={color} />;
      case 'patient-in-bed':
        return <IconPatientInBed size={size} color={color} />;
      case 'pencil':
        return <IconPencil size={size} color={color} />;
      case 'circle-minus':
        return <IconCircleMinus size={size} color={color} />;
      case 'id-badge':
        return <IconIdBadge2 size={size} color={color} />;
      case 'sparkles':
        return <IconSparkles size={size} color={color} />;
      case 'power-off':
        return <IconPower size={size} color={color} />;
      case 'description':
        return <IconBlockquote size={size} color={color} />;
      case 'calendar-event':
        return <IconCalendarEvent size={size} color={color} />;
      case 'trash':
        return <IconTrash size={size} color={color} />;
      case 'alert-triangle':
        return <IconAlertTriangle size={size} color={color} />;
      case 'onboarding-shift':
        return (
          <View
            style={[
              styles.onboardingShiftContainer,
              {
                width: size,
                height: size,
                borderRadius: size,
              },
            ]}
          >
            <IconHeartHandshake
              size={Math.round((size / 3) * 2)}
              color={color || '#7E58C2'}
            />
          </View>
        );
      case 'radiobox-unchecked':
        return getSvg(
          'M1 10.5176C1 11.6995 1.23279 12.8698 1.68508 13.9617C2.13738 15.0537 2.80031 16.0458 3.63604 16.8815C4.47177 17.7173 5.46392 18.3802 6.55585 18.8325C7.64778 19.2848 8.8181 19.5176 10 19.5176C11.1819 19.5176 12.3522 19.2848 13.4442 18.8325C14.5361 18.3802 15.5282 17.7173 16.364 16.8815C17.1997 16.0458 17.8626 15.0537 18.3149 13.9617C18.7672 12.8698 19 11.6995 19 10.5176C19 9.33568 18.7672 8.16536 18.3149 7.07343C17.8626 5.9815 17.1997 4.98934 16.364 4.15362C15.5282 3.31789 14.5361 2.65495 13.4442 2.20266C12.3522 1.75037 11.1819 1.51758 10 1.51758C8.8181 1.51758 7.64778 1.75037 6.55585 2.20266C5.46392 2.65495 4.47177 3.31789 3.63604 4.15362C2.80031 4.98934 2.13738 5.9815 1.68508 7.07343C1.23279 8.16536 1 9.33568 1 10.5176Z',
          {
            stroke: color,
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }
        );
      case 'radiobox-checked':
        return getSvg(
          'M15 1.85747C16.5083 2.72833 17.7629 3.978 18.6398 5.48277C19.5167 6.98755 19.9854 8.69524 19.9994 10.4368C20.0135 12.1784 19.5725 13.8934 18.72 15.4122C17.8676 16.9309 16.6332 18.2007 15.1392 19.0958C13.6452 19.9909 11.9434 20.4803 10.2021 20.5155C8.46083 20.5508 6.74055 20.1306 5.21155 19.2967C3.68256 18.4628 2.39787 17.244 1.48467 15.761C0.571462 14.278 0.0614093 12.5822 0.00500011 10.8415L0 10.5175L0.00500011 10.1935C0.0610032 8.46646 0.563548 6.78343 1.46364 5.30846C2.36373 3.8335 3.63065 2.61692 5.14089 1.77735C6.65113 0.937783 8.35315 0.503867 10.081 0.517908C11.8089 0.531949 13.5036 0.993468 15 1.85747ZM13.707 7.81047C13.5348 7.63829 13.3057 7.53486 13.0627 7.51958C12.8197 7.5043 12.5794 7.57822 12.387 7.72747L12.293 7.81047L9 11.1025L7.707 9.81047L7.613 9.72747C7.42058 9.57833 7.18037 9.5045 6.9374 9.51982C6.69444 9.53515 6.46541 9.63859 6.29326 9.81073C6.12112 9.98288 6.01768 10.2119 6.00235 10.4549C5.98702 10.6978 6.06086 10.9381 6.21 11.1305L6.293 11.2245L8.293 13.2245L8.387 13.3075C8.56237 13.4435 8.77803 13.5174 9 13.5174C9.22197 13.5174 9.43763 13.4435 9.613 13.3075L9.707 13.2245L13.707 9.22447L13.79 9.13047C13.9393 8.93807 14.0132 8.69782 13.9979 8.45479C13.9826 8.21176 13.8792 7.98266 13.707 7.81047Z',
          {
            fill: color,
          }
        );
      case 'pending-invitation':
        return getSvg(
          'M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H13.5M8 7C8 8.06087 8.42143 9.07828 9.17157 9.82843C9.92172 10.5786 10.9391 11 12 11C13.0609 11 14.0783 10.5786 14.8284 9.82843C15.5786 9.07828 16 8.06087 16 7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7Z M19 19C18.4696 19 17.9609 19.2107 17.5858 19.5858C17.2107 19.9609 17 20.4696 17 21V21.6667C17 21.7551 17.0351 21.8399 17.0976 21.9024C17.1601 21.9649 17.2449 22 17.3333 22H20.6667C20.7551 22 20.8399 21.9649 20.9024 21.9024C20.9649 21.8399 21 21.7551 21 21.6667V21C21 20.4696 20.7893 19.9609 20.4142 19.5858C20.0391 19.2107 19.5304 19 19 19ZM19 19C18.4696 19 17.9609 18.7893 17.5858 18.4142C17.2107 18.0391 17 17.5304 17 17V16.3333C17 16.2449 17.0351 16.1601 17.0976 16.0976C17.1601 16.0351 17.2449 16 17.3333 16H20.6667C20.7551 16 20.8399 16.0351 20.9024 16.0976C20.9649 16.1601 21 16.2449 21 16.3333V17C21 17.5304 20.7893 18.0391 20.4142 18.4142C20.0391 18.7893 19.5304 19 19 19Z',
          {
            stroke: color,
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }
        );
      case 'rejected-invitation':
        return getSvg(
          'M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14M17 21L21 17M21 21L17 17M8 7C8 8.06087 8.42143 9.07828 9.17157 9.82843C9.92172 10.5786 10.9391 11 12 11C13.0609 11 14.0783 10.5786 14.8284 9.82843C15.5786 9.07828 16 8.06087 16 7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7Z',
          {
            stroke: color,
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }
        );
      case 'pro-not-available-invitation':
        return getSvg(
          'M1 19V17C1 15.9391 1.42143 14.9217 2.17157 14.1716C2.92172 13.4214 3.93913 13 5 13H8.5M12 19L16 15M3 5C3 6.06087 3.42143 7.07828 4.17157 7.82843C4.92172 8.57857 5.93913 9 7 9C8.06087 9 9.07828 8.57857 9.82843 7.82843C10.5786 7.07828 11 6.06087 11 5C11 3.93913 10.5786 2.92172 9.82843 2.17157C9.07828 1.42143 8.06087 1 7 1C5.93913 1 4.92172 1.42143 4.17157 2.17157C3.42143 2.92172 3 3.93913 3 5ZM11 17C11 17.7956 11.3161 18.5587 11.8787 19.1213C12.4413 19.6839 13.2044 20 14 20C14.7956 20 15.5587 19.6839 16.1213 19.1213C16.6839 18.5587 17 17.7956 17 17C17 16.2044 16.6839 15.4413 16.1213 14.8787C15.5587 14.3161 14.7956 14 14 14C13.2044 14 12.4413 14.3161 11.8787 14.8787C11.3161 15.4413 11 16.2044 11 17Z',
          {
            stroke: color,
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }
        );
      case 'money':
        return getSvg(
          'M18.5 12H18.51M6.5 12H6.51M9.5 12C9.5 12.7956 9.81607 13.5587 10.3787 14.1213C10.9413 14.6839 11.7044 15 12.5 15C13.2956 15 14.0587 14.6839 14.6213 14.1213C15.1839 13.5587 15.5 12.7956 15.5 12C15.5 11.2044 15.1839 10.4413 14.6213 9.87868C14.0587 9.31607 13.2956 9 12.5 9C11.7044 9 10.9413 9.31607 10.3787 9.87868C9.81607 10.4413 9.5 11.2044 9.5 12ZM3.5 8C3.5 7.46957 3.71071 6.96086 4.08579 6.58579C4.46086 6.21071 4.96957 6 5.5 6H19.5C20.0304 6 20.5391 6.21071 20.9142 6.58579C21.2893 6.96086 21.5 7.46957 21.5 8V16C21.5 16.5304 21.2893 17.0391 20.9142 17.4142C20.5391 17.7893 20.0304 18 19.5 18H5.5C4.96957 18 4.46086 17.7893 4.08579 17.4142C3.71071 17.0391 3.5 16.5304 3.5 16V8Z',
          {
            stroke: color,
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }
        );
      case 'radiobox-filled':
        return getSvg(
          'M15 1.35552C16.5083 2.22637 17.7629 3.47604 18.6398 4.98082C19.5167 6.48559 19.9854 8.19329 19.9994 9.93486C20.0135 11.6764 19.5725 13.3915 18.72 14.9102C17.8676 16.429 16.6332 17.6987 15.1392 18.5938C13.6452 19.4889 11.9434 19.9783 10.2021 20.0136C8.46083 20.0488 6.74055 19.6287 5.21155 18.7948C3.68256 17.9608 2.39787 16.742 1.48467 15.259C0.571462 13.776 0.0614093 12.0802 0.00500011 10.3395L0 10.0155L0.00500011 9.69152C0.0610032 7.96451 0.563548 6.28148 1.46364 4.80651C2.36373 3.33154 3.63065 2.11497 5.14089 1.2754C6.65113 0.43583 8.35315 0.00191422 10.081 0.0159552C11.8089 0.0299963 13.5036 0.491515 15 1.35552ZM10 8.01552C9.52206 8.0155 9.05992 8.18663 8.69726 8.49793C8.3346 8.80922 8.09541 9.24009 8.023 9.71252L8.005 9.86652L8 10.0155L8.005 10.1655C8.03419 10.5536 8.17594 10.9247 8.4129 11.2334C8.64986 11.542 8.97172 11.7749 9.33904 11.9034C9.70637 12.0318 10.1032 12.0504 10.4809 11.9567C10.8586 11.863 11.2007 11.6612 11.4654 11.3759C11.7301 11.0906 11.9059 10.7344 11.9711 10.3507C12.0363 9.96708 11.9882 9.57275 11.8326 9.21604C11.6771 8.85934 11.4208 8.55577 11.0953 8.34253C10.7698 8.12929 10.3891 8.01564 10 8.01552Z',
          {
            fill: color,
          }
        );
      default:
        return null;
    }
  }

  return renderIcon();
};

const styles = StyleSheet.create({
  onboardingShiftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3DFF4',
  },
});

export default LivoIcon;
