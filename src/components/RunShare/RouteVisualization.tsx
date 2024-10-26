import type { ParsedGPX } from "@we-gold/gpxjs";

type RouteVisualizationProps = {
  gpx: ParsedGPX;
};

export const RouteVisualization = ({ gpx }: RouteVisualizationProps) => {
  // Combine all points from tracks
  const allPoints = gpx.tracks.flatMap(track => track.points);

  if (allPoints.length === 0) {
    return <div className="text-white/70">No route data available</div>;
  }

  // Find the bounds of the route
  const minLat = Math.min(...allPoints.map(p => p.latitude));
  const maxLat = Math.max(...allPoints.map(p => p.latitude));
  const minLon = Math.min(...allPoints.map(p => p.longitude));
  const maxLon = Math.max(...allPoints.map(p => p.longitude));

  // Add some padding
  const padding = 20;
  const width = 560; // 600px - 40px padding to match your card's padding
  const height = 200; // Adjusted to leave room for stats

  // Function to scale the coordinates to fit the SVG viewport
  const scaleCoordinate = (value: number, min: number, max: number, dimension: number) => {
    const scale = (dimension - (2 * padding)) / (max - min);
    return padding + ((value - min) * scale);
  };

  // Create the path data
  const pathData = allPoints.map((point, index) => {
    const x = scaleCoordinate(point.longitude, minLon, maxLon, width);
    const y = height - scaleCoordinate(point.latitude, minLat, maxLat, height);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="mt-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
      >
        {/* Route path */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Start point */}
        <circle
          cx={scaleCoordinate(allPoints[0].longitude, minLon, maxLon, width)}
          cy={height - scaleCoordinate(allPoints[0].latitude, minLat, maxLat, height)}
          r="4"
          className="fill-green-400"
        />
        {/* End point */}
        <circle
          cx={scaleCoordinate(allPoints[allPoints.length - 1].longitude, minLon, maxLon, width)}
          cy={height - scaleCoordinate(allPoints[allPoints.length - 1].latitude, minLat, maxLat, height)}
          r="4"
          className="fill-red-400"
        />
      </svg>
    </div>
  );
};
