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
  { src: fallback1, alt: "Portrait in spotlight", photographer: "Bhavesh Chaudhari", location: "", details: "", width: 800, height: 1000 },
  { src: fallback2, alt: "Motorcycle portrait", photographer: "Bhavesh Chaudhari", location: "", details: "", width: 1024, height: 1024 },
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
            title: item.title || "",
            photographer: item.photographer || "Bhavesh Chaudhari",
            location: item.location || "",
            details: item.details || "",
            description: item.description || "",
            category: item.category || "",
            photo_type: item.photo_type || "",
            date_taken: item.date_taken || null,
            tags: item.tags || [],
            width: item.width || 800,
            height: item.height || 600,
          })));
        } else {
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
    "description": "Photographer capturing life through light, composition, and emotion.",
    "url": "https://bhaveshchaudhari.com",
    "sameAs": ["https://pin.it/42bhdp2gA"],
    "knowsAbout": ["Photography", "Portrait Photography", "Fashion Photography", "Visual Storytelling"],
  };

  return (
    <>
      <SEO
        title="Bhavesh Chaudhari - Photography"
        description="Photographer capturing life through light, composition, and emotion. A lifelong pursuit of seeing the unseen."
        canonicalUrl="/"
        ogType="profile"
        jsonLd={jsonLd}
      />
      <PortfolioHeader activeCategory="" />
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
