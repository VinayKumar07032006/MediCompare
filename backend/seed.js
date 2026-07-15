import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Service from "./models/Service.js";
import Hospital from "./models/Hospital.js";
import Booking from "./models/Booking.js";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";
import AuditLog from "./models/AuditLog.js";

dotenv.config();

const SERVICES = [
  {
    id: "mri",
    name: "MRI Scan",
    slug: "mri",
    iconName: "Brain",
    description: "High-resolution Magnetic Resonance Imaging for brain, joints, and spine.",
    priceRange: "₹4,500 - ₹9,000",
    averagePrice: 6500,
    preparation: "Wear comfortable, loose clothing. Remove all metal objects including jewelry, watches, and hairpins. Inform the technician if you have any implants.",
    overview: "Magnetic Resonance Imaging (MRI) is a non-invasive imaging technology that produces detailed three-dimensional anatomical images. It is commonly used for detecting brain tumors, traumatic brain injury, developmental anomalies, stroke, and spine disorders.",
    faqs: [
      {
        question: "How long does an MRI scan take?",
        answer: "Typically, an MRI scan takes between 25 to 45 minutes depending on the body part and the number of images required."
      },
      {
        question: "Is MRI safe? Are there side effects?",
        answer: "Yes, MRI is very safe. It uses magnetic fields and radio waves, not radiation. There are no known side effects, though patients with metallic implants must alert the radiologist."
      },
      {
        question: "Do I need to fast before an MRI?",
        answer: "For most MRI scans, you can eat and drink normally. For specific scans (like abdominal MRIs), you may be required to fast for 4-6 hours."
      }
    ]
  },
  {
    id: "ct-scan",
    name: "CT Scan",
    slug: "ct-scan",
    iconName: "Activity",
    description: "Computed Tomography scans for detailed cross-sectional views of bones and organs.",
    priceRange: "₹3,000 - ₹7,000",
    averagePrice: 4800,
    preparation: "Fast for 3-4 hours if contrast dye is to be administered. Wear metal-free clothing.",
    overview: "A CT scan (Computed Tomography) combines a series of X-ray images taken from different angles around your body and uses computer processing to create cross-sectional images of the bones, blood vessels, and soft tissues inside your body.",
    faqs: [
      {
        question: "What is contrast dye and do I need it?",
        answer: "Contrast dye is a substance that highlights blood vessels and organs on the CT scan. The doctor will specify if contrast is needed. If contrast is used, you'll require a blood creatinine test beforehand."
      },
      {
        question: "Can I get a CT scan during pregnancy?",
        answer: "Generally, CT scans are not recommended during pregnancy due to low levels of X-ray radiation. Inform your physician if you are or might be pregnant."
      }
    ]
  },
  {
    id: "x-ray",
    name: "X-Ray",
    slug: "x-ray",
    iconName: "Bone",
    description: "Quick, painless imaging to detect bone fractures and chest infections.",
    priceRange: "₹400 - ₹1,200",
    averagePrice: 750,
    preparation: "No special preparation needed. You may need to wear a hospital gown and remove metal objects near the area being scanned.",
    overview: "X-ray is the oldest and most frequently used form of medical imaging. It uses electromagnetic radiation to create pictures of the inside of your body, highly effective for diagnosing broken bones, joint dislocations, and pneumonia.",
    faqs: [
      {
        question: "How much radiation am I exposed to during an X-ray?",
        answer: "The radiation exposure is extremely low and equivalent to the natural environmental radiation you receive in a few days."
      },
      {
        question: "How fast are the X-ray results available?",
        answer: "X-ray images are generated instantly. A radiologist report is usually ready within 1 to 2 hours."
      }
    ]
  },
  {
    id: "blood-test",
    name: "Blood Test",
    slug: "blood-test",
    iconName: "Droplet",
    description: "Complete blood count, diabetes profiles, thyroid checks, and lipid panels.",
    priceRange: "₹300 - ₹2,500",
    averagePrice: 1200,
    preparation: "Many blood tests (like fasting blood glucose or lipid profiles) require 8-12 hours of fasting. Drink plenty of plain water to stay hydrated.",
    overview: "Blood tests help doctors evaluate how well your organs (like kidneys, liver, thyroid, and heart) are functioning and help diagnose conditions such as anemia, infections, diabetes, and coronary artery disease.",
    faqs: [
      {
        question: "Is fasting required for all blood tests?",
        answer: "No, only for specific tests. CBC, HbA1c, and Vitamin tests do not usually require fasting. Lipid Profile and FBS do."
      },
      {
        question: "Can I take home-sample collection for blood tests?",
        answer: "Yes, home collection is widely available. However, hospital labs offer faster processing times and higher diagnostic precision."
      }
    ]
  },
  {
    id: "ultrasound",
    name: "Ultrasound",
    slug: "ultrasound",
    iconName: "HeartPulse",
    description: "Sonography scan for pregnancy monitoring, abdominal scans, and pelvic checks.",
    priceRange: "₹1,200 - ₹3,500",
    averagePrice: 2200,
    preparation: "For abdominal scans, fast for 6 hours. For pelvic/pregnancy scans, drink 32 ounces of water 1 hour before and do not empty your bladder.",
    overview: "Ultrasound imaging (sonography) uses high-frequency sound waves to view live images from the inside of the body. It does not use radiation, making it the preferred method for monitoring fetal development in pregnant women.",
    faqs: [
      {
        question: "Is ultrasound completely safe for pregnant women?",
        answer: "Yes, ultrasound does not use ionizing radiation (unlike X-rays or CT scans) and has been proven completely safe for fetal imaging."
      },
      {
        question: "What is the difference between 3D and 4D ultrasound?",
        answer: "A 3D ultrasound creates a static three-dimensional image of the fetus, whereas a 4D ultrasound displays a live, moving 3D video."
      }
    ]
  },
  {
    id: "full-body-checkup",
    name: "Full Body Checkup",
    slug: "full-body-checkup",
    iconName: "Stethoscope",
    description: "Comprehensive health package covering 80+ parameters including liver, kidney, and heart.",
    priceRange: "₹2,500 - ₹8,500",
    averagePrice: 4500,
    preparation: "Strict 10-12 hours of overnight fasting is mandatory. Avoid alcohol for 24 hours prior. Bring your morning urine sample if requested.",
    overview: "Full Body Checkups are preventive health packages designed to evaluate key health parameters. Regular screens detect potential risks early, allowing for timely preventive measures and lifestyle changes.",
    faqs: [
      {
        question: "How often should I get a full body checkup?",
        answer: "Adults under 35 should get checked every 2 years. Adults over 35, or those with existing health parameters, are recommended to test annually."
      },
      {
        question: "What tests are included in a full body package?",
        answer: "A standard package includes Blood Counts, Liver Function (LFT), Kidney Function (KFT), Lipid Profile, Blood Sugar, Thyroid Profile, Urine analysis, and sometimes an ECG and chest X-Ray."
      }
    ]
  }
];

