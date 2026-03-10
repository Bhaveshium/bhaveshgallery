import { Link } from "react-router-dom";

const PortfolioFooter = () => {
  return (
    <footer className="max-w-[1600px] mx-auto px-3 md:px-5 pb-16">
      <div className="text-center text-[10px] uppercase tracking-widest font-inter text-muted-foreground flex items-center justify-center gap-4">
        <a
          href="https://pin.it/42bhdp2gA"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Pinterest
        </a>
        <span className="text-muted-foreground/30">·</span>
        <Link to="/admin/login" className="hover:text-foreground transition-colors">
          Admin
        </Link>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
