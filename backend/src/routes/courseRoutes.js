
import express from "express";
import prisma from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";
import upload from "../lib/upload.js";

const router = express.Router();

// Upload an image buffer to Cloudinary
const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });
};

// ==========================================
// GET /api/courses
// Fetch all courses with instructor details
// ==========================================
router.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("Fetch courses error:", error);

    return res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
});

// ==========================================
// POST /api/courses
// Create a course and upload its images
// ==========================================
router.post(
  "/",
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "instructorImage", maxCount: 1 },
  ]),
  async (req, res) => {
    let uploadedCourseImage;
    let uploadedInstructorImage;

    try {
      const {
        title,
        category,
        level,
        duration,
        price,
        description,
        status,
        releaseDate,
        imageUrl,
        icon,
        color,
        instructorId,
        instructorName,
        instructorTitle,
      } = req.body;

      // Validate required course fields
      if (
        !title?.trim() ||
        !category?.trim() ||
        !level?.trim() ||
        !duration?.trim() ||
        price === undefined ||
        price === null ||
        price === "" ||
        !description?.trim()
      ) {
        return res.status(400).json({
          message: "Please provide all required course fields",
        });
      }

      // Validate price
      const numericPrice = Number(price);

      if (
        !Number.isFinite(numericPrice) ||
        numericPrice < 0 ||
        !/^\d+(\.\d{1,2})?$/.test(String(price).trim())
      ) {
        return res.status(400).json({
          message:
            "Price must be a valid number with up to 2 decimal places",
        });
      }

      // Validate status
      const allowedStatuses = ["Draft", "Published", "Upcoming"];

      if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid course status",
        });
      }

      // Validate release date
      let parsedReleaseDate;

      if (releaseDate) {
        parsedReleaseDate = new Date(releaseDate);

        if (Number.isNaN(parsedReleaseDate.getTime())) {
          return res.status(400).json({
            message: "Invalid release date",
          });
        }
      }

      // Validate instructor details when creating a new instructor
      if (!instructorId && (instructorName || instructorTitle)) {
        if (!instructorName?.trim() || !instructorTitle?.trim()) {
          return res.status(400).json({
            message: "Instructor name and title are required",
          });
        }
      }

      const courseImageFile = req.files?.courseImage?.[0];
      const instructorImageFile = req.files?.instructorImage?.[0];

      // Upload course image
      if (courseImageFile) {
        uploadedCourseImage = await uploadToCloudinary(
          courseImageFile,
          "mycode-academy/courses"
        );
      }

      // Upload instructor profile image
      if (instructorImageFile) {
        uploadedInstructorImage = await uploadToCloudinary(
          instructorImageFile,
          "mycode-academy/instructors"
        );
      }

      // Prepare course data
      const courseData = {
        title: title.trim(),
        category: category.trim(),
        level: level.trim(),
        duration: duration.trim(),
        price: numericPrice,
        description: description.trim(),
        status: status || "Draft",
        releaseDate: parsedReleaseDate,
        imageUrl: uploadedCourseImage?.secure_url || imageUrl || null,
        icon: icon || null,
        color: color || null,
      };

      // Connect an existing instructor or create a new one
      if (instructorId) {
        courseData.instructor = {
          connect: { id: instructorId },
        };

        // Update the existing instructor's photo if a new one was uploaded
        if (uploadedInstructorImage) {
          await prisma.instructor.update({
            where: { id: instructorId },
            data: {
              imageUrl: uploadedInstructorImage.secure_url,
            },
          });
        }
      } else if (instructorName || instructorTitle) {
        if (!instructorName?.trim() || !instructorTitle?.trim()) {
          return res.status(400).json({
            message: "Instructor name and title are required",
          });
        }

        courseData.instructor = {
          create: {
            name: instructorName.trim(),
            title: instructorTitle.trim(),
            imageUrl: uploadedInstructorImage?.secure_url || null,
          },
        };
      } else if (uploadedInstructorImage) {
        return res.status(400).json({
          message: "Provide instructor name and title for the uploaded photo",
        });
      }

      const course = await prisma.course.create({
        data: courseData,
        include: {
          instructor: true,
        },
      });

      return res.status(201).json({
        message: "Course created successfully",
        course,
      });
    } catch (error) {
      console.error("Create course error:", error);

      // Remove uploaded files from Cloudinary if course creation fails
      const uploadedFiles = [
        uploadedCourseImage,
        uploadedInstructorImage,
      ].filter(Boolean);

      await Promise.all(
        uploadedFiles.map((file) =>
          cloudinary.uploader
            .destroy(file.public_id)
            .catch((cleanupError) => {
              console.error("Cloudinary cleanup error:", cleanupError);
            })
        )
      );

      return res.status(500).json({
        message: "Failed to create course or upload images",
      });
    }
  }
);

export default router;
