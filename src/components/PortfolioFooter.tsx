const PortfolioFooter = () => {
  return (
    <footer className="max-w-[1600px] mx-auto px-3 md:px-5 pb-16">
      <div className="text-center text-[10px] uppercase tracking-widest font-inter text-muted-foreground">
        <a
          href="mailto:www.bhaveshandcars@gmail.com"
          className="hover:text-foreground transition-colors"
        >
          E: www.bhaveshandcars@gmail.com
        </a>
        <span className="mx-2">/</span>
        <a
          href="https://pin.it/42bhdp2gA"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Pinterest
        </a>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
