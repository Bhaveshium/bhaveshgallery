import { useState, useEffect, useRef } from "react";

interface LightboxImage {
  src: string;
  alt: string;
  title?: string;
  photographer?: string;
  location?: string;
  details?: string;
  description?: string;
  category?: string;
  photo_type?: string;
  date_taken?: string | null;
  tags?: string[];
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

const Lightbox = ({ images, initialIndex, onClose }: LightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleNext = () => {
    if (currentIndex < images.length - 1) setCurrentIndex((p) => p + 1);
  };
  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((p) => p - 1);
  };

  const currentImage = images[currentIndex];
  const formattedDate = currentImage.date_taken
    ? new Date(currentImage.date_taken).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-background z-[100] overflow-y-auto animate-fade-in"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[200] text-foreground/60 hover:text-foreground transition-opacity text-xs uppercase tracking-widest font-inter"
        aria-label="Close lightbox"
      >
        Close ×
      </button>

      {/* Page Indicator */}
      <div className="fixed top-6 left-6 z-[200] text-foreground/60 text-xs font-inter tracking-widest uppercase">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Nav arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-[200] text-foreground/40 hover:text-foreground transition-opacity text-2xl"
          aria-label="Previous image"
        >
          ←
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={handleNext}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-[200] text-foreground/40 hover:text-foreground transition-opacity text-2xl"
          aria-label="Next image"
        >
          →
        </button>
      )}

      <div className="min-h-screen flex flex-col items-center justify-start py-20 px-4 md:px-12">
        {/* Image */}
        <div className="w-full flex items-center justify-center">
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>

        {/* Metadata below the photo */}
        <div className="w-full max-w-2xl mt-10 mb-12 text-foreground">
          {currentImage.title && (
            <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
              {currentImage.title}
            </h2>
          )}

          {currentImage.description && (
            <p className="text-base text-foreground/80 leading-relaxed mb-6 font-inter">
              {currentImage.description}
            </p>
          )}

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs font-inter border-t border-border pt-6">
            {currentImage.category && (
              <div>
                <dt className="uppercase tracking-widest text-muted-foreground mb-1">Category</dt>
                <dd className="text-foreground">{currentImage.category}</dd>
              </div>
            )}
            {currentImage.photo_type && (
              <div>
                <dt className="uppercase tracking-widest text-muted-foreground mb-1">Type</dt>
                <dd className="text-foreground">{currentImage.photo_type}</dd>
              </div>
            )}
            {currentImage.location && (
              <div>
                <dt className="uppercase tracking-widest text-muted-foreground mb-1">Location</dt>
                <dd className="text-foreground">{currentImage.location}</dd>
              </div>
            )}
            {formattedDate && (
              <div>
                <dt className="uppercase tracking-widest text-muted-foreground mb-1">Date</dt>
                <dd className="text-foreground">{formattedDate}</dd>
              </div>
            )}
            {currentImage.photographer && (
              <div>
                <dt className="uppercase tracking-widest text-muted-foreground mb-1">Photographer</dt>
                <dd className="text-foreground">{currentImage.photographer}</dd>
              </div>
            )}
          </dl>

          {currentImage.tags && currentImage.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {currentImage.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest font-inter px-2 py-1 border border-border text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
