'use client';
import { Formik, FieldArray } from 'formik';
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

const EventSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Event title is required'),
  description: Yup.string().required('Event description is required'),
  location: Yup.string().required('Event location is required'),
  date: Yup.date().required('Event date is required'),
  startTime: Yup.string().required('Event start time is required'),
  category: Yup.string().required('Event category is required'),
  tickets: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.string().required('Ticket type is required'),
        price: Yup.number()
          .positive('Price must be greater than 0')
          .required('Ticket price is required'),
        availability: Yup.number()
          .integer('Availability must be an integer')
          .min(0, 'Availability cannot be negative')
          .required('Ticket availability is required'),
      })
    )
    .required('At least one ticket type is required'),
  discount: Yup.number().min(0, 'Discount cannot be negative').default(0),
  offer: Yup.number().min(0, 'Offer cannot be negative').default(0),
});

function AddProduct() {
  const [selFiles, setSelFiles] = useState([]);
  const handleSubmit = async (values, { resetForm }) => {
    if (!selFiles.length) {
      toast.error('Please select at least one image');
      return;
    } else {
      values.image = selFiles;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/add`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 200) {
        toast.success('Successfully Registered');
        resetForm();
        setSelFiles([]);
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
              startTime: '',
              category: '',
              tickets: [
                {
                  type: '',
                  price: '',
                  availability: '',
                },
              ],
              discount: '',
              offer: '',
            }}
            validationSchema={EventSchema}
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
                  <label className="block mb-1 font-medium">Event Start Time</label>
                  <Input
                    name="startTime"
                    type="time"
                    value={values.startTime}
                    onChange={handleChange}
                    aria-invalid={touched.startTime && errors.startTime ? 'true' : undefined}
                  />
                  {touched.startTime && errors.startTime && (
                    <div className="text-red-500 text-xs mt-1">{errors.startTime}</div>
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
                <FieldArray name="tickets">
                  {({ push, remove }) => (
                    <div>
                      <h4 className="font-semibold mb-2">Tickets</h4>
                      {values.tickets.map((ticket, index) => (
                        <div key={index} className="mb-4 border rounded p-3">
                          <div className="mb-2">
                            <label className="block mb-1 text-sm">Ticket Type</label>
                            <Select
                              name={`tickets[${index}].type`}
                              value={ticket.type}
                              onValueChange={val => setFieldValue(`tickets[${index}].type`, val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select ticket type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Royal">Royal</SelectItem>
                                <SelectItem value="Elite">Elite</SelectItem>
                                <SelectItem value="Common">Common</SelectItem>
                              </SelectContent>
                            </Select>
                            {touched.tickets?.[index]?.type && errors.tickets?.[index]?.type && (
                              <div className="text-red-500 text-xs mt-1">{errors.tickets[index].type}</div>
                            )}
                          </div>
                          <div className="mb-2">
                            <label className="block mb-1 text-sm">Ticket Price</label>
                            <Input
                              name={`tickets[${index}].price`}
                              type="number"
                              placeholder="Enter ticket price"
                              value={ticket.price}
                              onChange={handleChange}
                              aria-invalid={touched.tickets?.[index]?.price && errors.tickets?.[index]?.price ? 'true' : undefined}
                            />
                            {touched.tickets?.[index]?.price && errors.tickets?.[index]?.price && (
                              <div className="text-red-500 text-xs mt-1">{errors.tickets[index].price}</div>
                            )}
                          </div>
                          <div className="mb-2">
                            <label className="block mb-1 text-sm">Ticket Availability</label>
                            <Input
                              name={`tickets[${index}].availability`}
                              type="number"
                              placeholder="Enter ticket availability"
                              value={ticket.availability}
                              onChange={handleChange}
                              aria-invalid={touched.tickets?.[index]?.availability && errors.tickets?.[index]?.availability ? 'true' : undefined}
                            />
                            {touched.tickets?.[index]?.availability && errors.tickets?.[index]?.availability && (
                              <div className="text-red-500 text-xs mt-1">{errors.tickets[index].availability}</div>
                            )}
                          </div>
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => remove(index)}
                              size="sm"
                            >
                              Remove Ticket
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => push({ type: '', price: '', availability: '' })}
                        size="sm"
                        className="mt-2"
                      >
                        Add Ticket
                      </Button>
                    </div>
                  )}
                </FieldArray>
                <div>
                  <label className="block mb-1 font-medium">Discount</label>
                  <Input
                    name="discount"
                    type="number"
                    placeholder="Enter discount"
                    value={values.discount}
                    onChange={handleChange}
                    aria-invalid={touched.discount && errors.discount ? 'true' : undefined}
                  />
                  {touched.discount && errors.discount && (
                    <div className="text-red-500 text-xs mt-1">{errors.discount}</div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Offer</label>
                  <Input
                    name="offer"
                    type="number"
                    placeholder="Enter offer"
                    value={values.offer}
                    onChange={handleChange}
                    aria-invalid={touched.offer && errors.offer ? 'true' : undefined}
                  />
                  {touched.offer && errors.offer && (
                    <div className="text-red-500 text-xs mt-1">{errors.offer}</div>
                  )}
                </div>
                <DropzoneButton setSelFiles={setSelFiles} selFiles={selFiles} />
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