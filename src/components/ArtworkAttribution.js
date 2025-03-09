"use client";

import React from "react";

const ArtworkAttribution = ({
  artist,
  title,
  year,
  source,
  licence,
  licenceUrl,
  licenceNote,
}) => {
  return (
    <div className="mt-4 text-sm text-gray-600">
      <p>
        {title} - artwork by <strong>{artist}</strong> ({year})
        {source && (
          <>
            , sourced from{" "}
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {source}
            </a>
          </>
        )}
      </p>
      {licence && (
        <p>
          Licensed under{" "}
          {licenceUrl ? (
            <a
              href={licenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {licence}
            </a>
          ) : (
            licence
          )}
          {licenceNote && (
            <span className="text-sm text-gray-500 ml-2">({licenceNote})</span>
          )}
        </p>
      )}
    </div>
  );
};

export default ArtworkAttribution;
