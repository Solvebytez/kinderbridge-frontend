"use client";

import { motion } from "framer-motion";
import { Shield, Users, Star, Heart, Globe, Phone, Mail } from "lucide-react";
import Link from "next/link";
import ImagePlaceholder from "../../components/ImagePlaceholder";
import Navigation from "../../components/Navigation";

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "Every KinderBridge location on our platform is thoroughly vetted and verified to ensure the highest standards of safety and quality.",
      color: "bg-blue-500",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "We believe in building strong connections between parents, providers, and communities to support children's growth.",
      color: "bg-green-500",
    },
    {
      icon: Star,
      title: "Excellence",
      description:
        "We partner only with KinderBridge locations that demonstrate exceptional care, education, and commitment to children.",
      color: "bg-yellow-500",
    },
    {
      icon: Heart,
      title: "Child-Centered",
      description:
        "Every decision we make is guided by what's best for children and their families.",
      color: "bg-red-500",
    },
  ];

  const team = [
    {
      name: "Srinisha Chennamaneni",
      role: "Co-Founder",
      bio: "Healthcare professional with 10+ years of experience",
      image: "/girl-1.jpeg",
    },
    {
      name: "Abhishek Rao",
      role: "Co-Founder and COO",
      bio: "Operations expert specializing in scaling family-focused businesses and ensuring quality standards.",
      image: "/abhishekroy.jpeg",
    },
    {
      name: "Ashvak Sheik",
      role: "Head of Product",
      bio: "Product leader passionate about creating intuitive experiences that connect families with quality care.",
      image: "/asvaik.jpeg",
    },
  ];

  const stats = [
    { number: "1500+", label: "KinderBridge Locations", icon: Users },
    { number: "25K+", label: "Happy Families", icon: Heart },
    { number: "10+", label: "Cities Served", icon: Globe },
    { number: "99%", label: "Accuracy", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Navigation Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">About Us</span>
            </div>
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors hover:scale-105 transition-transform"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Back to Home</span>
              </Link>
            </div>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="mb-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 mb-4">
                About KinderBridge
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              We are on a mission to solve the Canadian childcare crisis by
              connecting parents with quality childcare providers.
            </p>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-700 font-medium">
                Ready to serve 10,000+ families
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Every child deserves access to quality early childhood education
                and care. We believe that finding the right KinderBridge
                location should not be overwhelming or stressful for parents.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                KinderBridge was born from a simple idea: what if we could
                create a platform that would make the daycare search process
                transparent, efficient, and trustworthy.
              </p>
              <p className="text-lg text-gray-600">
                Today, we are ready to serve thousands of families across the
                country, helping them make informed decisions about their
                children&apos;s early education journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Building Trust
                </h3>
                <p className="text-gray-600">
                  We verify every KinderBridge location, read through parent
                  reviews, and ensure safety standards are met before listing
                  them on our platform.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do and every decision we
              make.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div
                  className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Numbers that tell the story of our commitment to families and
              childcare providers.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate people behind KinderBridge who are dedicated to
              making a difference in families&apos; lives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4">
                  {member.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder
                      width={96}
                      height={96}
                      type="team"
                      className="w-full h-full rounded-full"
                      alt={`${member.name} - ${member.role}`}
                    />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Our Story
                  </h3>
                  <p className="text-gray-600">
                    Founded in 2020, DayCare Concierge started as a small team
                    of parents and educators who experienced firsthand the
                    challenges of finding quality childcare.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                How It All Started
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Srinisha, our Co-founder, is a student mother. struggling to
                find reliable, quality childcare for her kid. After months of
                research, phone calls, and visits, she realized there had to be
                a better way.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                She teamed up with Abhishek and Ashvak, who shared her vision of
                creating a platform that would make the KinderBridge search
                process transparent, efficient, and trustworthy.
              </p>
              <p className="text-lg text-gray-600">
                Today, we are proud to have created a platform that is ready to
                help thousands of families find their perfect KinderBridge
                match, and we are just getting started.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Find Your Perfect KinderBridge?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of families who have found their ideal childcare
              solution through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/search"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Browse KinderBridge
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">KinderBridge</h3>
              <p className="text-gray-400">
                Connecting parents with trusted KinderBridge locations for a
                brighter future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Parents</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/search"
                    className="hover:text-white transition-colors"
                  >
                    Find KinderBridge
                  </Link>
                </li>
                <li>
                  <Link
                    href="/favorites"
                    className="hover:text-white transition-colors"
                  >
                    My Favorites
                  </Link>
                </li>
                <li>
                  <Link
                    href="/purchase-report"
                    className="hover:text-white transition-colors"
                  >
                    Get Report
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/register"
                    className="hover:text-white transition-colors"
                  >
                    List Your Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/provider/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  hello@kinderbridge.com
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  (555) 123-4567
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 KinderBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
