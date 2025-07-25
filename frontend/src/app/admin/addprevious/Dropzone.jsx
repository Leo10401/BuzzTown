import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

export function DropzoneButton({ setSelFilename, selFile }) {
  const inputRef = useRef();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
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
          setSelFilename(data.secure_url);
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
        />
        <Button type="button" onClick={() => inputRef.current && inputRef.current.click()}>
          Select Image
        </Button>
        {selFile && (
          <div className="relative mt-2">
            <img src={selFile} alt="Preview" className="max-h-40 rounded shadow" />
            <button
              type="button"
              onClick={() => setSelFilename('')}
              className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:bg-opacity-100"
              aria-label="Remove image"
            >
              &#10005;
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}