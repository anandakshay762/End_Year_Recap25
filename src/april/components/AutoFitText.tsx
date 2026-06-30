import React, { useState, useLayoutEffect, useRef } from "react";

interface AutoFitTextProps {
  children: string;
  maxWidth: number;
  maxHeight?: number;
  baseFontSize: number;
  minFontSize?: number;
  style?: React.CSSProperties;
}

export const AutoFitText: React.FC<AutoFitTextProps> = ({
  children,
  maxWidth,
  maxHeight,
  baseFontSize,
  minFontSize = 16,
  style,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(baseFontSize);

  useLayoutEffect(() => {
    if (!ref.current) return;
    let size = baseFontSize;
    ref.current.style.fontSize = `${size}px`;
    let safety = 0;
    while (safety < 200) {
      const overflowsW = ref.current.scrollWidth > maxWidth;
      const overflowsH = maxHeight ? ref.current.scrollHeight > maxHeight : false;
      if (!overflowsW && !overflowsH) break;
      if (size <= minFontSize) { size = minFontSize; break; }
      size -= 2;
      ref.current.style.fontSize = `${size}px`;
      safety++;
    }
    setFontSize(size);
  }, [children, baseFontSize, maxWidth, maxHeight, minFontSize]);

  return (
    <span
      ref={ref}
      style={{
        fontSize,
        lineHeight: 1.05,
        whiteSpace: maxHeight ? "normal" : "nowrap",
        display: "inline-block",
        maxWidth,
        wordBreak: maxHeight ? "break-word" : "normal",
        ...style,
      }}
    >
      {children}
    </span>
  );
};
