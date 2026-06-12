'use client';

import { CloudLayer } from './cloud-layer';
import { siteCloudLayers } from './cloud-paths';
import { VicLegoCloudPeek } from './vic-lego-cameos';
import styles from './site-pastel-background.module.scss';

const farCloudLayer = siteCloudLayers.find((layer) => layer.depth === 'far');
const frontCloudLayers = siteCloudLayers.filter((layer) => layer.depth !== 'far');

type Props = {
  cloudPeekAnchorRef?: React.RefObject<HTMLElement | null>;
};

export function SitePastelBackground({ cloudPeekAnchorRef }: Props) {
  return (
    <div className={styles.backdrop} aria-hidden>
      <div className={styles.skyBase} />
      <div className={styles.sky} />
      <div className={styles.skyDrift} />

      <div className={styles.blobLayer}>
        <span className={`${styles.blob} ${styles.blobA}`} />
        <span className={`${styles.blob} ${styles.blobB}`} />
        <span className={`${styles.blob} ${styles.blobC}`} />
        <span className={`${styles.blob} ${styles.blobD}`} />
      </div>

      <div className={styles.cloudStack}>
        {farCloudLayer ? <CloudLayer layer={farCloudLayer} /> : null}
        {frontCloudLayers.flatMap((layer) => [
          <CloudLayer key={layer.id} layer={layer} />,
          ...(layer.depth === 'back' && cloudPeekAnchorRef
            ? [
                <VicLegoCloudPeek
                  key={`${layer.id}-lego`}
                  anchorRef={cloudPeekAnchorRef}
                />,
              ]
            : []),
        ])}
      </div>

      <div className={styles.grain} />
    </div>
  );
}
