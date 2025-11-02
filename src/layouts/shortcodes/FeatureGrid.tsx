import React from "react";

interface FeatureItem {
  title: string;
  content: string;
  icon?: string;
}

const FeatureGrid = ({
  heading,
  items,
}: {
  heading?: string;
  items: FeatureItem[];
}) => {
  return (
    <section className="section">
      <div className="container">
        {heading && (
          <div className="row">
            <div className="mx-auto mb-12 text-center md:col-10 lg:col-7">
              <h2 className="mb-4">{heading}</h2>
            </div>
          </div>
        )}
        <div className="row gy-4">
          {items.map((item, index) => (
            <div key={index} className="md:col-6 lg:col-4">
              <div className="feature-card rounded-lg border border-border p-8 dark:border-darkmode-border h-full">
                {item.icon && (
                  <div className="mb-4 text-4xl text-primary dark:text-darkmode-primary">
                    {item.icon}
                  </div>
                )}
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="text-text-light dark:text-darkmode-text-light">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
