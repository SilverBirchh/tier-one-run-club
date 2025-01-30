import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import type { TextData } from "./types";
import { useLayoutEffect } from "react";
import type { ParsedGPX } from "@we-gold/gpxjs";

export const defaultText: TextData = {
  title: "Morning Run",
  date: "Tuesday, October 29, 2024",
  description: "Running Route",
};

export type TextProps = {
  setText: React.Dispatch<React.SetStateAction<TextData>>;
  text: TextData;
  gpx: ParsedGPX;
  layout: string
};

export const Info = ({ setText, text, gpx, layout }: TextProps) => {
  useLayoutEffect(() => {
    const date = gpx.metadata.time ? new Date(gpx.metadata.time) : new Date();

    setText((prevText) => ({
      title: gpx.metadata.name || prevText.title,
      description: gpx.metadata.description || prevText.description,
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }));
  }, [gpx]);

  const handleChange = (key: keyof TextData, value: string) => {
    setText((prevText) => ({
      ...prevText,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter title..."
          onChange={(e) => handleChange("title", e.target.value)}
          value={text.title}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Date</Label>
        <Input
          id="date"
          placeholder="Enter date..."
          onChange={(e) => handleChange("date", e.target.value)}
          value={text.date}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter description..."
          className="min-h-[100px]"
          value={text.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      {layout === "instruction-focused" && <div className="space-y-2">
        <Label htmlFor="description">Instructions</Label>
        <Textarea
          id="description"
          placeholder="Enter instructions..."
          className="min-h-[100px]"
          value={text.instructions}
          onChange={(e) => handleChange("instructions", e.target.value)}
        />
      </div>}
    </div>
  );
};
