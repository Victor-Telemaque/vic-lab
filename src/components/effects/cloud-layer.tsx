import styles from './site-pastel-background.module.scss';
import type { CloudDepth, CloudLayerDef } from './cloud-paths';

type Props = {
  layer: CloudLayerDef;
};

const depthClassMap: Record<CloudDepth, string | undefined> = {
  far: styles.cloudFar,
  back: styles.cloudBack,
  mid: styles.cloudMid,
  near: styles.cloudNear,
  edge: styles.cloudEdge,
};

export function CloudLayer({ layer }: Props) {
  const depthClass = depthClassMap[layer.depth];

  return (
    <div className={`${styles.cloudShelf} ${depthClass}`}>
      <div className={styles.cloudMotionX}>
        <div className={styles.cloudMotionY}>
          <svg
            className={styles.cloudSvg}
            viewBox={layer.viewBox}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {layer.paths.map((path, index) => (
              <path
                key={`${layer.id}-path-${index}`}
                d={path.d}
                fill={`url(#${layer.id}-fade-${index})`}
              />
            ))}
            <defs>
              {layer.paths.map((path, index) => (
                <linearGradient
                  key={`${layer.id}-grad-${index}`}
                  id={`${layer.id}-fade-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={`var(${path.colorVar})`} />
                  <stop
                    offset={`${path.fadeFrom ?? 68}%`}
                    stopColor={`var(${path.colorVar})`}
                  />
                  <stop
                    offset="100%"
                    stopColor={`var(${path.colorVar})`}
                    stopOpacity="0"
                  />
                </linearGradient>
              ))}
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
