import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { createContact } from "../api/contact";

const ContactForm = () => {
  const location = useLocation();
  const isFaqPage = location.pathname === "/faq";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  /* -------------------- INPUT CHANGE -------------------- */
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* -------------------- VALIDATION -------------------- */
  const validateForm = async () => {
    const { showError } = await import("../Utils/toast");

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!fullName) {
      showError("Full name is required");
      return false;
    }

    if (fullName.length < 3) {
      showError("Full name must be at least 3 characters");
      return false;
    }

    if (!email) {
      showError("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Enter a valid email address");
      return false;
    }

    if (!phone) {
      showError("Phone number is required");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      showError("Enter a valid 10-digit mobile number");
      return false;
    }

    if (!subject) {
      showError("Subject is required");
      return false;
    }

    if (subject.length < 3) {
      showError("Subject must be at least 3 characters");
      return false;
    }

    if (!message) {
      showError("Message is required");
      return false;
    }

    if (message.length < 10) {
      showError("Message must be at least 10 characters");
      return false;
    }

    return true; // ✅ VERY IMPORTANT
  };

  /* -------------------- SUBMIT -------------------- */
  const onSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return; 

    try {
      setLoading(true);

      await createContact({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      const { showSuccess } = await import("../Utils/toast");
      showSuccess("Message sent successfully!");

      setForm({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      const { showError } = await import("../Utils/toast");
      showError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send message",
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className={`grid ${isFaqPage ? "sm:grid-cols-2" : ""} gap-4`}>
        <input
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          type="text"
          placeholder="Name..."
          className="border border-[#ddd] px-3 py-2 w-full focus:outline-none focus:border-primary"
        />

        <input
          name="email"
          value={form.email}
          onChange={onChange}
          type="email"
          placeholder="Email..."
          className="border border-[#ddd] px-3 py-2 w-full focus:outline-none focus:border-primary"
        />
      </div>

      <div className={`grid ${isFaqPage ? "sm:grid-cols-2" : ""} gap-4`}>
        <input
          name="phone"
          value={form.phone}
          onChange={onChange}
          type="text"
          placeholder="Phone..."
          className="border border-[#ddd] px-3 py-2 w-full focus:outline-none focus:border-primary"
        />

        <input
          name="subject"
          value={form.subject}
          onChange={onChange}
          type="text"
          placeholder="Subject..."
          className="border border-[#ddd] px-3 py-2 w-full focus:outline-none focus:border-primary"
        />
      </div>

      <textarea
        name="message"
        value={form.message}
        onChange={onChange}
        placeholder="Message..."
        rows="6"
        className="border border-[#ddd] px-3 py-2 w-full focus:outline-none focus:border-primary"
      />

      <button
        type="submit"
        disabled={loading}
        className={`bg-primary text-white ${
          isFaqPage ? "px-5" : "px-8"
        } py-3 rounded-full hover:bg-transparent hover:text-primary transition border border-primary disabled:opacity-60`}
      >
        {loading ? "Sending..." : "Submit"}
      </button>
    </form>
  );
};

export default ContactForm;
