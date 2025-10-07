import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  Dimensions,
  EmitterSubscription,
  Keyboard,
  KeyboardEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';

interface KeyboardAwareScrollViewProps extends ScrollViewProps {
  children: ReactNode;
  /**
   * Additional vertical offset from the keyboard
   * @default 20
   */
  keyboardOffset?: number;
  /**
   * Whether to dismiss keyboard on scroll
   * @default true
   */
  dismissKeyboardOnScroll?: boolean;
  /**
   * Height of the footer space to prevent content from being hidden behind keyboard
   * @default 0
   */
  footerHeight?: number;
}

const KeyboardAwareScrollView = forwardRef<
  ScrollView,
  KeyboardAwareScrollViewProps
>(
  (
    {
      children,
      keyboardOffset = 20,
      dismissKeyboardOnScroll = false,
      footerHeight = 0,
      contentContainerStyle,
      style,
      onScroll,
      ...props
    },
    ref
  ) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const keyboardDidShowListener = useRef<EmitterSubscription | null>(null);
    const keyboardDidHideListener = useRef<EmitterSubscription | null>(null);
    const footerRef = useRef<View>(null);
    const scrollPosition = useRef(0);
    const keyboardHeight = useRef(0);

    // Sync internal ref with forwarded ref
    React.useImperativeHandle(ref, () => scrollViewRef.current!);

    // Memoize keyboard handlers for stable references
    const onKeyboardShow = useCallback(
      (event: KeyboardEvent) => {
        if (!scrollViewRef.current || !footerRef.current) {
          return;
        }

        keyboardHeight.current = event.endCoordinates.height;

        // Use requestAnimationFrame instead of setTimeout for better performance
        requestAnimationFrame(() => {
          if (!footerRef.current) {
            return;
          }

          footerRef.current.measure((x, y, width, height, pageX, pageY) => {
            const screenHeight = Dimensions.get('window').height;

            // Handle Android undefined values
            const measuredHeight = height || 0;
            const measuredPageY = pageY || 0;

            // If values are undefined on Android, use a position-based approach
            const focusedInputY =
              Platform.OS === 'android' &&
              (pageY === undefined || height === undefined)
                ? scrollPosition.current + screenHeight - keyboardOffset
                : measuredPageY + measuredHeight;

            const keyboardY = screenHeight - keyboardHeight.current;

            if (!isNaN(focusedInputY) && focusedInputY > keyboardY) {
              const scrollTo =
                scrollPosition.current +
                (focusedInputY - keyboardY) +
                keyboardOffset;

              scrollViewRef.current?.scrollTo({
                y: scrollTo,
                animated: true,
              });
            }
          });
        });
      },
      [keyboardOffset]
    );

    const onKeyboardHide = useCallback(() => {
      keyboardHeight.current = 0;
    }, []);

    // Use listener setup in a separate effect with dependencies
    useEffect(() => {
      const keyboardShowEvent =
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      const keyboardHideEvent =
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

      keyboardDidShowListener.current = Keyboard.addListener(
        keyboardShowEvent,
        onKeyboardShow
      );
      keyboardDidHideListener.current = Keyboard.addListener(
        keyboardHideEvent,
        onKeyboardHide
      );

      return () => {
        keyboardDidShowListener.current?.remove();
        keyboardDidHideListener.current?.remove();
      };
    }, [onKeyboardShow, onKeyboardHide]);

    // Memoized scroll handler
    const handleScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollPosition.current = event.nativeEvent.contentOffset.y;
        if (dismissKeyboardOnScroll) {
          Keyboard.dismiss();
        }
        onScroll?.(event);
      },
      [dismissKeyboardOnScroll, onScroll]
    );

    // Memoize style calculations to prevent recreation on each render
    const computedStyle = useMemo(() => [styles.scrollView, style], [style]);
    const computedContentContainerStyle = useMemo(
      () => [styles.contentContainer, contentContainerStyle],
      [contentContainerStyle]
    );
    const footerStyle = useMemo(
      () => ({ height: footerHeight + keyboardHeight.current }),
      [footerHeight, keyboardHeight.current]
    );

    return (
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={computedStyle}
        contentContainerStyle={computedContentContainerStyle}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        removeClippedSubviews={Platform.OS === 'android'} // Improves performance on Android
        {...props}
      >
        {children}
        <View ref={footerRef} style={footerStyle} />
      </ScrollView>
    );
  }
);

// Add display name
KeyboardAwareScrollView.displayName = 'KeyboardAwareScrollView';

// Wrap with React.memo for additional performance optimization
export default React.memo(KeyboardAwareScrollView);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
