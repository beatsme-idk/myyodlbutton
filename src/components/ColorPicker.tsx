
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

const ColorPicker = ({ color, onChange, className = "" }: ColorPickerProps) => {
  const [pickerColor, setPickerColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPickerColor(color);
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setPickerColor(newColor);
    onChange(newColor);
  };

  const presetColors = [
    "#1E40AF", // Blue
    "#047857", // Green
    "#7C3AED", // Purple
    "#DC2626", // Red
    "#D97706", // Amber
    "#374151", // Gray
    "#000000", // Black
    "#FFFFFF", // White
  ];

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <div 
              className="w-10 h-10 rounded-md shadow-sm border border-slate-700" 
              style={{ backgroundColor: color }}
              onClick={() => setIsOpen(true)}
            />
            <Input
              type="text"
              value={color}
              onChange={handleColorChange}
              className="w-28 font-mono text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-3">
            <input
              ref={inputRef}
              type="color"
              value={pickerColor}
              onChange={handleColorChange}
              className="w-full h-8 cursor-pointer"
            />
            
            <div className="grid grid-cols-4 gap-2 mt-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  className="w-full h-8 rounded border border-slate-700 transition-transform hover:scale-110"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    onChange(presetColor);
                    setPickerColor(presetColor);
                  }}
                  aria-label={`Select color ${presetColor}`}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
