import { useEffect, useState } from "react";
import CertificatesTable from "../components/certificates/CertificatesTable";

export default function CertificatesPage() {
      const [courses, setCourses] = useState([]);
        // Fetch dữ liệu từ API
        useEffect(() => {
          fetch("http://localhost:5000/api/all-data/courses")
            .then((res) => {
              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }
              return res.json();
            })
            .then((data) => {
              const formattedData = data.map((course) => ({
                id: course.id || course._id,
                actor: course.actor || "Unknown",
                image: course.image || course.cover_image || "../avatarAdmin.png",
                name: course.name || "Untitled Course",
                category: course.category
                  ? typeof course.category === "object"
                    ? `${course.category.field} - ${course.category.name}`
                    : course.category
                  : "Uncategorized",
                categoryObject: course.category || {
                  name: "Uncategorized",
                  field: "Other",
                },
                price: course.price || 0,
                date: course.date
                  ? new Date(course.date).toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0],
                statusbar: course.statusbar || "Chờ duyệt",
                certificate: course.certificate || null,
                video_courses: course.video_courses || [],
                outstanding: course.outstanding || false,
      
                _original: course,
              }));
              setCourses(formattedData);
            })
            .catch((err) => {
              console.error("fetch() error:", err);
            });
        }, []);
    return (
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <CertificatesTable courses={courses}/>
        </main>
    )
}