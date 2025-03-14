
import { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { validateHexColor } from '@/utils/validation';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [colorValue, setColorValue] = useState(color || '#000000');
  const [isValid, setIsValid] = useState(true);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setColorValue(color);
  }, [color]);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColorValue(newColor);
    
    if (validateHexColor(newColor)) {
      setIsValid(true);
      onChange(newColor);
    } else {
      setIsValid(false);
    }
  };
  
  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColorValue(newColor);
    
    if (validateHexColor(newColor)) {
      setIsValid(true);
      onChange(newColor);
    } else {
      setIsValid(false);
    }
  };
  
  return (
    <div className="space-y-2" ref={colorPickerRef}>
      <div className="flex items-center space-x-2">
        <div 
          className="h-10 w-10 rounded-md border border-input overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: isValid ? colorValue : '#ffffff' }}
        >
          <input
            type="color"
            value={isValid ? colorValue : '#000000'}
            onChange={handleColorChange}
            className="h-14 w-14 cursor-pointer opacity-0"
          />
        </div>
        <Input
          value={colorValue}
          onChange={handleColorInputChange}
          placeholder="#000000"
          className={`w-full ${!isValid ? 'border-destructive' : ''}`}
        />
      </div>
      {!isValid && (
        <p className="text-xs text-destructive">Please enter a valid hex color code (e.g. #FF0000)</p>
      )}
    </div>
  );
};

export default ColorPicker;
