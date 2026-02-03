import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { createContact } from "../api/contact";

const ContactForm = () => {
  const location = useLocation();
  const isFaqPage = location.pathname === "/faq";

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      const { showError } = await import("../Utils/toast");
      showError("Please provide your name and message.");
      return;
    }

    try {
      setLoading(true);
      await createContact(form);
      {
        const { showSuccess } = await import("../Utils/toast");
        showSuccess("Message sent successfully!");
      }
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to send message.";
      {
        const { showError } = await import("../Utils/toast");
        showError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className={`grid ${isFaqPage ? "sm:grid-cols-2" : ""} gap-4`}>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          type="text"
          placeholder="Name..."
          className="border border-[#ddd] px-3 py-1.5 w-full focus:outline-none focus:border-primary"
        />
        <input
          name="email"
          value={form.email}
          onChange={onChange}
          type="email"
          placeholder="Email..."
          className="border border-[#ddd] px-3 py-1.5 w-full focus:outline-none focus:border-primary"
        />
      </div>

      <div className={`grid ${isFaqPage ? "sm:grid-cols-2" : ""} gap-4`}>
        <input
          name="phone"
          value={form.phone}
          onChange={onChange}
          type="text"
          placeholder="Phone..."
          className="border border-[#ddd] px-3 py-1.5 w-full focus:outline-none focus:border-primary"
        />
        <input
          name="subject"
          value={form.subject}
          onChange={onChange}
          type="text"
          placeholder="Subject..."
          className="border border-[#ddd] px-3 py-1.5 w-full focus:outline-none focus:border-primary"
        />
      </div>

      <textarea
        name="message"
        value={form.message}
        onChange={onChange}
        placeholder="Message..."
        rows="6"
        className="border border-[#ddd] px-3 py-1.5 w-full focus:outline-none focus:border-primary"
      />

      <button
        type="submit"
        disabled={loading}
        className={`bg-primary text-white ${isFaqPage ? "px-5" : "px-8"} py-3 rounded-full hover:bg-transparent hover:text-primary transition border-1 border-primary cursor-pointer disabled:opacity-60`}
      >
        {loading ? "Sending..." : "Submit"}
      </button>
    </form>
  );
};

export default ContactForm;
