declare module 'react-rating-stars-component' {
  const ReactStars: React.ComponentType<{
    count?: number;
    value?: number;
    size?: number;
    color?: string;
    activeColor?: string;
    edit?: boolean;
    isHalf?: boolean;
    onChange?: (newRating: number) => void;
  }>;
  export default ReactStars;
}
