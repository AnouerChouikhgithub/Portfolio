import { useEffect, useState } from 'react';
import WebpImage from './WebpImage';

export default function CrossfadeImage({ src, alt, imageClassName = '', ...imageProps }) {
  const [activeSrc, setActiveSrc] = useState(src);
  const [previousSrc, setPreviousSrc] = useState(null);

  useEffect(() => {
    if (src === activeSrc) return undefined;

    setPreviousSrc(activeSrc);
    setActiveSrc(src);
    const timerId = window.setTimeout(() => setPreviousSrc(null), 320);
    return () => window.clearTimeout(timerId);
  }, [activeSrc, src]);

  return (
    <span className="carousel-crossfade" aria-live="off">
      {previousSrc && (
        <WebpImage
          className={`carousel-crossfade__image carousel-crossfade__image--outgoing ${imageClassName}`}
          src={previousSrc}
          alt=""
          aria-hidden="true"
        />
      )}
      <WebpImage
        className={`carousel-crossfade__image carousel-crossfade__image--incoming ${imageClassName}`}
        src={activeSrc}
        alt={alt}
        {...imageProps}
      />
    </span>
  );
}
