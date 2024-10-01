import React from 'react';
import { Box, BoxProps, Heading, Text, Stack } from '@chakra-ui/react';

export interface CardProps extends BoxProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'elevated' | 'outline' | 'filled';
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  variant = 'elevated',
  hoverEffect = true,
  ...props
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'outline':
        return {
          border: '1px solid',
          borderColor: 'gray.200',
        };
      case 'filled':
        return {
          bg: 'gray.100',
        };
      case 'elevated':
      default:
        return {
          boxShadow: 'md',
        };
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      p={6}
      transition="all 0.3s"
      _hover={
        hoverEffect
          ? {
              transform: 'translateY(-5px)',
              boxShadow: 'xl',
            }
          : undefined
      }
      {...getCardStyle()}
      {...props}
    >
      <Stack spacing={4}>
        {title && (
          <Heading as="h3" size="md">
            {title}
          </Heading>
        )}
        {subtitle && (
          <Text fontSize="sm" color="gray.600">
            {subtitle}
          </Text>
        )}
        {children}
      </Stack>
    </Box>
  );
};

export default Card;
