'use client';
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

export function DropzoneButton({ setSelFiles, selFiles }) {
  const inputRef = useRef();

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        toast.loading('Uploading image...');
        try {
          const res = await fetch(url, {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (data.secure_url) {
            setSelFiles(prev => [...prev, data.secure_url]);
            toast.dismiss();
            toast.success('Image uploaded!');
          } else {
            toast.dismiss();
            toast.error('Upload failed');
          }
        } catch (err) {
          toast.dismiss();
          toast.error('Upload error');
        }
      }
    }
  };

  const handleRemove = (url) => {
    setSelFiles(prev => prev.filter(img => img !== url));
  };

  return (
    <Card className="mb-4">
      <CardContent className="flex flex-col items-center gap-2 py-4">
        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          multiple
        />
        <Button type="button" onClick={() => inputRef.current && inputRef.current.click()}>
          Select Images
        </Button>
        {selFiles && selFiles.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-2 justify-center">
            {selFiles.map((url, idx) => (
              <div key={url} className="relative">
                <img src={url} alt={`Preview ${idx + 1}`} className="max-h-32 rounded shadow" />
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:bg-opacity-100"
                  aria-label="Remove image"
                >
                  &#10005;
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}