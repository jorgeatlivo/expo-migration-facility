import { View } from 'react-native';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

interface AvatarProps {
  size: number;
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({ size, style }) => {
  return (
    <View
      style={{
        height: size,
        width: size,
        ...style,
      }}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        <G clipPath="url(#clip0_474_4186)">
          <Rect width={size} height={size} rx={8} fill="#DAE4E7" />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.111 22.111c0-2.416.937-4.734 2.604-6.442A8.78 8.78 0 0124 13a8.78 8.78 0 016.285 2.669 9.228 9.228 0 012.604 6.442 9.228 9.228 0 01-2.604 6.443A8.78 8.78 0 0124 31.222a8.78 8.78 0 01-6.285-2.668 9.228 9.228 0 01-2.604-6.443zm0 13.667c-2.947 0-5.773 1.2-7.857 3.336A11.535 11.535 0 004 47.166c0 1.812.702 3.55 1.953 4.832A6.585 6.585 0 0010.667 54h26.666c1.768 0 3.464-.72 4.714-2.001A6.921 6.921 0 0044 47.167c0-3.02-1.17-5.918-3.254-8.053a10.975 10.975 0 00-7.857-3.336H15.11z"
            fill="#848DA9"
            scale={size / 48}
          />
        </G>
        <Defs>
          <ClipPath id="clip0_474_4186">
            <Rect width={size} height={size} rx={8} fill="#fff" />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
};
