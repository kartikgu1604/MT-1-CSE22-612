
const express = require("express");

const app = express();
app.use(express.json());

let students = [];
let nextId = 1;

app.post("/api/students", (req, res) => {
    const { name, course, age } = req.body;

    if (!name || !course || age === undefined || age === null || age === "") {
        return res.status(400).json({ message: "Missing data" });
    }

    if (typeof name !== "string" || typeof course !== "string" || typeof age !== "number" || !Number.isFinite(age) || age <= 0) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const duplicate = students.find(s => s.name.toLowerCase() === name.trim().toLowerCase());

    if (duplicate) {
        return res.status(409).json({ message: "Student name already exists" });
    }

    const student = {
        id: nextId++,
        name: name.trim(),
        course: course.trim(),
        age
    };

    students.push(student);

    res.status(201).json(student);
});

app.get("/api/students", (req, res) => {
    const { course } = req.query;

    if (course) {
        const filtered = students.filter(s => s.course.toLowerCase() === course.toLowerCase());
        return res.status(200).json(filtered);
    }

    res.status(200).json(students);
});

app.get("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!Number.isInteger(id) || id <= 0 || !student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
});

app.put("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, course, age } = req.body;

    const student = students.find(s => s.id === id);

    if (!Number.isInteger(id) || id <= 0 || !student) {
        return res.status(404).json({ message: "Student not found" });
    }

    if (!name || !course || age === undefined || age === null || age === "") {
        return res.status(400).json({ message: "Missing data" });
    }

    if (typeof name !== "string" || typeof course !== "string" || typeof age !== "number" || !Number.isFinite(age) || age <= 0) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const duplicate = students.find(s => s.id !== id && s.name.toLowerCase() === name.trim().toLowerCase());

    if (duplicate) {
        return res.status(409).json({ message: "Student name already exists" });
    }

    student.name = name.trim();
    student.course = course.trim();
    student.age = age;

    res.status(200).json(student);
});

app.delete("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (!Number.isInteger(id) || id <= 0 || index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    const deletedStudent = students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent[0]
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
