import React from 'react';

const About = () => {
  return (
    <section className="min-h-screen bg-base-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-5xl w-full space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">About CySecPlan</h1>
          <p className="text-base-content opacity-80 max-w-3xl mx-auto">
            CySecPlan is an initiative focused on empowering organizations and
            individuals through cybersecurity awareness, workshops, and
            strategic planning. Designed to support national digital resilience,
            we bridge the knowledge gap between security theory and practical
            implementation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-secondary">
              Our Mission
            </h2>
            <p className="text-base-content opacity-80">
              To cultivate a secure and digitally aware community by delivering
              accessible cybersecurity education and hands-on learning
              opportunities. We strive to promote vigilance, compliance, and
              secure practices at all levels of digital engagement.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-secondary">
              Our Vision
            </h2>
            <p className="text-base-content opacity-80">
              To become a nationally recognized platform that accelerates cyber
              readiness and defense capabilities by aligning with national
              security objectives, industry best practices, and cutting-edge
              innovations.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-secondary">
            Why CySecPlan
          </h2>
          <p className="text-base-content opacity-80">
            At CySecPlan, we go beyond awareness. Our structured programs are
            tailored for professionals, students, and institutions
            alike—providing exposure to real-world vulnerabilities, secure
            development methodologies, and compliance standards. Backed by
            cybersecurity experts and supported by CERT-IN, we ensure that every
            engagement is meaningful, measurable, and mission-driven.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
