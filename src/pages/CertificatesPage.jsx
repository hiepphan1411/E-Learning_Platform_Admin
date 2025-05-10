import { useState } from "react";
import CertificatesTable from "../components/certificates/CertificatesTable";

export default function CertificatesPage() {
  // Replace API fetch with mock data
  const [courses, setCourses] = useState([
    {
      id: 1,
      actor: "John Smith",
      image: "../course-images/javascript.jpg",
      name: "JavaScript Fundamentals",
      category: "Programming - Web Development",
      categoryObject: {
        name: "Web Development",
        field: "Programming",
      },
      price: 29.99,
      date: "2023-09-15",
      statusbar: "Đã duyệt",
      certificate: {
        id: "CERT-JS-001",
        template: "template1",
        requiresCompletion: true
      },
      video_courses: [
        { id: 1, title: "Introduction to JS" },
        { id: 2, title: "Variables and Data Types" },
      ],
      outstanding: true,
    },
    {
      id: 2,
      actor: "Maria Rodriguez",
      image: "../course-images/python.png",
      name: "Python for Beginners",
      category: "Programming - Data Science",
      categoryObject: {
        name: "Data Science",
        field: "Programming",
      },
      price: 39.99,
      date: "2023-08-20",
      statusbar: "Đã duyệt",
      certificate: {
        id: "CERT-PY-002",
        template: "template2",
        requiresCompletion: true
      },
      video_courses: [
        { id: 5, title: "Python Basics" },
        { id: 6, title: "Control Structures" },
      ],
      outstanding: false,
    },
    {
      id: 3,
      actor: "David Johnson",
      image: "../course-images/react.png",
      name: "React Masterclass",
      category: "Programming - Frontend",
      categoryObject: {
        name: "Frontend",
        field: "Programming",
      },
      price: 49.99,
      date: "2023-10-05",
      statusbar: "Chờ duyệt",
      certificate: null,
      video_courses: [
        { id: 9, title: "React Fundamentals" },
        { id: 10, title: "Hooks and State Management" },
      ],
      outstanding: true,
    },
    {
      id: 4,
      actor: "Sarah Lee",
      image: "../course-images/marketing.jpg",
      name: "Digital Marketing Essentials",
      category: "Business - Marketing",
      categoryObject: {
        name: "Marketing",
        field: "Business",
      },
      price: 34.99,
      date: "2023-09-25",
      statusbar: "Đã duyệt",
      certificate: {
        id: "CERT-MKT-003",
        template: "template1",
        requiresCompletion: true
      },
      video_courses: [
        { id: 13, title: "SEO Basics" },
        { id: 14, title: "Social Media Strategy" },
      ],
      outstanding: false,
    },
    {
      id: 5,
      actor: "Michael Wong",
      image: "../avatarAdmin.png",
      name: "UX Design Principles",
      category: "Design - User Experience",
      categoryObject: {
        name: "User Experience",
        field: "Design",
      },
      price: 44.99,
      date: "2023-10-10",
      statusbar: "Chờ duyệt",
      certificate: null,
      video_courses: [
        { id: 17, title: "Design Thinking" },
        { id: 18, title: "Wireframing" },
      ],
      outstanding: false,
    },
  ]);

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <CertificatesTable courses={courses}/>
    </main>
  );
}