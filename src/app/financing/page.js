'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaArrowRight, FaFileAlt, FaCalculator, FaQuestionCircle, FaMoneyBillWave, FaExternalLinkAlt } from 'react-icons/fa';
import Layout from '../../../components/layout/Layout';

const FinancingPage = () => {
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [loanAmount, setLoanAmount] = useState(20000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(60);

  const calculatePayment = () => {
    const principal = parseFloat(loanAmount);
    const calculatedInterest = parseFloat(interestRate) / 100 / 12;
    const calculatedPayments = parseFloat(loanTerm);

    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
      setMonthlyPayment(monthly.toFixed(2));
    } else {
      setMonthlyPayment(0);
    }
  };

  const redirectToApplication = (e) => {
    e.preventDefault();
    window.open('https://www.accreditapp.com/(S(gwyte52gku2nuwdppeipxcrb))/ACCreditApp_spf.aspx?ACCFX=123797o17566', '_blank');
  };

  return (
    <Layout>
      <section className="pt-24 pb-12 bg-accent-100 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-secondary py-16 dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Financing Options</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              We've partnered with Credit Acceptance Finance Services to offer in-house financing options!
            </p>
            <a
              href="#finance-form"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md transition-colors duration-300 text-lg"
            >
              Apply for Pre-Qualification
            </a>
          </div>
        </section>

        {/* Announcement Section */}
        <section className="py-16 bg-white dark:bg-gray-800 border-y border-gray-300 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-secondary dark:bg-gray-700 p-8 rounded-lg shadow-lg">
              <div className="text-white mb-4 text-center">
                <FaMoneyBillWave size={48} className="mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">New Financing Options Available!</h2>
              <p className="text-xl text-white opacity-90 dark:text-gray-300 mb-6 text-center">
                Exciting News from Scuffletown 2.0 Motorsports & Sales!
              </p>
              <p className="text-white opacity-90 dark:text-gray-300 mb-6">
                We are thrilled to announce our partnership with Credit Acceptance Finance Services, bringing a whole new level of convenience to our valued customers!
              </p>
              <p className="text-white opacity-90 dark:text-gray-300 mb-6">
                Starting December 10, 2024, Scuffletown 2.0 will officially offer in-house financing options to help make your dream vehicle a reality. Whether you're looking for reliable used cars, powerful V-twin motorcycles, or any of our quality vehicles, financing is now simpler, faster, and easier than ever before.
              </p>
              <p className="text-white opacity-90 dark:text-gray-300 mb-8">
                At Scuffletown 2.0, we're committed to helping our community find the right vehicle with flexible payment options. So, why wait? Stop by, shop local, and experience the Scuffletown difference today!
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-accent dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-gray-100">Why Finance With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
                <div className="text-primary mb-4">
                  <FaCheckCircle size={40} />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-gray-100">Competitive Rates</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We work with Credit Acceptance Finance Services to ensure you get the most competitive interest rates available.
                </p>
              </div>
              <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
                <div className="text-primary mb-4">
                  <FaCheckCircle size={40} />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-gray-100">Quick Approval</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our streamlined process means you can get approved quickly, often within the same day.
                </p>
              </div>
              <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
                <div className="text-primary mb-4">
                  <FaCheckCircle size={40} />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-gray-100">Flexible Terms</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose from a variety of loan terms to fit your budget and financial goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Calculator */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 overflow-hidden">
              <div className="bg-secondary dark:bg-gray-800 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <FaCalculator className="mr-3" /> Payment Calculator
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-200 mb-2">Loan Amount ($)</label>
                      <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-200 mb-2">Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-gray-700 dark:text-gray-200 mb-2">Loan Term (months)</label>
                      <select
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="36">36 months (3 years)</option>
                        <option value="48">48 months (4 years)</option>
                        <option value="60">60 months (5 years)</option>
                        <option value="72">72 months (6 years)</option>
                        <option value="84">84 months (7 years)</option>
                      </select>
                    </div>
                    <button
                      onClick={calculatePayment}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
                    >
                      Calculate
                    </button>
                  </div>
                  <div className="flex flex-col justify-center items-center bg-accent dark:bg-gray-600 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Estimated Monthly Payment</h3>
                    <div className="text-4xl font-bold text-primary mb-4">
                      ${monthlyPayment}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300 text-center mb-6">
                      This is only an estimate. Your actual payment may vary based on your credit score and other factors.
                    </p>
                    <a
                      href="#finance-form"
                      className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
                    >
                      Apply Now <FaArrowRight className="ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Section - Redirect */}
        <section id="finance-form" className="py-16 bg-accent dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 dark:text-gray-100">Ready to Apply for Financing?</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Click the button below to be redirected to our secure Credit Acceptance Finance Application portal. You'll complete your application directly on their secure platform.
            </p>
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <div className="mb-6">
                <FaFileAlt className="mx-auto text-primary" size={48} />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Apply with Credit Acceptance Finance</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You'll be redirected to Credit Acceptance's secure application portal to complete your finance application.
              </p>
              <button
                onClick={redirectToApplication}
                className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
              >
                Apply Now <FaExternalLinkAlt className="ml-2" />
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                By clicking "Apply Now", you'll be redirected to Credit Acceptance Finance's secure application portal in a new window.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-accent dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold mb-3 flex items-center dark:text-gray-100">
                  <FaQuestionCircle className="text-primary mr-3" /> What documents do I need to apply?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You'll need a valid driver's license, proof of income, proof of residence, and insurance information.
                </p>
              </div>
              <div className="bg-accent dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold mb-3 flex items-center dark:text-gray-100">
                  <FaQuestionCircle className="text-primary mr-3" /> Will applying affect my credit score?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our pre-qualification process uses a soft credit pull, which doesn't impact your credit score.
                </p>
              </div>
              <div className="bg-accent dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold mb-3 flex items-center dark:text-gray-100">
                  <FaQuestionCircle className="text-primary mr-3" /> Can I apply with less-than-perfect credit?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, Credit Acceptance Finance Services specializes in helping customers with a variety of credit situations.
                </p>
              </div>
              <div className="bg-accent dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold mb-3 flex items-center dark:text-gray-100">
                  <FaQuestionCircle className="text-primary mr-3" /> How long does approval take?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Many customers receive a decision within 24 hours after submitting all required documentation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default FinancingPage; 