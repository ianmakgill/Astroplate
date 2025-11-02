import React from "react";

interface ChartProps {
  src: string;
  alt: string;
  caption?: string;
  minWidth?: number;
}

const Chart: React.FC<ChartProps> = ({
  src,
  alt,
  caption,
  minWidth = 800
}) => {
  return (
    <figure className="my-8">
      {/* Mobile: Horizontal scroll container */}
      <div className="overflow-x-auto lg:overflow-x-visible -mx-4 px-4 lg:mx-0 lg:px-0">
        <img
          src={src}
          alt={alt}
          className={`lg:w-full`}
          style={{ minWidth: `${minWidth}px` }}
        />
      </div>

      {/* Optional caption */}
      {caption && (
        <figcaption className="text-sm text-center mt-3 text-text-light dark:text-darkmode-text-light">
          {caption}
        </figcaption>
      )}

      {/* Mobile hint */}
      <p className="text-xs text-center mt-2 text-text-light dark:text-darkmode-text-light lg:hidden">
        Swipe to view full chart →
      </p>
    </figure>
  );
};

export default Chart;
