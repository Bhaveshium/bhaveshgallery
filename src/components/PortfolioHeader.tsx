import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import FocusTrap from "focus-trap-react";
import { TextRoll } from "@/components/ui/text-roll";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CATEGORIES, categoryToSlug } from "@/lib/categories";

interface PortfolioHeaderProps {
  activeCategory: string;
}

const categories = CATEGORIES;

const PortfolioHeader = ({ activeCategory }: PortfolioHeaderProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background">
      <div className="relative max-w-[1600px] mx-auto px-3 md:px-5 py-3">
        {/* Desktop theme toggle */}
        <div className="hidden md:flex absolute top-3 right-5 z-10 items-center">
          <ThemeToggle />
        </div>

        {/* Row 1: Name + Mobile menu button (mobile) | Name + About (desktop) */}
        <div className="flex items-center justify-between md:justify-center md:gap-8">
          <Link
            to="/"
            className="text-[10px] md:text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-inter whitespace-nowrap"
            onMouseEnter={() => setHoveredItem('name')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {hoveredItem === 'name' ? (
              <TextRoll duration={0.3} getEnterDelay={(i) => i * 0.02} getExitDelay={(i) => i * 0.02}>
                BHAVESH CHAUDHARI
              </TextRoll>
            ) : (
              "BHAVESH CHAUDHARI"
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={20} />
          </button>

          {/* Desktop About link (row 1) */}
          <Link
            to="/about"
            className="hidden md:inline-block text-[10px] md:text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-inter whitespace-nowrap"
            onMouseEnter={() => setHoveredItem('about')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {hoveredItem === 'about' ? (
              <TextRoll duration={0.3} getEnterDelay={(i) => i * 0.02} getExitDelay={(i) => i * 0.02}>
                ABOUT
              </TextRoll>
            ) : (
              "ABOUT"
            )}
          </Link>
        </div>

        {/* Row 2: Desktop categories */}
        <div className="hidden md:flex items-center justify-center flex-wrap gap-x-5 gap-y-2 mt-2">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${categoryToSlug(category)}`}
              onMouseEnter={() => setHoveredItem(category)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`text-[10px] md:text-[11px] uppercase tracking-widest font-inter transition-colors whitespace-nowrap ${
                activeCategory === category
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              {hoveredItem === category ? (
                <TextRoll duration={0.3} getEnterDelay={(i) => i * 0.02} getExitDelay={(i) => i * 0.02}>
                  {category}
                </TextRoll>
              ) : (
                category
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <FocusTrap>
            <div
              className="fixed inset-0 bg-background z-50 md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              {/* Close Button */}
              <div className="flex justify-end p-5">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col items-center justify-center gap-8 px-8 pt-12">
                {/* Categories */}
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/category/${categoryToSlug(category)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg uppercase tracking-widest font-inter transition-colors ${
                      activeCategory === category
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {category}
                  </Link>
                ))}

                {/* Separator */}
                <div className="w-16 h-px bg-border"></div>

                {/* Page Links */}
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-inter"
                >
                  ABOUT
                </Link>

                {/* Theme toggle */}
                <div className="pt-4">
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          </FocusTrap>
        )}
      </div>
    </header>
  );
};

export default PortfolioHeader;
