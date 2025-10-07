/**
 * a simple markdown parser that supports bold and italic for React Native
 * Can add more parsers for other markdown syntax like underline, strikethrough, etc.
 * Continuous handling using chain of responsibility pattern
 */

import React from 'react';
import { Linking, StyleProp, StyleSheet, Text } from 'react-native';
import { TextStyle } from 'react-native';
import { useLinkTo } from '@react-navigation/native';

import { Logger } from '@/services/logger.service';

type MarkdownOutput = (string | React.JSX.Element)[];

// Define proper interface for link props
interface MarkdownLinkProps {
  children: React.ReactNode;
  to: string;
  state?: Record<string, unknown>;
  target?: string;
  rel?: string;
  decorator?: string; // Add decorator property
  color?: string; // Add color property
  fontSize?: string; // Add fontSize property
  onLinkPress?: (url: string) => void; // Add callback prop
}

// Create a link component that uses navigation
const MarkdownLink = ({
  children,
  to,
  target,
  decorator,
  color, // Add color parameter
  fontSize, // Add fontSize parameter
  onLinkPress,
}: MarkdownLinkProps) => {
  const linkTo = useLinkTo();

  // Get the appropriate style based on decorator
  const getDecoratorStyle = () => {
    // Check if decorator is a valid textDecorationLine value
    const validTextDecorations = [
      'none',
      'underline',
      'line-through',
      'underline line-through',
    ];

    if (decorator && validTextDecorations.includes(decorator)) {
      return {
        textDecorationLine: decorator as
          | 'none'
          | 'underline'
          | 'line-through'
          | 'underline line-through',
      };
    }

    // Handle other custom decorators
    switch (decorator) {
      case 'highlight':
        return styles.highlight;
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      default:
        return {};
    }
  };

  const handlePress = () => {
    // Call the onLinkPress callback if provided
    if (onLinkPress) {
      onLinkPress(to);
    }

    // Handle external links
    if (to.startsWith('http') || target === '_blank') {
      Linking.canOpenURL(to)
        .then((supported) => {
          if (supported) {
            Linking.openURL(to);
          } else {
            console.warn(`Cannot open URL: ${to}`);
            // Optional: You might want to show a warning to the user
          }
        })
        .catch((err: Error) => console.error('An error occurred', err));
      return;
    }

    // Handle internal navigation using useLinkTo which supports:
    // - Path parameters: /users/:id
    // - Query strings: /users?sortBy=name
    // - Nested navigation
    try {
      linkTo(to);
    } catch (error: unknown) {
      Logger.error(
        'MarkdownLink',
        error instanceof Error ? error : String(error)
      );
    }
  };

  // Create a style object that includes custom color if provided
  const linkStyle = [
    styles.link,
    getDecoratorStyle(),
    color ? { color } : null,
    fontSize ? { fontSize: Number(fontSize) } : null,
  ];

  return (
    <Text onPress={handlePress} style={linkStyle}>
      {children}
    </Text>
  );
};

// handle bold
export const parseBold = (input: MarkdownOutput): MarkdownOutput => {
  const regex = /\*\*(.*?)\*\*/g;
  return input.flatMap((part, index) => {
    if (typeof part !== 'string') return [part];
    const segments: (string | React.JSX.Element)[] = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(part)) !== null) {
      if (lastIndex < match.index) {
        segments.push(part.slice(lastIndex, match.index));
      }
      segments.push(
        <Text key={`bold-${index}-${segments.length}`} style={styles.bold}>
          {match[1]}
        </Text>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < part.length) {
      segments.push(part.slice(lastIndex));
    }

    return segments;
  });
};

// handle italic
export const parseItalic = (input: MarkdownOutput): MarkdownOutput => {
  const regex = /\*(.*?)\*/g;
  return input.flatMap((part, index) => {
    if (typeof part !== 'string') return [part];
    const segments: (string | React.JSX.Element)[] = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(part)) !== null) {
      if (lastIndex < match.index) {
        segments.push(part.slice(lastIndex, match.index));
      }
      segments.push(
        <Text key={`italic-${index}-${segments.length}`} style={styles.italic}>
          {match[1]}
        </Text>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < part.length) {
      segments.push(part.slice(lastIndex));
    }

    return segments;
  });
};

export const parseLink = (
  input: MarkdownOutput,
  onLinkPress?: (url: string) => void
): MarkdownOutput => {
  const regex = /\[(.*?)\]\((.*?)\)(?:\{(.*?)\})?/g;
  return input.flatMap((part, index) => {
    if (typeof part !== 'string') return [part];
    const segments: (string | React.JSX.Element)[] = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(part)) !== null) {
      if (lastIndex < match.index) {
        segments.push(part.slice(lastIndex, match.index));
      }

      const attributes =
        match[3]?.split(' ').reduce((acc, attr) => {
          const [key, value] = attr.split('=');
          if (key && value) {
            acc[key] = value.replace(/['"]+/g, '');
          }
          return acc;
        }, {} as Record<string, string>) || {};

      segments.push(
        <MarkdownLink
          key={`link-${index}-${segments.length}`}
          to={match[2] || '#'}
          target={attributes.target || undefined}
          rel={attributes.rel || 'noopener noreferrer'}
          decorator={attributes.decorator || undefined}
          color={attributes.color || undefined}
          fontSize={attributes.fontSize || undefined}
          onLinkPress={onLinkPress}
        >
          {match[1]}
        </MarkdownLink>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < part.length) {
      segments.push(part.slice(lastIndex));
    }

    return segments;
  });
};

const chainProcessors = (
  processors: ((
    input: MarkdownOutput,
    onLinkPress?: (url: string) => void
  ) => MarkdownOutput)[],
  initialInput: string,
  onLinkPress?: (url: string) => void
): MarkdownOutput => {
  return processors.reduce<MarkdownOutput>(
    (output, processor) => processor(output, onLinkPress),
    [initialInput]
  );
};

export const markdown = (
  text: string,
  onLinkPress?: (url: string) => void
): MarkdownOutput => {
  return chainProcessors(
    [parseBold, parseItalic, (input) => parseLink(input, onLinkPress)],
    text,
    onLinkPress
  );
};

// React Native implementation to render the final output
export const MarkdownText = ({
  text,
  style,
  onLinkPress,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  onLinkPress?: (url: string) => void;
}) => {
  const parsedContent = markdown(text, onLinkPress);

  return (
    <Text style={style}>
      {parsedContent.map((part, index) =>
        typeof part === 'string' ? (
          <Text key={`text-${index}`}>{part}</Text>
        ) : (
          React.cloneElement(part, { key: `element-${index}` })
        )
      )}
    </Text>
  );
};

// Define styles for React Native
const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  link: {
    fontWeight: '600',
    textDecorationLine: 'none',
  },
  // Keep color-based decorators, but remove underline style
  highlight: {
    backgroundColor: '#FFFF00',
  },
  primary: {
    color: '#007BFF',
  },
  secondary: {
    color: '#6C757D',
  },
});
