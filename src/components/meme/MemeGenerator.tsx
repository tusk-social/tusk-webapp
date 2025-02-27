"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

interface MemeGeneratorProps {
  onMemeGenerated: (imageUrl: string) => void;
}

export default function MemeGenerator({ onMemeGenerated }: MemeGeneratorProps) {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(
    null,
  );
  const [captions, setCaptions] = useState<string[]>([]);
  const [generatingMeme, setGeneratingMeme] = useState(false);

  // Fetch meme templates on component mount
  useEffect(() => {
    async function fetchMemeTemplates() {
      try {
        setLoading(true);
        // Use our new API route instead of directly calling imgflip
        const response = await fetch("/api/meme/templates");
        const data = await response.json();

        if (data.success) {
          setTemplates(data.data.memes);
        } else {
          setError(data.error || "Failed to fetch meme templates");
        }
      } catch (err) {
        setError("Error connecting to meme API");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMemeTemplates();
  }, []);

  // Filter templates based on search query
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle template selection
  const handleSelectTemplate = (template: MemeTemplate) => {
    setSelectedTemplate(template);
    // Initialize captions array with empty strings based on box_count
    setCaptions(Array(template.box_count).fill(""));
  };

  // Handle caption change
  const handleCaptionChange = (index: number, value: string) => {
    const newCaptions = [...captions];
    newCaptions[index] = value;
    setCaptions(newCaptions);
  };

  // Generate meme
  const handleGenerateMeme = async () => {
    if (!selectedTemplate) return;

    try {
      setGeneratingMeme(true);

      // Use our new API route instead of directly calling imgflip
      const response = await fetch("/api/meme/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_id: selectedTemplate.id,
          captions: captions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Pass the generated meme URL to the parent component
        onMemeGenerated(data.data.url);
      } else {
        setError(data.error || "Failed to generate meme");
      }
    } catch (err) {
      setError("Error generating meme");
      console.error(err);
    } finally {
      setGeneratingMeme(false);
    }
  };

  // Back to template selection
  const handleBack = () => {
    setSelectedTemplate(null);
    setCaptions([]);
  };

  return (
    <div className="w-full">
      {error && (
        <div className="p-3 mb-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {!selectedTemplate ? (
        // Template selection view
        <>
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <div className="relative rounded-xl bg-gray-800/50 flex items-center overflow-hidden">
              <input
                type="text"
                placeholder="Search meme templates..."
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none p-3 pl-10 text-gray-100 placeholder-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="cursor-pointer rounded-lg overflow-hidden border border-gray-800 hover:border-brand transition-colors"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={template.url}
                      alt={template.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-2 text-sm truncate text-center bg-gray-800/50">
                    {template.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // Caption input view
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to templates
            </button>
            <h3 className="text-lg font-medium">{selectedTemplate.name}</h3>
          </div>

          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-xs">
              <Image
                src={selectedTemplate.url}
                alt={selectedTemplate.name}
                width={selectedTemplate.width}
                height={selectedTemplate.height}
                className="object-contain max-h-64 mx-auto"
              />
            </div>
          </div>

          <div className="space-y-3">
            {captions.map((caption, index) => (
              <div key={index}>
                <label className="block text-sm text-gray-400 mb-1">
                  {index === 0
                    ? "Top text"
                    : index === 1
                      ? "Bottom text"
                      : `Text box ${index + 1}`}
                </label>
                <div className="relative rounded-xl bg-gray-800/50 flex items-center">
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    placeholder={`Enter text for box ${index + 1}`}
                    className="w-full bg-transparent border-none focus:ring-0 p-3 text-gray-100 placeholder-gray-600"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerateMeme}
            disabled={generatingMeme}
            className="w-full bg-brand hover:bg-brand/90 text-white px-4 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:translate-y-0.5"
          >
            {generatingMeme ? "Generating..." : "Generate Meme"}
          </button>
        </div>
      )}
    </div>
  );
}
