import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import PortfolioHeader from "@/components/PortfolioHeader";
import PhotographerBio from "@/components/PhotographerBio";
import PortfolioFooter from "@/components/PortfolioFooter";
import MasonryGallery from "@/components/MasonryGallery";
import Lightbox from "@/components/Lightbox";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

const validCategories = ['selected', 'commissioned', 'editorial', 'personal', 'all'];

const CategoryGallery = () => {
  const { category } = useParams<{ category: string }>();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isValid = category && validCategories.includes(category.toLowerCase());
  const categoryUpper = category?.toUpperCase() || "";

  useEffect(() => {
    if (!isValid) return;
    const loadImages = async () => {
      try {
        setLoading(true);
        let query = supabase.from("media").select("*").order("sort_order", { ascending: true });
        if (categoryUpper !== "ALL") {
          query = query.eq("category", categoryUpper);
        }
        const { data, error } = await query;
        if (error) throw error;
        setImages((data || []).map((item: any) => ({
          src: item.file_url,
          alt: item.title || "Photography",
          photographer: item.photographer || "Bhavesh Chaudhari",
          client: item.client || "",
          location: item.location || "",
          details: item.details || "",
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
  }, [categoryUpper, isValid]);

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const getCategoryTitle = (cat: string) => {
    const titles: Record<string, string> = {
      selected: "Selected Works", commissioned: "Commissioned Projects",
      editorial: "Editorial Photography", personal: "Personal Projects", all: "All Photography",
    };
    return titles[cat] || "Gallery";
  };

  return (
    <>
      <SEO
        title={`${getCategoryTitle(category!)} - Bhavesh Chaudhari`}
        description={`${getCategoryTitle(category!)} by Bhavesh Chaudhari`}
        canonicalUrl={`/category/${category}`}
      />
      <PortfolioHeader activeCategory={categoryUpper} />
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
