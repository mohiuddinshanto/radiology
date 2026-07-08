# Radiology Task & Annotation App - Frontend

Next.js এবং TypeScript দিয়ে তৈরি একটি আধুনিক Web Application, যা টাস্ক ম্যানেজমেন্ট এবং ইমেজ অ্যানোটেশন ফিচার প্রদান করে।

## Features
- **Authentication:** JWT ভিত্তিক রিয়েল অথেন্টিকেশন।
- **Kanban Board:** তারিখ অনুযায়ী টাস্ক ম্যানেজমেন্ট, ড্র্যাগ-এন্ড-ড্রপ সাপোর্ট।
- **Annotation Studio:** ইমেজে পলিগন ড্র, এডিট, রিমুভ এবং সেভ করার সুবিধা।
- **UX:** Tailwind CSS এবং Framer Motion দিয়ে তৈরি নান্দনিক ইন্টারফেস।

## Technical Challenges & Solutions (Villains Faced)
- **Hydration Mismatch:** Next.js-এ ক্লায়েন্ট সাইড স্টেট ম্যানেজমেন্টের সময় এই সমস্যাটি ফেস করেছি, যা `mounted` স্টেট এবং `useEffect` ব্যবহার করে সমাধান করেছি।
- **CORS Error:** ব্যাকএন্ড এবং ফ্রন্টএন্ড কানেক্ট করার সময় CORS পলিসি জনিত সমস্যা হয়েছিল, যা Django-তে `corsheaders` কনফিগার করে ফিক্স করেছি।
- **State Sync:** টাস্কের ডাটা রিয়েল-টাইমে আপডেট করার জন্য `Zustand` ব্যবহার করেছি, যা কোডকে ক্লিন ও মডুলার রেখেছে।

## Setup Instructions
1. `npm install` দিয়ে ডিপেন্ডেন্সি ইনস্টল করুন।
2. `.env.local` ফাইলে ব্যাকএন্ডের API URL সেট করুন।
3. `npm run dev` দিয়ে অ্যাপটি চালু করুন।

## Demo User
- **Email:** demo@404project.io
- **Password:** demo1234