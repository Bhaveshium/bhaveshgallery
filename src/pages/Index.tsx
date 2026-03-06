import { useState, useEffect } from "react";
import PortfolioHeader from "@/components/PortfolioHeader";
import PhotographerBio from "@/components/PhotographerBio";
import PortfolioFooter from "@/components/PortfolioFooter";
import MasonryGallery from "@/components/MasonryGallery";
import Lightbox from "@/components/Lightbox";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

// Fallback images (the uploaded ones)
import fallback1 from "@/assets/gallery/bhavesh-1.png";
import fallback2 from "@/assets/gallery/bhavesh-2.png";

const fallbackImages = [
  { src: fallback1, alt: "Portrait in spotlight", photographer: "Bhavesh Chaudhari", client: "", location: "", details: "", width: 800, height: 1000 },
  { src: fallback2, alt: "Motorcycle portrait", photographer: "Bhavesh Chaudhari", client: "", location: "", details: "", width: 1024, height: 1024 },
];

const Index = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [displayImages, setDisplayImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("media")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setDisplayImages(data.map((item: any) => ({
            src: item.file_url,
            alt: item.title || "Photography",
            photographer: item.photographer || "Bhavesh Chaudhari",
            client: item.client || "",
            location: item.location || "",
            details: item.details || "",
            width: item.width || 800,
            height: item.height || 600,
          })));
        } else {
          // Use fallback images when DB is empty
          setDisplayImages(fallbackImages);
        }
      } catch (err) {
        console.error("Error fetching media:", err);
        setDisplayImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, []);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Bhavesh Chaudhari",
    "jobTitle": "Photographer",
    "description": "Photographer blending data-driven creativity with visual storytelling.",
    "url": "https://bhaveshchaudhari.com",
    "sameAs": ["https://pin.it/42bhdp2gA"],
    "knowsAbout": ["Photography", "Data Analytics", "Portrait Photography", "Fashion Photography"],
  };

  return (
    <>
      <SEO
        title="Bhavesh Chaudhari - Data & Photography"
        description="Photographer blending data-driven creativity with visual storytelling. Capturing compelling imagery through light, composition, and emotion."
        canonicalUrl="/"
        ogType="profile"
        jsonLd={jsonLd}
      />
      <PortfolioHeader activeCategory="SELECTED" />
      <main>
        <PhotographerBio />
        {!loading && displayImages.length > 0 && (
          <MasonryGallery images={displayImages} onImageClick={handleImageClick} />
        )}
        {!loading && displayImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No images found.</p>
          </div>
        )}
      </main>
      {lightboxOpen && displayImages.length > 0 && (
        <Lightbox images={displayImages} initialIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}
      <PortfolioFooter />
    </>
  );
};

export default Index;
