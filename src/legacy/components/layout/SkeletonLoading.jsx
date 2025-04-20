export default function SkeletonLoading({ lineWidths, containerWidth }) {
  const SkeletonLine = ({ width }) => {
    const MAX_WIDTH = containerWidth - 50;
    const totalWidth = Math.ceil(width);
    const bars = Math.floor(totalWidth / MAX_WIDTH);
    const remainder = Math.ceil(totalWidth - MAX_WIDTH * bars);

    // 빈글씨
    if (width <= 10) {
      return (
        <div
          className="skeletonLine opacity-0 !mb-[8px]"
          style={{
            width: `${width + 10}px`,
          }}
        />
      );
    }

    //
    if (width < MAX_WIDTH) {
      return (
        <div
          className="skeletonLine"
          style={{
            width: `${width + 10}px`,
          }}
        />
      );
    }

    return (
      <div>
        {Array.from({ length: bars }).map((_, index) => (
          <div
            key={index}
            className="skeletonLine"
            style={{
              width: `${MAX_WIDTH}px`,
            }}
          />
        ))}
        {/* 여기보기 */}
        {remainder > 0 && (
          <div
            className="skeletonLine"
            style={{
              width: `${remainder + 150 > MAX_WIDTH ? MAX_WIDTH : remainder + 20}px`,
            }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {lineWidths.map((width, i) => (
        <SkeletonLine
          key={i}
          width={width}
        />
      ))}
    </>
  );
}
