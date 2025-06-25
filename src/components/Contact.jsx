import React from 'react';

const Contact = () => {
  return (
    <section className="min-h-screen bg-base-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl p-8 md:p-12 rounded-2xl shadow-lg bg-base-200 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Get in Touch
          </h2>
          <p className="text-base-content opacity-70">
            We’d love to hear from you. Fill out the form or reach out via
            email.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            location.reload();
          }}
          className="space-y-6"
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Name</span>
            </label>
            <input
              type="text"
              placeholder="Jane Doe"
              className="input input-bordered mx-6 input-primary"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email Address</span>
            </label>
            <input
              type="email"
              placeholder="jane@example.com"
              className="input mx-1 input-bordered input-primary"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Message</span>
            </label>
            <textarea
              className="textarea textarea-bordered textarea-primary mx-1 h-32"
              placeholder="How can we help you?"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Send Message
          </button>
        </form>

        <div className="divider text-base-content">or contact us directly</div>

        <div className="text-center space-y-1 text-base-content">
          <p>
            <span className="font-semibold">Email:</span>{' '}
            <a
              href="mailto:contact@cysecplan.in"
              className="link link-hover text-primary"
            >
              contact@cysecplan.in
            </a>
          </p>
          <p>
            <span className="font-semibold">Phone:</span> +91 1800 XXXX XXX
          </p>
          <p>
            <span className="font-semibold">Address:</span> CYSEC HQ, New Delhi,
            India
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
