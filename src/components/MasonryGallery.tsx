import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  location?: string;
  details?: string;
  description?: string;
  category?: string;
  photo_type?: string;
  date_taken?: string | null;
  tags?: string[];
  width?: number;
  height?: number;
}

interface MasonryGalleryProps {
  images: GalleryItem[];
  onImageClick: (index: number) => void;
}

// Responsive column count
const useColumnCount = () => {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(2);
      else if (w < 1024) setCols(3);
      else if (w < 1536) setCols(4);
      else setCols(5);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return cols;
};

const MasonryGallery = ({ images, onImageClick }: MasonryGalleryProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 0, rotateY: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cols = useColumnCount();

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const handleImageHover = (index: number) => {
    setHoveredIndex(index);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setHoveredIndex(null), 2800);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
      if (hoveredIndex !== index) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ rotateY: x * 17, rotateX: -y * 17 });
    },
    [hoveredIndex]
  );

  const handleImageLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Distribute images into columns based on shortest column (true masonry)
  const columns = useMemo(() => {
    const cols_arr: { item: GalleryItem; index: number }[][] = Array.from({ length: cols }, () => []);
    const heights = new Array(cols).fill(0);
    images.forEach((item, index) => {
      const w = item.width || 800;
      const h = item.height || 600;
      const ratio = h / w; // relative height per unit width
      const shortestCol = heights.indexOf(Math.min(...heights));
      cols_arr[shortestCol].push({ item, index });
      heights[shortestCol] += ratio;
    });
    return cols_arr;
  }, [images, cols]);

  return (
    <div className="max-w-[1600px] mx-auto px-2 md:px-5 pb-16" style={{ perspective: "800px" }}>
      <div className="flex gap-2 md:gap-3">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-2 md:gap-3 min-w-0">
            {col.map(({ item, index }) => {
              const ratio = ((item.height || 600) / (item.width || 800)) * 100;
              return (
                <button
                  key={index}
                  onClick={() => onImageClick(index)}
                  onMouseEnter={() => handleImageHover(index)}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={handleImageLeave}
                  className="relative cursor-zoom-in block w-full overflow-hidden bg-muted/30 group"
                  style={{
                    transform:
                      hoveredIndex === index
                        ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.03)`
                        : "rotateX(0) rotateY(0) scale(1)",
                    transition: "transform 0.15s ease-out",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Aspect ratio spacer to preserve original image proportions */}
                  <div style={{ paddingBottom: `${ratio}%` }} />

                  {item.type === "video" ? (
                    <video
                      poster={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      onLoadedData={() => handleImageLoad(index)}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-400 ${
                        hoveredIndex !== null && hoveredIndex !== index ? "grayscale" : ""
                      }`}
                      style={{
                        opacity: loadedImages.has(index) ? 1 : 0,
                        transition: "opacity 0.5s ease-out",
                      }}
                    >
                      <source src={item.videoSrc} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt}
                      onLoad={() => handleImageLoad(index)}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-400 ${
                        hoveredIndex !== null && hoveredIndex !== index ? "grayscale" : ""
                      }`}
                      style={{
                        opacity: loadedImages.has(index) ? 1 : 0,
                        transition: "opacity 0.5s ease-out",
                      }}
                      loading="lazy"
                    />
                  )}

                  <ProgressiveBlur
                    className="pointer-events-none absolute bottom-0 left-0 h-[40%] w-full"
                    blurIntensity={0.1}
                    animate={hoveredIndex === index ? "visible" : "hidden"}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />

                  {(item.title || item.location) && (
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
                        {item.title && (
                          <p className="text-sm font-semibold tracking-wide text-white drop-shadow-md">
                            {item.title}
                          </p>
                        )}
                        {item.location && (
                          <span className="text-[11px] text-white/80 tracking-wider uppercase">
                            {item.location}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGallery;