const HOSPITALS = [
  {
    id: "apollo-mumbai",
    name: "Apollo Hospitals, Navi Mumbai",
    logo: "AH",
    rating: 4.8,
    reviewsCount: 1420,
    city: "Mumbai",
    pincode: "400614",
    location: {
      type: "Point",
      coordinates: [73.0180, 19.0234] // CBD Belapur, Navi Mumbai
    },
    distance: 4.2,
    address: "Plot No. 13, Off Uran Road, Parsik Hill Rd, Sector 23, CBD Belapur, Navi Mumbai, Maharashtra 400614",
    about: "Apollo Hospitals Navi Mumbai is one of the most advanced multi-specialty tertiary care hospitals in Maharashtra. The facility is equipped with state-of-the-art diagnostic equipment and JCI accreditation, offering global standard healthcare with top-tier consultants.",
    images: [
      "linear-gradient(to right, #1e3a8a, #2563eb)",
      "linear-gradient(to right, #0d9488, #10b981)",
    ],
    availability: "High",
    amenities: ["Valet Parking", "Cafeteria", "Pharmacy 24x7", "Wheelchair Accessible", "ISO Certified", "JCI Accredited"],
    services: {
      "mri": { price: 6200, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:30 PM", "06:00 PM"], machineType: "Siemens Magnetom Aera 1.5T MRI", reportTurnaround: "12 Hours" },
      "ct-scan": { price: 4500, available: true, nextSlot: "Today, 04:00 PM", slots: ["04:00 PM", "05:00 PM", "06:00 PM"], machineType: "GE Revolution 256-slice CT", reportTurnaround: "8 Hours" },
      "x-ray": { price: 650, available: true, nextSlot: "Today, 02:30 PM", slots: ["02:30 PM", "03:30 PM", "04:30 PM"], reportTurnaround: "2 Hours" },
      "blood-test": { price: 999, available: true, nextSlot: "Tomorrow, 08:00 AM", slots: ["08:00 AM", "09:00 AM", "10:00 AM"], reportTurnaround: "12 Hours" },
      "ultrasound": { price: 2100, available: true, nextSlot: "Today, 05:00 PM", slots: ["05:00 PM", "05:30 PM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 3999, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:30 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "r1", userName: "Aarav Mehta", rating: 5, comment: "Excellent facility and very professional staff. The MRI scan was done on time, and they provided a clean gown. Reports were available online by evening.", date: "2026-06-15" },
      { id: "r2", userName: "Priya Sharma", rating: 4.5, comment: "Very clean environment. The wait time was slightly high, but the doctors and techs explained the process very well.", date: "2026-06-10" }
    ]
  },
  {
    id: "max-delhi",
    name: "Max Super Speciality Hospital, Saket",
    logo: "MH",
    rating: 4.7,
    reviewsCount: 1850,
    city: "Delhi NCR",
    pincode: "110017",
    location: {
      type: "Point",
      coordinates: [77.2185, 28.5283] // Saket, New Delhi
    },
    distance: 1.8,
    address: "1 & 2, Press Enclave Road, Saket Institutional Area, Saket, New Delhi, Delhi 110017",
    about: "Max Super Speciality Hospital Saket is widely recognized as one of India's leading healthcare centers. Known for clinical excellence and cutting-edge diagnostic technology, including the first FDA-approved 3T MRI in North India.",
    images: [
      "linear-gradient(to right, #0f172a, #1e293b)",
      "linear-gradient(to right, #2563eb, #3b82f6)",
    ],
    availability: "Medium",
    amenities: ["Valet Parking", "Premium Lounge", "In-house Cafe", "24x7 Lab", "NABH Accredited"],
    services: {
      "mri": { price: 7800, available: true, nextSlot: "Tomorrow, 09:30 AM", slots: ["09:30 AM", "11:00 AM", "01:30 PM"], machineType: "Siemens Prisma 3T MRI", reportTurnaround: "18 Hours" },
      "ct-scan": { price: 5200, available: true, nextSlot: "Today, 05:30 PM", slots: ["05:30 PM", "06:30 PM"], machineType: "Philips Brilliance 128-slice CT", reportTurnaround: "12 Hours" },
      "x-ray": { price: 800, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:00 PM", "05:00 PM"], reportTurnaround: "1 Hour" },
      "blood-test": { price: 1200, available: true, nextSlot: "Tomorrow, 07:30 AM", slots: ["07:30 AM", "08:30 AM", "09:30 AM"], reportTurnaround: "8 Hours" },
      "ultrasound": { price: 2500, available: true, nextSlot: "Tomorrow, 10:00 AM", slots: ["10:00 AM", "11:30 AM"], reportTurnaround: "6 Hours" },
      "full-body-checkup": { price: 4999, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:00 AM", "09:00 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "r3", userName: "Vikram Malhotra", rating: 5, comment: "State of the art technology. The MRI machine was highly advanced with noise-canceling headphones. Report was highly detailed.", date: "2026-06-22" },
      { id: "r4", userName: "Ananya Gupta", rating: 4, comment: "High-quality diagnostics but a bit expensive compared to other labs. If budget is not an issue, this is the best place.", date: "2026-06-18" }
    ]
  },
  {
    id: "fortis-bengaluru",
    name: "Fortis Hospital, Bannerghatta Road",
    logo: "FH",
    rating: 4.6,
    reviewsCount: 1100,
    city: "Bengaluru",
    pincode: "560076",
    location: {
      type: "Point",
      coordinates: [77.5997, 12.8953] // Bannerghatta, Bengaluru
    },
    distance: 3.5,
    address: "154/9, Bannerghatta Main Rd, Opposite IIM-B, Bilekahalli, Bengaluru, Karnataka 560076",
    about: "Fortis Hospital, Bannerghatta Road, is a JCI and NABH accredited, 276-bed multi-specialty hospital. Fortis Diagnostics features advanced imaging solutions, rapid turnaround times, and expert reporting pathologists.",
    images: [
      "linear-gradient(to right, #065f46, #059669)",
      "linear-gradient(to right, #1d4ed8, #2563eb)",
    ],
    availability: "High",
    amenities: ["Parking", "Food Court", "Emergency Care 24x7", "NABH Accredited"],
    services: {
      "mri": { price: 6500, available: true, nextSlot: "Today, 04:30 PM", slots: ["04:30 PM", "05:30 PM"], machineType: "GE Signa Explorer 1.5T MRI", reportTurnaround: "12 Hours" },
      "ct-scan": { price: 4200, available: true, nextSlot: "Tomorrow, 10:00 AM", slots: ["10:00 AM", "11:30 AM"], machineType: "GE Optima 64-slice CT", reportTurnaround: "12 Hours" },
      "x-ray": { price: 600, available: true, nextSlot: "Today, 02:00 PM", slots: ["02:00 PM", "03:00 PM", "04:00 PM"], reportTurnaround: "2 Hours" },
      "blood-test": { price: 799, available: true, nextSlot: "Tomorrow, 08:00 AM", slots: ["08:00 AM", "09:00 AM"], reportTurnaround: "10 Hours" },
      "ultrasound": { price: 1800, available: true, nextSlot: "Today, 03:30 PM", slots: ["03:30 PM", "04:30 PM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 3499, available: true, nextSlot: "Tomorrow, 07:30 AM", slots: ["07:30 AM", "08:30 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "r5", userName: "Rahul Nair", rating: 4, comment: "Good experience. Booked via MediCompare and got a direct slot. No long queues for blood sample submission.", date: "2026-06-20" }
    ]
  },
  {
    id: "manipal-pune",
    name: "Manipal Hospital, Kharadi",
    logo: "MH",
    rating: 4.5,
    reviewsCount: 950,
    city: "Pune",
    pincode: "411014",
    location: {
      type: "Point",
      coordinates: [73.9420, 18.5524] // Kharadi, Pune
    },
    distance: 5.1,
    address: "Kharadi Bypass Road, Near Radisson Blu Hotel, Kharadi, Pune, Maharashtra 411014",
    about: "Manipal Hospital Kharadi provides standard healthcare solutions across Pune. Equipped with high-speed digital imaging and integrated radiology reports available straight on patients' smartphones.",
    images: [
      "linear-gradient(to right, #b91c1c, #dc2626)",
      "linear-gradient(to right, #1e3a8a, #2563eb)",
    ],
    availability: "Limited",
    amenities: ["Parking", "Pharmacy 24x7", "Wheelchair Accessible", "NABH Accredited"],
    services: {
      "mri": { price: 5800, available: true, nextSlot: "Tomorrow, 11:30 AM", slots: ["11:30 AM", "02:30 PM", "04:00 PM"], machineType: "Philips Ingenia 1.5T MRI", reportTurnaround: "16 Hours" },
      "ct-scan": { price: 3800, available: true, nextSlot: "Today, 06:00 PM", slots: ["06:00 PM"], machineType: "Siemens Somatom 64-slice CT", reportTurnaround: "12 Hours" },
      "x-ray": { price: 500, available: true, nextSlot: "Today, 04:00 PM", slots: ["04:00 PM", "05:00 PM"], reportTurnaround: "2 Hours" },
      "blood-test": { price: 650, available: true, nextSlot: "Tomorrow, 08:30 AM", slots: ["08:30 AM", "09:30 AM"], reportTurnaround: "12 Hours" },
      "ultrasound": { price: 1600, available: true, nextSlot: "Tomorrow, 09:00 AM", slots: ["09:00 AM", "10:30 AM"], reportTurnaround: "6 Hours" },
      "full-body-checkup": { price: 2999, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:00 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "r6", userName: "Sneha Joshi", rating: 4.5, comment: "Courteous staff, clean changing rooms. Got my report on WhatsApp next morning.", date: "2026-06-11" }
    ]
  },
  {
    id: "dr-lal-mumbai",
    name: "Dr. Lal PathLabs Premium, Andheri",
    logo: "LP",
    rating: 4.6,
    reviewsCount: 2200,
    city: "Mumbai",
    pincode: "400069",
    location: {
      type: "Point",
      coordinates: [72.8444, 19.1197] // Andheri East, Mumbai
    },
    distance: 1.2,
    address: "Shop No 2, Ground Floor, Vertex Vikas Building, Opp Andheri Station East, Mumbai, Maharashtra 400069",
    about: "Dr. Lal PathLabs is India's most trusted diagnostics chain. The Andheri Super-Center offers advanced clinical testing, specialized MRI & CT Scans, digital X-Rays, and highly precise blood sample analysis.",
    images: [
      "linear-gradient(to right, #d97706, #f59e0b)",
      "linear-gradient(to right, #059669, #10b981)",
    ],
    availability: "High",
    amenities: ["Express Sample Submission", "Air Conditioned Lounge", "Home Collection", "NABL Accredited"],
    services: {
      "mri": { price: 5400, available: true, nextSlot: "Today, 02:00 PM", slots: ["02:00 PM", "03:30 PM", "05:00 PM"], machineType: "Hitachi Echelon Smart 1.5T", reportTurnaround: "24 Hours" },
      "ct-scan": { price: 3500, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:30 PM"], machineType: "GE BrightSpeed 16-slice CT", reportTurnaround: "12 Hours" },
      "x-ray": { price: 450, available: true, nextSlot: "Today, 01:30 PM", slots: ["01:30 PM", "02:30 PM", "03:30 PM"], reportTurnaround: "1 Hour" },
      "blood-test": { price: 499, available: true, nextSlot: "Today, 01:00 PM", slots: ["01:00 PM", "03:00 PM", "05:00 PM"], reportTurnaround: "6 Hours" },
      "ultrasound": { price: 1400, available: true, nextSlot: "Today, 04:00 PM", slots: ["04:00 PM", "04:30 PM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 2499, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:00 AM", "09:00 AM"], reportTurnaround: "12 Hours" }
    },
    reviews: [
      { id: "r7", userName: "Amit Patel", rating: 4.8, comment: "Extremely fast service for Blood Tests. The phlebotomist was very skilled, didn't feel a sting. Prices are very reasonable.", date: "2026-06-24" }
    ]
  },
  {
    id: "srl-delhi",
    name: "SRL Diagnostics Center, Connaught Place",
    logo: "SR",
    rating: 4.5,
    reviewsCount: 1680,
    city: "Delhi NCR",
    pincode: "110001",
    location: {
      type: "Point",
      coordinates: [77.2197, 28.6304] // Connaught Place, New Delhi
    },
    distance: 2.9,
    address: "H-16, Outer Circle, Connaught Place, Near Rajiv Chowk Metro Gate 5, New Delhi, Delhi 110001",
    about: "SRL Diagnostics is a leading reference laboratory network in India. This Connaught Place hub features state-of-the-art automation systems, double-check validation of blood parameters, and premium radiologist consults.",
    images: [
      "linear-gradient(to right, #0369a1, #0ea5e9)",
      "linear-gradient(to right, #4f46e5, #6366f1)",
    ],
    availability: "High",
    amenities: ["Wheelchair Ramp", "Online Reports portal", "Home Collection", "NABL Accredited"],
    services: {
      "mri": { price: 5600, available: true, nextSlot: "Today, 03:30 PM", slots: ["03:30 PM", "05:00 PM"], machineType: "Siemens Magnetom Essenza 1.5T", reportTurnaround: "24 Hours" },
      "ct-scan": { price: 3400, available: true, nextSlot: "Today, 04:30 PM", slots: ["04:30 PM", "05:30 PM"], machineType: "Toshiba Aquilion 64-slice", reportTurnaround: "16 Hours" },
      "x-ray": { price: 420, available: true, nextSlot: "Today, 02:00 PM", slots: ["02:00 PM", "03:00 PM", "04:00 PM"], reportTurnaround: "2 Hours" },
      "blood-test": { price: 450, available: true, nextSlot: "Today, 01:30 PM", slots: ["01:30 PM", "02:30 PM", "04:00 PM"], reportTurnaround: "8 Hours" },
      "ultrasound": { price: 1500, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:30 PM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 2299, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:00 AM", "09:00 AM"], reportTurnaround: "18 Hours" }
    },
    reviews: [
      { id: "r8", userName: "Divya Kapoor", rating: 4, comment: "I compared X-Ray pricing on MediCompare and saved ₹300 by booking here. Smooth execution and instant report copy.", date: "2026-06-19" }
    ]
  },
  {
    id: "metropolis-mumbai",
    name: "Metropolis Healthcare, Bandra",
    logo: "MH",
    rating: 4.6,
    reviewsCount: 980,
    city: "Mumbai",
    pincode: "400050",
    location: {
      type: "Point",
      coordinates: [72.8400, 19.0550]
    },
    distance: 2.5,
    address: "Ground Floor, Crystal Plaza, Station Road, Bandra West, Mumbai, Maharashtra 400050",
    about: "Metropolis Healthcare is a leading diagnostics center chain in India. The Bandra center provides high-accuracy clinical laboratory tests, digital X-Rays, and advanced pathology scanning, with state-of-the-art diagnostic protocols.",
    images: [
      "linear-gradient(to right, #0d9488, #115e59)",
      "linear-gradient(to right, #0ea5e9, #0284c7)"
    ],
    availability: "High",
    amenities: ["Online Reports", "Home Collection", "Wheelchair Accessible", "NABL Accredited"],
    services: {
      "mri": { price: 5900, available: true, nextSlot: "Today, 04:00 PM", slots: ["04:00 PM", "05:30 PM"], machineType: "Siemens Magnetom Aera 1.5T MRI", reportTurnaround: "24 Hours" },
      "ct-scan": { price: 3900, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:30 PM"], machineType: "GE BrightSpeed 16-slice CT", reportTurnaround: "12 Hours" },
      "x-ray": { price: 500, available: true, nextSlot: "Today, 02:00 PM", slots: ["02:00 PM", "03:00 PM", "04:00 PM"], reportTurnaround: "2 Hours" },
      "blood-test": { price: 399, available: true, nextSlot: "Tomorrow, 08:00 AM", slots: ["08:00 AM", "09:00 AM", "10:00 AM"], reportTurnaround: "6 Hours" },
      "ultrasound": { price: 1600, available: true, nextSlot: "Today, 04:30 PM", slots: ["04:30 PM", "05:00 PM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 2199, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:00 AM"], reportTurnaround: "12 Hours" }
    },
    reviews: [
      { id: "rm1", userName: "Karan Johar", rating: 4.5, comment: "Very prompt home blood collection service. The report arrived on WhatsApp within 6 hours. Highly recommend.", date: "2026-06-25" }
    ]
  },
  {
    id: "kokilaben-mumbai",
    name: "Kokilaben Dhirubhai Ambani Hospital, Andheri",
    logo: "KH",
    rating: 4.9,
    reviewsCount: 2850,
    city: "Mumbai",
    pincode: "400053",
    location: {
      type: "Point",
      coordinates: [72.8258, 19.1311]
    },
    distance: 6.8,
    address: "Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai, Maharashtra 400053",
    about: "Kokilaben Dhirubhai Ambani Hospital is a flagship multi-specialty healthcare center in Mumbai. It features highly advanced imaging systems, including 3T MRI scanners and high-slice CT scanners, yielding world-class clinical diagnostic precision.",
    images: [
      "linear-gradient(to right, #4c1d95, #6d28d9)",
      "linear-gradient(to right, #1e3a8a, #3b82f6)"
    ],
    availability: "Medium",
    amenities: ["Valet Parking", "Premium Lounge", "24x7 Pharmacy", "JCI Accredited", "ISO Certified"],
    services: {
      "mri": { price: 8200, available: true, nextSlot: "Tomorrow, 09:30 AM", slots: ["09:30 AM", "11:00 AM", "02:00 PM"], machineType: "Siemens Magnetom Skyra 3T MRI", reportTurnaround: "12 Hours" },
      "ct-scan": { price: 5400, available: true, nextSlot: "Today, 05:00 PM", slots: ["05:00 PM", "06:00 PM"], machineType: "GE Discovery CT750 HD", reportTurnaround: "8 Hours" },
      "x-ray": { price: 750, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:00 PM"], reportTurnaround: "1 Hour" },
      "blood-test": { price: 1100, available: true, nextSlot: "Tomorrow, 07:30 AM", slots: ["07:30 AM", "08:30 AM"], reportTurnaround: "8 Hours" },
      "ultrasound": { price: 2400, available: true, nextSlot: "Today, 03:30 PM", slots: ["03:30 PM", "04:30 PM"], reportTurnaround: "3 Hours" },
      "full-body-checkup": { price: 4500, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:00 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "rk1", userName: "Rajesh Koothrappali", rating: 5, comment: "Top class technology. The 3T MRI scanning experience was very smooth and stress-free. Very clean and spacious rooms.", date: "2026-06-28" }
    ]
  },
  {
    id: "medanta-delhi",
    name: "Medanta The Medicity, Sector 38",
    logo: "MD",
    rating: 4.8,
    reviewsCount: 3100,
    city: "Delhi NCR",
    pincode: "122001",
    location: {
      type: "Point",
      coordinates: [77.0400, 28.4200]
    },
    distance: 14.5,
    address: "CH Baktawar Singh Road, Sector 38, Gurugram, Haryana 122001",
    about: "Medanta The Medicity is one of India's largest multi-super specialty medical institutes. The diagnostic center features top-tier radiologists, pathologists, and advanced 3T MRI, PET-CT scanners, providing top-class clinical testing.",
    images: [
      "linear-gradient(to right, #991b1b, #7f1d1d)",
      "linear-gradient(to right, #0f172a, #1e293b)"
    ],
    availability: "Medium",
    amenities: ["Valet Parking", "Cafeteria", "Pharmacy 24x7", "Wheelchair Accessible", "JCI Accredited"],
    services: {
      "mri": { price: 8500, available: true, nextSlot: "Tomorrow, 10:00 AM", slots: ["10:00 AM", "11:30 AM", "03:00 PM"], machineType: "Siemens Magnetom Vida 3T MRI", reportTurnaround: "12 Hours" },
      "ct-scan": { price: 5900, available: true, nextSlot: "Today, 04:00 PM", slots: ["04:00 PM", "05:00 PM"], machineType: "Siemens Somatom Force CT", reportTurnaround: "8 Hours" },
      "x-ray": { price: 900, available: true, nextSlot: "Today, 02:30 PM", slots: ["02:30 PM", "03:30 PM"], reportTurnaround: "1 Hour" },
      "blood-test": { price: 1300, available: true, nextSlot: "Tomorrow, 07:30 AM", slots: ["07:30 AM", "08:30 AM"], reportTurnaround: "8 Hours" },
      "ultrasound": { price: 2700, available: true, nextSlot: "Tomorrow, 09:00 AM", slots: ["09:00 AM", "10:30 AM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 5500, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:00 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "rd1", userName: "Anil Goel", rating: 5, comment: "Massive facility with excellent diagnostic speed. Got detailed CT scans done and reports were double checked by senior pathologists.", date: "2026-06-26" }
    ]
  },
  {
    id: "apollo-delhi",
    name: "Indraprastha Apollo Hospitals, Sarita Vihar",
    logo: "AH",
    rating: 4.7,
    reviewsCount: 2450,
    city: "Delhi NCR",
    pincode: "110076",
    location: {
      type: "Point",
      coordinates: [77.2900, 28.5400]
    },
    distance: 8.2,
    address: "Sarita Vihar, Delhi-Mathura Road, New Delhi, Delhi 110076",
    about: "Indraprastha Apollo Hospital is a pioneer of modern healthcare in North India. Its diagnostic wing represents the gold standard in diagnostic and interventional radiology, fully integrated with online reporting portals.",
    images: [
      "linear-gradient(to right, #1e3a8a, #1d4ed8)",
      "linear-gradient(to right, #115e59, #0f766e)"
    ],
    availability: "High",
    amenities: ["Parking", "Premium Lounge", "24x7 Lab", "NABH Accredited", "JCI Accredited"],
    services: {
      "mri": { price: 7200, available: true, nextSlot: "Today, 05:00 PM", slots: ["05:00 PM", "06:00 PM"], machineType: "GE Signa Pioneer 3T MRI", reportTurnaround: "18 Hours" },
      "ct-scan": { price: 4900, available: true, nextSlot: "Today, 03:30 PM", slots: ["03:30 PM", "04:30 PM"], machineType: "Philips 128-slice CT", reportTurnaround: "12 Hours" },
      "x-ray": { price: 700, available: true, nextSlot: "Today, 01:00 PM", slots: ["01:00 PM", "02:00 PM", "03:00 PM"], reportTurnaround: "2 Hours" },
      "blood-test": { price: 950, available: true, nextSlot: "Tomorrow, 08:00 AM", slots: ["08:00 AM", "09:00 AM"], reportTurnaround: "12 Hours" },
      "ultrasound": { price: 2200, available: true, nextSlot: "Today, 04:00 PM", slots: ["04:00 PM", "05:00 PM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 4200, available: true, nextSlot: "Tomorrow, 07:30 AM", slots: ["07:30 AM", "08:30 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "rd2", userName: "Preeti Sinha", rating: 4, comment: "Very structured diagnostic workflow. Staff was polite. Scan rooms were clean and reports arrived on time.", date: "2026-06-20" }
    ]
  },
  {
    id: "manipal-bengaluru",
    name: "Manipal Hospital, Old Airport Road",
    logo: "MH",
    rating: 4.7,
    reviewsCount: 1950,
    city: "Bengaluru",
    pincode: "560017",
    location: {
      type: "Point",
      coordinates: [77.6480, 12.9592]
    },
    distance: 6.5,
    address: "98, Old Airport Road, Kodihalli, Bengaluru, Karnataka 560017",
    about: "Manipal Hospital Old Airport Road is a premier tertiary care center in Bengaluru. The Diagnostic Services offer high-end digital radiography, high-resolution ultrasound scan, and comprehensive preventative health checkups.",
    images: [
      "linear-gradient(to right, #dc2626, #991b1b)",
      "linear-gradient(to right, #0284c7, #075985)"
    ],
    availability: "High",
    amenities: ["Valet Parking", "Pharmacy 24x7", "Food Court", "NABL Accredited", "NABH Accredited"],
    services: {
      "mri": { price: 6800, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:30 PM"], machineType: "Siemens Magnetom Aera 1.5T MRI", reportTurnaround: "12 Hours" },
      "ct-scan": { price: 4600, available: true, nextSlot: "Tomorrow, 09:30 AM", slots: ["09:30 AM", "11:00 AM"], machineType: "GE Optima 128-slice CT", reportTurnaround: "10 Hours" },
      "x-ray": { price: 650, available: true, nextSlot: "Today, 02:00 PM", slots: ["02:00 PM", "03:00 PM", "04:00 PM"], reportTurnaround: "2 Hours" },
      "blood-test": { price: 899, available: true, nextSlot: "Tomorrow, 08:00 AM", slots: ["08:00 AM", "09:00 AM"], reportTurnaround: "10 Hours" },
      "ultrasound": { price: 1950, available: true, nextSlot: "Today, 04:00 PM", slots: ["04:00 PM", "05:00 PM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 3799, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:30 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "rb1", userName: "Srinivas Rao", rating: 5, comment: "I booked an ultrasound scan here. Friendly nurse, clean room, and got the printed copy immediately.", date: "2026-06-21" }
    ]
  },
  {
    id: "anand-bengaluru",
    name: "Anand Diagnostic Laboratory, Shivaji Nagar",
    logo: "AD",
    rating: 4.8,
    reviewsCount: 3400,
    city: "Bengaluru",
    pincode: "560001",
    location: {
      type: "Point",
      coordinates: [77.6050, 12.9850]
    },
    distance: 2.2,
    address: "Bowring Hospital Road, Shivaji Nagar, Bengaluru, Karnataka 560001",
    about: "Anand Diagnostic Laboratory is a pioneer in clinical laboratory diagnostics in South India. Known for highly precise and rapid blood test parameters, advanced clinical chemistry, and high-accuracy radiology tools.",
    images: [
      "linear-gradient(to right, #ea580c, #c2410c)",
      "linear-gradient(to right, #059669, #047857)"
    ],
    availability: "High",
    amenities: ["Home Sample Collection", "Express Checking", "Air Conditioned Lounge", "NABL Accredited"],
    services: {
      "mri": { price: 5300, available: true, nextSlot: "Today, 05:30 PM", slots: ["05:30 PM", "06:30 PM"], reportTurnaround: "24 Hours" },
      "ct-scan": { price: 3600, available: true, nextSlot: "Today, 04:00 PM", slots: ["04:00 PM", "05:00 PM"], reportTurnaround: "12 Hours" },
      "x-ray": { price: 450, available: true, nextSlot: "Today, 01:00 PM", slots: ["01:00 PM", "02:00 PM", "03:00 PM"], reportTurnaround: "1 Hour" },
      "blood-test": { price: 450, available: true, nextSlot: "Today, 02:30 PM", slots: ["02:30 PM", "03:30 PM", "04:30 PM"], reportTurnaround: "6 Hours" },
      "ultrasound": { price: 1350, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:00 PM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 2200, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:00 AM"], reportTurnaround: "12 Hours" }
    },
    reviews: [
      { id: "rb2", userName: "Deepa K.", rating: 4.8, comment: "Undoubtedly the most accurate blood testing lab in Bangalore. Very polite staff and quick collection process.", date: "2026-06-18" }
    ]
  },
  {
    id: "ruby-pune",
    name: "Ruby Hall Clinic, Sassoon Road",
    logo: "RC",
    rating: 4.8,
    reviewsCount: 1720,
    city: "Pune",
    pincode: "411001",
    location: {
      type: "Point",
      coordinates: [73.8744, 18.5284]
    },
    distance: 1.8,
    address: "40, Sassoon Road, Near Pune Junction Railway Station, Pune, Maharashtra 411001",
    about: "Ruby Hall Clinic is a premier medical institution in Pune, accredited by both NABH and NABL. The radiology and laboratory departments are equipped with state-of-the-art MRI and CT scanners for outstanding precision diagnostics.",
    images: [
      "linear-gradient(to right, #0284c7, #0369a1)",
      "linear-gradient(to right, #be185d, #9d174d)"
    ],
    availability: "Medium",
    amenities: ["Valet Parking", "24x7 Pharmacy", "Premium Lounge", "NABH Accredited"],
    services: {
      "mri": { price: 7100, available: true, nextSlot: "Tomorrow, 10:30 AM", slots: ["10:30 AM", "12:00 PM", "02:30 PM"], machineType: "Siemens Magnetom Aera 1.5T MRI", reportTurnaround: "12 Hours" },
      "ct-scan": { price: 4400, available: true, nextSlot: "Today, 04:30 PM", slots: ["04:30 PM", "05:30 PM"], machineType: "GE BrightSpeed 64-slice CT", reportTurnaround: "10 Hours" },
      "x-ray": { price: 600, available: true, nextSlot: "Today, 02:00 PM", slots: ["02:00 PM", "03:00 PM", "04:00 PM"], reportTurnaround: "2 Hours" },
      "blood-test": { price: 850, available: true, nextSlot: "Tomorrow, 08:00 AM", slots: ["08:00 AM", "09:00 AM"], reportTurnaround: "8 Hours" },
      "ultrasound": { price: 1900, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:00 PM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 3600, available: true, nextSlot: "Tomorrow, 07:30 AM", slots: ["07:30 AM", "08:30 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "rp1", userName: "Aditya Patil", rating: 5, comment: "Smooth booking process via MediCompare. Directly walked in and got the scan done. Extremely efficient.", date: "2026-06-27" }
    ]
  },
  {
    id: "sahyadri-pune",
    name: "Sahyadri Super Speciality Hospital, Deccan Gymkhana",
    logo: "SH",
    rating: 4.6,
    reviewsCount: 1250,
    city: "Pune",
    pincode: "411004",
    location: {
      type: "Point",
      coordinates: [73.8400, 18.5150]
    },
    distance: 2.3,
    address: "Plot No. 30-C, Erandwane, Karve Road, Deccan Gymkhana, Pune, Maharashtra 411004",
    about: "Sahyadri Hospital Erandwane is the largest chain of hospitals in Maharashtra. Sahyadri Diagnostics provides high-end pathology and radiology services with high accessibility and advanced digital reports delivery.",
    images: [
      "linear-gradient(to right, #047857, #065f46)",
      "linear-gradient(to right, #1d4ed8, #1e3a8a)"
    ],
    availability: "High",
    amenities: ["Parking", "In-house Cafeteria", "Pharmacy 24x7", "NABH Accredited"],
    services: {
      "mri": { price: 6300, available: true, nextSlot: "Today, 05:00 PM", slots: ["05:00 PM", "06:00 PM"], machineType: "GE Signa Explorer 1.5T MRI", reportTurnaround: "18 Hours" },
      "ct-scan": { price: 3990, available: true, nextSlot: "Today, 04:00 PM", slots: ["04:00 PM", "05:00 PM"], reportTurnaround: "12 Hours" },
      "x-ray": { price: 550, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:00 PM", "05:00 PM"], reportTurnaround: "2 Hours" },
      "blood-test": { price: 699, available: true, nextSlot: "Tomorrow, 08:30 AM", slots: ["08:30 AM", "09:30 AM"], reportTurnaround: "10 Hours" },
      "ultrasound": { price: 1650, available: true, nextSlot: "Today, 02:30 PM", slots: ["02:30 PM", "03:30 PM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 2899, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:00 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "rp2", userName: "Pooja Sawant", rating: 4, comment: "Courteous diagnostic staff, rapid sample collection. Recommended.", date: "2026-06-23" }
    ]
  },
  {
    id: "apollo-hyderabad",
    name: "Apollo Hospitals, Jubilee Hills",
    logo: "AH",
    rating: 4.9,
    reviewsCount: 2250,
    city: "Hyderabad",
    pincode: "500096",
    location: {
      type: "Point",
      coordinates: [78.4100, 17.4250]
    },
    distance: 8.8,
    address: "Road No 72, Opposite Bharatiya Vidya Bhavan School, Film Nagar, Jubilee Hills, Hyderabad, Telangana 500096",
    about: "Apollo Hospitals Jubilee Hills is a renowned medical center. It features highly advanced, world-class diagnostic laboratory instruments and MRI/CT facilities, setting standards for diagnostic precision in Hyderabad.",
    images: [
      "linear-gradient(to right, #1e3a8a, #2563eb)",
      "linear-gradient(to right, #047857, #10b981)"
    ],
    availability: "High",
    amenities: ["Valet Parking", "24x7 Pharmacy", "Cafeteria", "JCI Accredited", "NABH Accredited"],
    services: {
      "mri": { price: 7500, available: true, nextSlot: "Today, 04:30 PM", slots: ["04:30 PM", "06:00 PM"], machineType: "Siemens Magnetom Prisma 3T MRI", reportTurnaround: "12 Hours" },
      "ct-scan": { price: 4999, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:30 PM"], machineType: "GE Revolution 256-slice CT", reportTurnaround: "8 Hours" },
      "x-ray": { price: 750, available: true, nextSlot: "Today, 01:30 PM", slots: ["01:30 PM", "02:30 PM", "03:30 PM"], reportTurnaround: "2 Hours" },
      "blood-test": { price: 999, available: true, nextSlot: "Tomorrow, 08:00 AM", slots: ["08:00 AM", "09:00 AM", "10:00 AM"], reportTurnaround: "12 Hours" },
      "ultrasound": { price: 2200, available: true, nextSlot: "Today, 05:00 PM", slots: ["05:00 PM", "05:30 PM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 4499, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:30 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "rh1", userName: "Vikram Reddy", rating: 5, comment: "Outstanding efficiency. Booked a slots and completed testing inside 30 minutes. Staff was extremely supportive.", date: "2026-06-29" }
    ]
  },
  {
    id: "yashoda-hyderabad",
    name: "Yashoda Hospitals, Secunderabad",
    logo: "YH",
    rating: 4.7,
    reviewsCount: 1620,
    city: "Hyderabad",
    pincode: "500003",
    location: {
      type: "Point",
      coordinates: [78.5000, 17.4400]
    },
    distance: 5.4,
    address: "Alexander Road, Secunderabad, Hyderabad, Telangana 500003",
    about: "Yashoda Hospitals Secunderabad is a leading multi-specialty diagnostic and treatment hub. Known for excellent medical diagnostics, prompt imaging schedules, and detailed reporting by expert radiologists.",
    images: [
      "linear-gradient(to right, #0f172a, #334155)",
      "linear-gradient(to right, #3b82f6, #60a5fa)"
    ],
    availability: "Medium",
    amenities: ["Parking", "In-house Cafe", "Emergency Care 24x7", "NABH Accredited"],
    services: {
      "mri": { price: 6700, available: true, nextSlot: "Tomorrow, 09:30 AM", slots: ["09:30 AM", "11:00 AM"], machineType: "GE Signa Voyager 1.5T MRI", reportTurnaround: "18 Hours" },
      "ct-scan": { price: 4300, available: true, nextSlot: "Today, 05:30 PM", slots: ["05:30 PM", "06:30 PM"], machineType: "Toshiba Aquilion 64-slice", reportTurnaround: "12 Hours" },
      "x-ray": { price: 600, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:00 PM"], reportTurnaround: "2 Hours" },
      "blood-test": { price: 799, available: true, nextSlot: "Tomorrow, 07:30 AM", slots: ["07:30 AM", "08:30 AM"], reportTurnaround: "10 Hours" },
      "ultrasound": { price: 1800, available: true, nextSlot: "Tomorrow, 10:00 AM", slots: ["10:00 AM", "11:30 AM"], reportTurnaround: "4 Hours" },
      "full-body-checkup": { price: 3599, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:00 AM"], reportTurnaround: "24 Hours" }
    },
    reviews: [
      { id: "rh2", userName: "Swapna T.", rating: 4.5, comment: "High quality facilities and expert reporting doctor. Very professional environment.", date: "2026-06-25" }
    ]
  },
  {
    id: "vijaya-hyderabad",
    name: "Vijaya Diagnostic Centre, Ameerpet",
    logo: "VD",
    rating: 4.5,
    reviewsCount: 3800,
    city: "Hyderabad",
    pincode: "500016",
    location: {
      type: "Point",
      coordinates: [78.4450, 17.4355]
    },
    distance: 4.9,
    address: "6-3-870, Ameerpet Road, Beside Lal Bungalow, Ameerpet, Hyderabad, Telangana 500016",
    about: "Vijaya Diagnostic Centre is the largest diagnostic network in South India. Known for offering affordable rates, high patient volume capacity, express home collection services, and digital report generation.",
    images: [
      "linear-gradient(to right, #0284c7, #2563eb)",
      "linear-gradient(to right, #10b981, #059669)"
    ],
    availability: "High",
    amenities: ["Home collection", "Online report portal", "NABL Accredited", "ISO Certified"],
    services: {
      "mri": { price: 4999, available: true, nextSlot: "Today, 02:00 PM", slots: ["02:00 PM", "03:30 PM", "05:00 PM"], machineType: "Hitachi 1.5T MRI", reportTurnaround: "24 Hours" },
      "ct-scan": { price: 3200, available: true, nextSlot: "Today, 03:00 PM", slots: ["03:00 PM", "04:30 PM"], machineType: "GE BrightSpeed 16-slice", reportTurnaround: "12 Hours" },
      "x-ray": { price: 399, available: true, nextSlot: "Today, 01:30 PM", slots: ["01:30 PM", "02:30 PM"], reportTurnaround: "1 Hour" },
      "blood-test": { price: 350, available: true, nextSlot: "Today, 01:00 PM", slots: ["01:00 PM", "03:00 PM"], reportTurnaround: "6 Hours" },
      "ultrasound": { price: 1200, available: true, nextSlot: "Today, 04:00 PM", slots: ["04:00 PM", "04:30 PM"], reportTurnaround: "3 Hours" },
      "full-body-checkup": { price: 1999, available: true, nextSlot: "Tomorrow, 07:00 AM", slots: ["07:00 AM", "08:00 AM"], reportTurnaround: "12 Hours" }
    },
    reviews: [
      { id: "rh3", userName: "Madhav G.", rating: 4.2, comment: "Most budget friendly diagnostics in Hyderabad. Very good for blood tests and X-rays.", date: "2026-06-15" }
    ]
  }
];

const INITIAL_BOOKINGS = [
  {
    id: "MC-9082",
    hospitalId: "apollo-mumbai",
    hospitalName: "Apollo Hospitals, Navi Mumbai",
    serviceId: "mri",
    serviceName: "MRI Scan",
    price: 6200,
    date: "2026-06-30",
    slot: "03:00 PM - 03:30 PM",
    patientName: "Vinay Kumar",
    patientAge: 45,
    patientGender: "Male",
    status: "Upcoming",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Paid"
  },
  {
    id: "MC-7811",
    hospitalId: "dr-lal-mumbai",
    hospitalName: "Dr. Lal PathLabs Premium, Andheri",
    serviceId: "blood-test",
    serviceName: "Blood Test (Fasting Lipid Profile)",
    price: 499,
    date: "2026-05-12",
    slot: "08:30 AM - 09:00 AM",
    patientName: "Savitri Devi",
    patientAge: 68,
    patientGender: "Female",
    status: "Completed",
    paymentMethod: "UPI (Paytm)",
    paymentStatus: "Paid"
  },
  {
    id: "MC-4512",
    hospitalId: "max-delhi",
    hospitalName: "Max Super Speciality Hospital, Saket",
    serviceId: "ct-scan",
    serviceName: "CT Scan (Chest)",
    price: 5200,
    date: "2026-04-18",
    slot: "05:30 PM - 06:00 PM",
    patientName: "Vinay Kumar",
    patientAge: 45,
    patientGender: "Male",
    status: "Completed",
    paymentMethod: "Credit Card (HDFC)",
    paymentStatus: "Paid"
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/hospital";
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully. Seeding data...");

    // Clear existing data
    await Service.deleteMany({});
    await Hospital.deleteMany({});
    await Booking.deleteMany({});
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await AuditLog.deleteMany({});

    // Seed services
    await Service.insertMany(SERVICES);
    console.log(`Inserted ${SERVICES.length} services.`);

    // Seed hospitals
    await Hospital.insertMany(HOSPITALS);
    console.log(`Inserted ${HOSPITALS.length} hospitals.`);

    // Seed bookings
    await Booking.insertMany(INITIAL_BOOKINGS);
    console.log(`Inserted ${INITIAL_BOOKINGS.length} initial bookings.`);

    // Seed Users with hashed passwords
    const hashedUserPassword = bcrypt.hashSync("SecurePassword123", 12);
    const USERS = [
      {
        email: "vinay.kumar@gmail.com",
        password: hashedUserPassword,
        name: "Vinay Kumar",
        phone: "+91 98765 43210",
        role: "Patient",
        city: "Mumbai",
        pincode: "400001"
      },
      {
        email: "admin.apollo@gmail.com",
        password: hashedUserPassword,
        name: "Apollo Admin",
        phone: "+91 99999 88888",
        role: "HospitalAdmin",
        city: "Mumbai",
        pincode: "400614"
      },
      {
        email: "superadmin@medicompare.com",
        password: hashedUserPassword,
        name: "Super Admin",
        phone: "+91 90000 10000",
        role: "SuperAdmin",
        city: "Delhi NCR",
        pincode: "110001"
      }
    ];
    await User.insertMany(USERS);
    console.log(`Inserted ${USERS.length} secure users.`);

    // Seed Doctors
    const DOCTORS = [
      {
        hospitalId: "apollo-mumbai",
        department: "Radiology",
        name: "Dr. Rajesh Sen",
        experience: 15,
        nextAvailable: "Today, 03:00 PM"
      },
      {
        hospitalId: "apollo-mumbai",
        department: "Pathology",
        name: "Dr. Shalini Mehta",
        experience: 12,
        nextAvailable: "Tomorrow, 09:00 AM"
      },
      {
        hospitalId: "max-delhi",
        department: "Radiology",
        name: "Dr. Amit Vashisht",
        experience: 18,
        nextAvailable: "Tomorrow, 10:00 AM"
      }
    ];
    await Doctor.insertMany(DOCTORS);
    console.log(`Inserted ${DOCTORS.length} doctors.`);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
