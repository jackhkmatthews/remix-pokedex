import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { usePrevious } from "./use-previous";

export function Image({
  className,
  alt,
  src,
  ...imgProps
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isClientSide, setIsClientSide] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const previousImageSrc = usePrevious(src);

  function onLoaded() {
    setHasLoaded(true);
  }

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    if (src !== previousImageSrc) {
      setHasLoaded(false);
    }
  }, [src, previousImageSrc]);

  const showImage =
    !isClientSide ||
    (isClientSide && (hasLoaded || imageRef.current?.complete));

  return (
    <img
      alt={alt}
      ref={imageRef}
      src={src}
      onLoad={onLoaded}
      className={twMerge(
        "transition-opacity",
        showImage ? "opacity-100" : "opacity-0",
        className
      )}
      {...imgProps}
    />
  );
}
