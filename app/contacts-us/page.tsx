"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { gsap } from 'gsap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  const validate = () => {
    let newErrors: { email?: string; message?: string } = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message) {
      newErrors.message = "Message is required";
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach(err => toast.error(err));
      return;
    }
    
    // Simulate API call
    toast.success("Message sent successfully!");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-us-page-wrapper">
      <Navbar />
      <ToastContainer position="bottom-right" theme="dark" />

      <section className="contact" id="contact">
        <div className="container">
          <div className="heading text-center">
            <h2>Get In <span>Touch</span></h2>
            <p>Connecting brands with purpose. Reach out to us for collaborations,<br />corporate inquiries, or to learn more about our house of brands.</p>
          </div>
          <div className="row">
            <div className="col-md-5">
              <div className="title">
                <h3>Contact Details</h3>
                <p>Our team is dedicated to providing swift and comprehensive assistance to all our partners and customers.</p>
              </div>
              <div className="content">
                <div className="info">
                  <i className="fas fa-mobile-alt"></i>
                  <h4 className="d-inline-block">PHONE :<br />
                    <span>8886669630</span></h4>
                </div>
                <div className="info">
                  <i className="far fa-envelope"></i>
                  <h4 className="d-inline-block">EMAIL :<br />
                    <span>info@nyoraa.com</span></h4>
                </div>
                <div className="info">
                  <i className="fas fa-map-marker-alt"></i>
                  <h4 className="d-inline-block">ADDRESS :<br />
                    <span>Nyoraa Consumers Pvt Ltd.<br />Hyderabad, Telangana, India</span></h4>
                </div>
              </div>
            </div>

            <div className="col-md-7">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-6">
                    <input 
                      type="text" 
                      name="name"
                      className="form-control" 
                      placeholder="Name" 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <input 
                      type="email" 
                      name="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                      placeholder="Email" 
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-12">
                    <input 
                      type="text" 
                      name="subject"
                      className="form-control" 
                      placeholder="Subject" 
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <textarea 
                    name="message"
                    className={`form-control ${errors.message ? 'is-invalid' : ''}`} 
                    rows={5} 
                    id="comment" 
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button className="btn btn-block" type="submit">Send Now!</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .form-control {
          color: #000 !important;
        }
        .form-control::placeholder {
          color: #888;
        }
        .is-invalid {
          border-color: #dc3545 !important;
        }
      `}</style>
      <Footer />
    </div>
  );
}
