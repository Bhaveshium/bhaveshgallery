import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

interface GalleryItem {
  type?: "image" | "video";
  title?: string;
  src: string;
  videoSrc?: string;
  highResSrc?: string;
  alt: string;
  photographer?: string;
  client?: string;
  location?: string;
  details?: string;
  span?: number;
  width?: number;
  height?: number;
}

interface MasonryGalleryProps {
  images: GalleryItem[];
  onImageClick: (index: number) => void;
}

const MasonryGallery = ({ images, onImageClick }: MasonryGalleryProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 0, rotateY: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tiltRef = useRef<HTMLButtonElement | null>(null);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const handleImageHover = (index: number) => {
    setHoveredIndex(index);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setHoveredIndex(null), 2800);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (hoveredIndex !== index) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateY: x * 12,   // max 6deg tilt
      rotateX: -y * 12,  // invert Y for natural feel
    });
  }, [hoveredIndex]);

  const handleImageLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto md:px-5 pb-16">
      <div className="gallery-hover-container text-center" style={{ perspective: "800px" }}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageClick(index)}
            onMouseEnter={() => handleImageHover(index)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleImageLeave}
            className="relative cursor-zoom-in gallery-image inline-block align-top p-[3px] md:p-1 lg:p-1.5"
            style={{
              height: "270px",
              transform: hoveredIndex === index
                ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.03)`
                : "rotateX(0) rotateY(0) scale(1)",
              transition: "transform 0.15s ease-out",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative h-full overflow-hidden">
              {image.type === "video" ? (
                <div className="relative h-full w-auto inline-block">
                  {image.width && image.height && (
                    <svg
                      width={image.width}
                      height={image.height}
                      viewBox={`0 0 ${image.width} ${image.height}`}
                      className="h-full w-auto"
                    >
                      <rect width={image.width} height={image.height} fill="white" />
                    </svg>
                  )}
                  <video
                    poster={image.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={() => handleImageLoad(index)}
                    className={`absolute top-0 left-0 h-full w-auto object-contain transition-all duration-400 ${
                      hoveredIndex !== null && hoveredIndex !== index ? "grayscale" : ""
                    }`}
                    style={{
                      opacity: loadedImages.has(index) ? 1 : 0,
                      transition: "opacity 0.5s ease-out",
                    }}
                  >
                    <source src={image.videoSrc} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <picture
                  className={`inline-block h-full w-auto ${loadedImages.has(index) ? "show" : ""}`}
                >
                  {image.width && image.height && (
                    <svg
                      width={image.width}
                      height={image.height}
                      viewBox={`0 0 ${image.width} ${image.height}`}
                      className="h-full w-auto"
                    >
                      <rect width={image.width} height={image.height} fill="white" />
                    </svg>
                  )}
                  <img
                    src={image.src}
                    alt={image.alt}
                    onLoad={() => handleImageLoad(index)}
                    className={`absolute top-0 left-0 h-full w-auto object-contain transition-all duration-400 ${
                      hoveredIndex !== null && hoveredIndex !== index ? "grayscale" : ""
                    }`}
                    style={{
                      opacity: loadedImages.has(index) ? 1 : 0,
                      transition: "opacity 0.5s ease-out",
                    }}
                    loading="lazy"
                  />
                </picture>
              )}
              <ProgressiveBlur
                className="pointer-events-none absolute bottom-0 left-0 h-[80%] w-full"
                blurIntensity={0.6}
                animate={hoveredIndex === index ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
              {(image.title || image.photographer || image.client) && (
                <motion.div
                  className="absolute bottom-0 left-0 w-full pointer-events-none flex items-center justify-center"
                  animate={hoveredIndex === index ? "visible" : "hidden"}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <div className="flex flex-col items-center gap-0.5 px-4 py-3 text-center">
                    {image.title && (
                      <p className="text-sm font-semibold tracking-wide text-white drop-shadow-md">
                        {image.title}
                      </p>
                    )}
                    {image.location && (
                      <span className="text-[11px] text-white/80 tracking-wider uppercase">
                        {image.location}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MasonryGallery;
