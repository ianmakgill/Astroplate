import React, { useEffect, useState } from "react";

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: Heading[];
}

const TableOfContents: React.FC<Props> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    const headingElements = headings.map((heading) =>
      document.getElementById(heading.slug)
    );

    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      const offset = 100; // Offset for sticky header if you have one
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="toc">
      <h3 className="mb-4 text-lg font-bold">Table of Contents</h3>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.slug}
              className={`${
                heading.depth === 3 ? "ml-6 border-l-2 border-border dark:border-darkmode-border pl-3" : ""
              }`}
            >
              <a
                href={`#${heading.slug}`}
                onClick={(e) => handleClick(e, heading.slug)}
                className={`block hover:text-primary dark:hover:text-darkmode-primary transition-colors ${
                  heading.depth === 2
                    ? "text-base font-medium"
                    : "text-sm"
                } ${
                  activeId === heading.slug
                    ? "text-primary dark:text-darkmode-primary font-semibold"
                    : "text-text-light dark:text-darkmode-text-light"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TableOfContents;
