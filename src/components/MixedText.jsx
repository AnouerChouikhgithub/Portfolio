import React from 'react';

/**
 * Regex matching Latin words, technical acronyms, model numbers, and code tokens.
 */
const LATIN_TOKEN_REGEX = /([A-Za-z0-9+#_./@:-]+(?:\s+[A-Za-z0-9+#_./@:-]+)*)/g;

/**
 * MixedText — ensures Latin words, acronyms, and technical terms inside RTL (Arabic)
 * text do not cause punctuation flipping or bi-directional order anomalies.
 */
export default function MixedText({ text, isRtl = false }) {
  if (!text || typeof text !== 'string' || !isRtl) {
    return <>{text}</>;
  }

  // Split text by Latin tokens and wrap each in <bdi>
  const parts = text.split(LATIN_TOKEN_REGEX);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        if (/^[A-Za-z0-9+#_./@:-]/.test(part)) {
          return <bdi key={index} dir="ltr">{part}</bdi>;
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}
