import React from 'react';
import { Card } from 'flowbite-react';

const Terms = () => {
    return (
        <div className="pt-24 pb-20 px-8 bg-gray-100 min-h-screen font-sans">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <h1 className="text-4xl font-bold mb-6 text-blue-600">Terms & Conditions</h1>

                    <p className="mb-4 text-gray-700">
                        Welcome to Beach Control. By accessing or using our website, you agree to the following terms and conditions. Please read them carefully before using our services.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
                    <p className="mb-4 text-gray-700">
                        Beach Control provides real-time data visualization regarding beach conditions, including beach temperature, water temperature, humidity, UV index, and cloud coverage. These Terms & Conditions govern your use of our website and services.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Use of Service</h2>
                    <ul className="list-disc ml-6 text-gray-700 mb-4">
                        <li className="mb-2">You must be at least 12 years old to use our services.</li>
                        <li className="mb-2">The data provided is for informational purposes only and should not be used for critical decision-making, such as safety or health-related decisions.</li>
                        <li className="mb-2">You agree not to misuse the service by attempting unauthorized access or distributing malicious software.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
                    <p className="mb-4 text-gray-700">
                        Users are responsible for ensuring that the information provided by Beach Control is appropriate for their personal use. While we strive to provide accurate and timely data, we cannot guarantee the absolute accuracy of all metrics at all times.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Intellectual Property</h2>
                    <p className="mb-4 text-gray-700">
                        All content, design, and data available on Beach Control are the intellectual property of Beach Control or its licensors. You are prohibited from reproducing, distributing, or modifying any part of the website without our express permission.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Limitation of Liability</h2>
                    <p className="mb-4 text-gray-700">
                        Beach Control is not liable for any damages or losses resulting from the use or inability to use the data provided. This includes, but is not limited to, reliance on data accuracy, technical issues, or third-party interactions.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Changes to Terms</h2>
                    <p className="mb-4 text-gray-700">
                        Beach Control reserves the right to update these Terms & Conditions at any time without prior notice. Users are encouraged to review this page periodically to stay informed of any changes.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Governing Law</h2>
                    <p className="mb-4 text-gray-700">
                        These Terms & Conditions are governed by the laws of your jurisdiction. Any disputes arising under these terms shall be resolved in accordance with these laws.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Contact Us</h2>
                    <p className="mb-4 text-gray-700">
                        If you have any questions or concerns regarding these Terms & Conditions, please contact us at <a href="mailto:support@beachcontrol.com" className="text-blue-600 underline">support@beachcontrol.com</a>.
                    </p>

                    <p className="text-gray-700 font-medium">Thank you for choosing Beach Control. Enjoy your experience!</p>
                </Card>
            </div>
        </div>
    );
};

export default Terms;
