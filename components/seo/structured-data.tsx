import React from "react";

interface JobPostingSchemaProps {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  postedDate?: string;
  deadline?: string;
  type?: string;
}

export function JobPostingSchema({
  title,
  description,
  company,
  location,
  postedDate,
  deadline,
  type,
}: JobPostingSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title,
    description,
    hiringOrganization: {
      "@type": "Organization",
      name: company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location.split(",")[0]?.trim() || location,
        addressCountry: "BD",
      },
    },
    datePosted: postedDate || "2026-08-01",
    validThrough: deadline || "2026-09-01",
    employmentType: type?.includes("MTO") ? "FULL_TIME" : "FULL_TIME",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

export function OrganizationSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "INSYT Corporate",
    url: "https://insyt.co",
    logo: "https://insyt.co/logo.png",
    description: "The premier Career Operating System & Corporate Placements platform in Bangladesh.",
    sameAs: [
      "https://facebook.com/insytcorporate",
      "https://linkedin.com/company/insytcorporate",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
