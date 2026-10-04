// Step-by-step guides. Rules change — every guide shows a "verify on the official
// site" notice, and each step links to the official source where one exists.

export const GUIDES = [
  {
    id: "noc",
    title: { en: "MoEST No Objection Certificate (NOC)", ne: "शिक्षा मन्त्रालयको NOC" },
    summary: {
      en: "Needed by most students going abroad, especially for bank transfers of fees and foreign exchange. Confirm whether it applies to your destination.",
      ne: "विदेश पढ्न जाने अधिकांश विद्यार्थीलाई शुल्क बैंकबाट पठाउन र विदेशी मुद्राका लागि आवश्यक पर्छ।",
    },
    steps: [
      {
        id: "noc-1",
        title: { en: "Create an account on the NOC portal", ne: "NOC पोर्टलमा खाता खोल्नुहोस्" },
        body: {
          en: "Register on the official MoEST NOC portal with your details and a working email address.",
          ne: "आफ्नो विवरण र इमेल प्रयोग गरी आधिकारिक पोर्टलमा दर्ता गर्नुहोस्।",
        },
        docs: ["Citizenship certificate (scan)", "Passport-size photo"],
        url: "https://noc.moest.gov.np",
        days: 1,
        feeNpr: 0,
      },
      {
        id: "noc-2",
        title: { en: "Upload offer letter and academic documents", ne: "भर्ना पत्र र शैक्षिक कागजात अपलोड गर्नुहोस्" },
        body: {
          en: "Upload your admission/offer letter, previous transcripts and character certificate as clear PDFs.",
          ne: "भर्ना पत्र, ट्रान्सक्रिप्ट र चारित्रिक प्रमाणपत्र स्पष्ट PDF मा अपलोड गर्नुहोस्।",
        },
        docs: ["Offer / admission letter", "Transcripts", "Character certificate", "Language test result (if any)"],
        days: 2,
        feeNpr: 0,
      },
      {
        id: "noc-3",
        title: { en: "Pay the processing fee", ne: "प्रशोधन शुल्क तिर्नुहोस्" },
        body: {
          en: "Pay the processing fee online through the payment options offered on the portal. Keep the receipt.",
          ne: "पोर्टलमा दिइएका भुक्तानी विकल्पबाट शुल्क तिर्नुहोस् र रसिद राख्नुहोस्।",
        },
        docs: ["Payment receipt"],
        days: 1,
        feeNpr: 2000,
      },
      {
        id: "noc-4",
        title: { en: "Wait for verification", ne: "प्रमाणीकरणको प्रतीक्षा गर्नुहोस्" },
        body: {
          en: "The ministry reviews your documents. Check the portal and your email; respond quickly if corrections are requested.",
          ne: "मन्त्रालयले कागजात जाँच गर्छ। सुधार माग भएमा छिटो जवाफ दिनुहोस्।",
        },
        docs: [],
        days: 5,
        feeNpr: 0,
      },
      {
        id: "noc-5",
        title: { en: "Download and print the NOC", ne: "NOC डाउनलोड र प्रिन्ट गर्नुहोस्" },
        body: {
          en: "Download the approved NOC. Keep digital and printed copies for your bank and travel.",
          ne: "स्वीकृत NOC डाउनलोड गरी बैंक र यात्राका लागि प्रतिहरू राख्नुहोस्।",
        },
        docs: [],
        days: 1,
        feeNpr: 0,
      },
    ],
  },
  {
    id: "india-arrival",
    title: { en: "Arriving in India (Bangalore / Delhi)", ne: "भारत आगमन (बैंगलोर / दिल्ली)" },
    summary: {
      en: "Nepali citizens don't need a visa for India, but you'll still need ID for college admission, a SIM card and your PG agreement.",
      ne: "नेपाली नागरिकलाई भारत जान भिसा चाहिँदैन, तर भर्ना, SIM र PG सम्झौताका लागि परिचयपत्र चाहिन्छ।",
    },
    steps: [
      {
        id: "in-1",
        title: { en: "Carry the right ID", ne: "सही परिचयपत्र बोक्नुहोस्" },
        body: {
          en: "Carry your passport (strongly recommended) plus citizenship certificate. Keep several photocopies and passport photos.",
          ne: "राहदानी र नागरिकता प्रमाणपत्र बोक्नुहोस्। फोटोकपी र फोटो धेरै राख्नुहोस्।",
        },
        docs: ["Passport", "Citizenship certificate", "8–10 passport photos"],
        days: 0,
        feeNpr: 0,
      },
      {
        id: "in-2",
        title: { en: "Get a local SIM card", ne: "स्थानीय SIM लिनुहोस्" },
        body: {
          en: "Visit an official Airtel, Jio or Vi store. Foreign-national KYC usually needs your passport, a local address proof and sometimes a local reference contact. Requirements vary by store, so bring everything.",
          ne: "आधिकारिक Airtel, Jio वा Vi स्टोर जानुहोस्। राहदानी, स्थानीय ठेगानाको प्रमाण र कहिलेकाहीँ स्थानीय सम्पर्क चाहिन्छ।",
        },
        docs: ["Passport", "PG/hostel address letter", "Local reference phone number"],
        days: 1,
        feeNpr: 0,
      },
      {
        id: "in-3",
        title: { en: "Sign a written PG / hostel agreement", ne: "PG / होस्टेलको लिखित सम्झौता गर्नुहोस्" },
        body: {
          en: "Get the rent, deposit, food timings and notice period in writing. Photograph the room before moving in to protect your deposit.",
          ne: "भाडा, धरौटी, खानाको समय र सूचना अवधि लिखित रूपमा लिनुहोस्।",
        },
        docs: ["Rent agreement", "Deposit receipt"],
        days: 2,
        feeNpr: 0,
      },
      {
        id: "in-4",
        title: { en: "Check registration requirements with your college", ne: "कलेजसँग दर्ता आवश्यकता बुझ्नुहोस्" },
        body: {
          en: "Nepali citizens are generally exempt from FRRO registration, but some colleges, hostels or local police ask for foreign-student details. Ask your college's international office what they need.",
          ne: "नेपाली नागरिक सामान्यतया FRRO दर्ताबाट छुट छन्, तर कलेज वा होस्टेलले विवरण माग्न सक्छ। अन्तर्राष्ट्रिय कार्यालयमा सोध्नुहोस्।",
        },
        docs: ["College bona fide certificate"],
        url: "https://indianfrro.gov.in",
        days: 1,
        feeNpr: 0,
      },
      {
        id: "in-5",
        title: { en: "Open a bank account & set up UPI", ne: "बैंक खाता खोलेर UPI चलाउनुहोस्" },
        body: {
          en: "Many banks open accounts for Nepali students with a passport and college letter. UPI payments make daily life much easier.",
          ne: "राहदानी र कलेजको पत्रबाट धेरै बैंकले खाता खोलिदिन्छन्। UPI ले दैनिक भुक्तानी सजिलो बनाउँछ।",
        },
        docs: ["Passport", "College letter", "Address proof"],
        days: 3,
        feeNpr: 0,
      },
    ],
  },
  {
    id: "pre-departure",
    title: { en: "Pre-departure checklist (abroad)", ne: "प्रस्थान अघिको चेकलिस्ट (विदेश)" },
    summary: {
      en: "For Australia, Canada, UK, USA and Japan — the essentials to finish before you fly.",
      ne: "अस्ट्रेलिया, क्यानडा, बेलायत, अमेरिका र जापान जानेका लागि आवश्यक तयारी।",
    },
    steps: [
      {
        id: "pd-1",
        title: { en: "Accept offer & get CoE / CAS / I-20 / LOA", ne: "अफर स्वीकार गरी CoE / CAS / I-20 / LOA लिनुहोस्" },
        body: {
          en: "Pay the deposit your university asks for and receive the official enrolment document your visa needs.",
          ne: "विश्वविद्यालयले माग गरेको धरौटी तिरेर भिसाका लागि आवश्यक कागजात लिनुहोस्।",
        },
        docs: ["Offer letter", "Deposit receipt"],
        days: 14,
        feeNpr: 0,
      },
      {
        id: "pd-2",
        title: { en: "Prepare financial documents", ne: "आर्थिक कागजात तयार गर्नुहोस्" },
        body: {
          en: "Bank balance certificate, education loan sanction letter and income sources. Use the Parents page to prepare a budget summary for the bank.",
          ne: "बैंक ब्यालेन्स प्रमाणपत्र, ऋण स्वीकृति पत्र र आम्दानीका स्रोत तयार गर्नुहोस्।",
        },
        docs: ["Bank balance certificate", "Loan sanction letter", "Income source documents"],
        days: 10,
        feeNpr: 0,
      },
      {
        id: "pd-3",
        title: { en: "Apply for your student visa", ne: "विद्यार्थी भिसाको आवेदन दिनुहोस्" },
        body: {
          en: "Apply only through the official government visa website of your destination country. Book biometrics early in peak months.",
          ne: "गन्तव्य देशको आधिकारिक सरकारी वेबसाइटबाट मात्र आवेदन दिनुहोस्।",
        },
        docs: ["Passport", "Enrolment document", "Financial documents", "Health insurance"],
        days: 30,
        feeNpr: 0,
      },
      {
        id: "pd-4",
        title: { en: "Arrange health insurance", ne: "स्वास्थ्य बीमा मिलाउनुहोस्" },
        body: {
          en: "Australia requires OSHC; UK uses the Immigration Health Surcharge; US and Canadian universities usually enrol you in a mandatory plan.",
          ne: "अस्ट्रेलियामा OSHC, बेलायतमा IHS; अमेरिका र क्यानडाका विश्वविद्यालयले प्रायः अनिवार्य बीमा दिन्छन्।",
        },
        docs: ["Insurance certificate"],
        days: 2,
        feeNpr: 0,
      },
      {
        id: "pd-5",
        title: { en: "Register with the Nepali embassy / community", ne: "नेपाली दूतावास / समुदायमा सम्पर्क राख्नुहोस्" },
        body: {
          en: "Save your nearest Nepali embassy's contact and join the university's Nepali student association for airport pickup and housing help.",
          ne: "नजिकको नेपाली दूतावासको सम्पर्क राख्नुहोस् र नेपाली विद्यार्थी संघमा जोडिनुहोस्।",
        },
        docs: [],
        days: 1,
        feeNpr: 0,
      },
    ],
  },
];
