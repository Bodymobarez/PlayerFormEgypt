import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image, Loader2 } from "lucide-react";

interface ObjectUploaderProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  buttonClassName?: string;
}

export function ObjectUploader({
  onUploadComplete,
  currentImage,
  buttonClassName,
}: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار صورة فقط');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5 ميجا');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('فشل رفع الصورة');
      }

      const data = await response.json();
      onUploadComplete(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('حدث خطأ أثناء رفع الصورة');
      setPreviewUrl(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-12 h-12 object-contain rounded-lg bg-gray-700/50 p-1"
          onError={() => setPreviewUrl(null)}
        />
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={buttonClassName || "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            جاري الرفع...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 ml-2" />
            رفع لوجو
          </>
        )}
      </Button>
    </div>
  );
}
