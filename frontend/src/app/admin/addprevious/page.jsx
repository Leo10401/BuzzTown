'use client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DropzoneButton } from './Dropzone';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';

const LoginSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Event title is required'),
  image: Yup.array()
    .of(Yup.string().url('Invalid URL').required('Image URL is required'))
    .required('At least one image is required'),
  description: Yup.string().required('Event description is required'),
  location: Yup.string().required('Event location is required'),
  date: Yup.date().required('Event date is required'),
  category: Yup.string().required('Event category is required'),
});

function AddProduct() {
  const [selFile, setSelFile] = useState('');
  const handleSubmit = async (values, { resetForm }) => {
    if (!selFile) {
      toast.error('Please select a file');
      return;
    } else {
      values.image = [selFile];
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/previous/add`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 200) {
        toast.success('Successfully Registered');
        resetForm();
      } else {
        toast.error('Error Occurred');
      }
    } catch (err) {
      toast.error('Network Error');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-lg">
        <CardContent className="py-8">
          <Formik
            initialValues={{
              title: '',
              image: [],
              description: '',
              location: '',
              date: '',
              category: '',
            }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Event Title</label>
                  <Input
                    name="title"
                    placeholder="Enter event title"
                    value={values.title}
                    onChange={handleChange}
                    aria-invalid={touched.title && errors.title ? 'true' : undefined}
                  />
                  {touched.title && errors.title && (
                    <div className="text-red-500 text-xs mt-1">{errors.title}</div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Event Description</label>
                  <Textarea
                    name="description"
                    placeholder="Enter event description"
                    value={values.description}
                    onChange={handleChange}
                    aria-invalid={touched.description && errors.description ? 'true' : undefined}
                  />
                  {touched.description && errors.description && (
                    <div className="text-red-500 text-xs mt-1">{errors.description}</div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Event Location</label>
                  <Input
                    name="location"
                    placeholder="Enter event location"
                    value={values.location}
                    onChange={handleChange}
                    aria-invalid={touched.location && errors.location ? 'true' : undefined}
                  />
                  {touched.location && errors.location && (
                    <div className="text-red-500 text-xs mt-1">{errors.location}</div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Event Date</label>
                  <Input
                    name="date"
                    type="date"
                    value={values.date}
                    onChange={handleChange}
                    aria-invalid={touched.date && errors.date ? 'true' : undefined}
                  />
                  {touched.date && errors.date && (
                    <div className="text-red-500 text-xs mt-1">{errors.date}</div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Event Category</label>
                  <Select
                    name="category"
                    value={values.category}
                    onValueChange={val => setFieldValue('category', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                  {touched.category && errors.category && (
                    <div className="text-red-500 text-xs mt-1">{errors.category}</div>
                  )}
                </div>
                <DropzoneButton setSelFilename={setSelFile} selFile={selFile} />
                <div className="flex justify-center pt-4">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddProduct;