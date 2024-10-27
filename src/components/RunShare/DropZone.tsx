import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { useDropzone } from "react-dropzone-esm";
import clsx from "clsx";
import { ParsedGPX, parseGPX } from "@we-gold/gpxjs";
import { File } from "../icons/file";

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const content = event.target?.result as string;
        resolve(content);
      };
  
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
  
      reader.readAsText(file);
    });
  };

type DropZone = {
    setGpx: (gpx: ParsedGPX) => void
}

export const DropZone = ({ setGpx }: DropZone) => {
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        try {
          const content = await readFileAsText(acceptedFiles[0]);
          const [parsedFile, error] = parseGPX(content);
          if (error) throw error;
          setGpx(parsedFile);
        } catch (err) {
          console.log(err);
          setError("Failed to read file");
        }
      }
    }, []);
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        "application/gpx+xml": [".gpx"],
      },
      maxFiles: 1,
      multiple: false,
    });
  
    return (
        <div
          {...getRootProps()}
          className={clsx(
            isDragActive ? "border-primary" : "border-gray-500",
            "w-full h-96 gap-2 flex justify-center flex-col items-center border-2 rounded-lg border-dashed bg-gray-100 col-start-2 full-bleed max-w-[1200px]"
          )}
        >
          <input {...getInputProps()} />
          <Button className="flex gap-3">
            <File />
            <span>Upload File</span>
          </Button>
          <p className="text-xs text-gray-600 text-center p-5">
            To get started drop a .gpx here or click to upload!
          </p>
          {error && (
            <p className="text-xs text-red-500">
              Failed to read .gpx file. Please try again.
            </p>
          )}
        </div>
      );
}