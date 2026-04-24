import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import PortfolioHeader from "@/components/PortfolioHeader";
import PhotographerBio from "@/components/PhotographerBio";
import PortfolioFooter from "@/components/PortfolioFooter";
import MasonryGallery from "@/components/MasonryGallery";
import Lightbox from "@/components/Lightbox";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { slugToCategory } from "@/lib/categories";

const CategoryGallery = () => {
  const { category: slug } = useParams<{ category: string }>();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isAll = slug?.toLowerCase() === "all";
  const matchedCategory = slug ? slugToCategory(slug) : null;
  const isValid = isAll || !!matchedCategory;

  useEffect(() => {
    if (!isValid) return;
    const loadImages = async () => {
      try {
        setLoading(true);
        let query = supabase.from("media").select("*").order("sort_order", { ascending: true });
        if (!isAll && matchedCategory) {
          query = query.eq("category", matchedCategory);
        }
        const { data, error } = await query;
        if (error) throw error;
        setImages((data || []).map((item: any) => ({
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
      } catch (err) {
        console.error("Error fetching media:", err);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, [slug, isValid, isAll, matchedCategory]);

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const title = isAll ? "All Photography" : matchedCategory || "Gallery";

  return (
    <>
      <SEO
        title={`${title} - Bhavesh Chaudhari`}
        description={`${title} by Bhavesh Chaudhari`}
        canonicalUrl={`/category/${slug}`}
      />
      <PortfolioHeader activeCategory={matchedCategory || ""} />
      <main>
        <PhotographerBio />
        {!loading && images.length > 0 && (
          <MasonryGallery images={images} onImageClick={handleImageClick} />
        )}
        {!loading && images.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No images found in this category.</p>
          </div>
        )}
      </main>
      {lightboxOpen && images.length > 0 && (
        <Lightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}
      <PortfolioFooter />
    </>
  );
};

export default CategoryGallery;
