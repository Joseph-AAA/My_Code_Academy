import express from "express";
import prisma from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";
import upload from "../lib/upload.js";

const router = express.Router();

//************************************** Upload an image buffer to Cloudinary *****************
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
//******************************** Fetch all courses with instructor details *********************
// ==========================================
// router.get("/", async (req, res) => {
//   try {
//     const courses = await prisma.course.findMany({
//       include: {
//         instructor: true,
//       },
//       orderBy: {
//         createdAt: "desc",   // newest course first / asc => oldest course first
//       },
//     });

//     return res.status(200).json({
//       message: "Courses fetched successfully",
//       courses,
//     });
//   } catch (error) {
//     console.error("Fetch courses error:", error);

//     return res.status(500).json({
//       message: "Failed to fetch courses",
//     });
//   }
// });

//******************************** Fetch 6 courses/page for admin *********************
    router.get("/", async (req, res) => {
      try {
        // 1. Pagination
        const page = Math.max(
          1,
          Number.parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
          100,
          Math.max(1, Number.parseInt(req.query.limit, 10) || 6)
        );

        const skip = (page - 1) * limit;

        // 2. Read filters and sorting from the request
        const {
          status,
          category,
          level,
          priceRange,
          search,
          sortBy,
        } = req.query;

        // 3. Build the database filters
        const where = {};

        if (status) {
          where.status = status;
        }

        if (category) {
          where.category = category;
        }

        if (level) {
          where.level = level;
        }

        if (search?.trim()) {
          where.OR = [
            {
              title: {
                contains: search.trim(),
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: search.trim(),
                mode: "insensitive",
              },
            },
          ];
        }

        // 4. Price range
        if (priceRange === "0-500") {
          where.price = {
            gte: 0,
            lte: 500,
          };
        } else if (priceRange === "500-1000") {
          where.price = {
            gt: 500,
            lte: 1000,
          };
        } else if (priceRange === "1000+") {
          where.price = {
            gt: 1000,
          };
        }

        // 5. Sorting
        let orderBy = { createdAt: "desc" };

        if (sortBy === "oldest") {
          orderBy = { createdAt: "asc" };
        } else if (sortBy === "price") {
          orderBy = { price: "asc" };
        }

        // 6. Filter and count BEFORE pagination
        const [courses, totalCourses] = await prisma.$transaction([
          prisma.course.findMany({
            where,
            skip,
            take: limit,
            include: {
              instructor: true,
            },
            orderBy,
          }),

          prisma.course.count({
            where,
          }),
        ]);

        // 7. Return results and pagination information
        return res.status(200).json({
          message: "Courses fetched successfully",
          courses,
          currentPage: page,
          totalPages: Math.ceil(totalCourses / limit),
          totalCourses,
        });
      } catch (error) {
        console.error("Fetch courses error:", error);

        return res.status(500).json({
          message: "Failed to fetch courses",
        });
      }
    });


//*************************************** */ GET /api/courses/stats ******************************/
router.get("/stats", async (req, res) => {
   try {
        const [totalCourses, publishedCourses, draftCourses, upcomingCourses] =
          await Promise.all([
            prisma.course.count(),
            prisma.course.count({
              where: { status: "Published" },
            }),
            prisma.course.count({
              where: { status: "Draft" },
            }),
            prisma.course.count({
              where: { status: "Upcoming" },
            }),
          ]);

        return res.status(200).json({
          totalCourses,
          publishedCourses,
          draftCourses,
          upcomingCourses,
        });
      } catch (error) {
        console.error("Fetch course statistics error:", error);

        return res.status(500).json({
          message: "Failed to fetch course statistics",
        });
      }
});

//******************************** Fetch 6 courses/page for publicCourse page *********************

    router.get("/public", async (req, res) => {
      try {
        const page = Math.max(
          1,
          Number.parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
          100,
          Math.max(1, Number.parseInt(req.query.limit, 10) || 6)
        );

        const skip = (page - 1) * limit;

        const [courses, totalCourses] = await prisma.$transaction([
          prisma.course.findMany({
            where: { status: "Published" },
            skip,
            take: limit,
            include: { instructor: true },
            orderBy: { createdAt: "desc" },
          }),
          prisma.course.count({
            where: { status: "Published" },
          }),
        ]);

        return res.status(200).json({
          message: "Published courses fetched successfully",
          courses,
          currentPage: page,
          totalPages: Math.ceil(totalCourses / limit),
          totalCourses,
        });
      } catch (error) {
        console.error("Fetch public courses error:", error);

        return res.status(500).json({
          message: "Failed to fetch published courses",
        });
      }
    });
// ==========================================
// POST /api/courses
//*************************************** Create a course and upload its images ****************
// ==========================================
router.post( "/", upload.fields([
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

//************************************ Validate required course fields ******************
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

//************************************************* Validate price ************************
    
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

//********************************************** Validate status *****************************

      const allowedStatuses = ["Draft", "Published", "Upcoming"];

      if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid course status",
        });
      }

//********************************************* Validate release date *************************
      let parsedReleaseDate;

      if (releaseDate) {
        parsedReleaseDate = new Date(releaseDate);

        if (Number.isNaN(parsedReleaseDate.getTime())) {
          return res.status(400).json({
            message: "Invalid release date",
          });
        }
      }

//***************************** Validate instructor details when creating a new instructor *****

      if (!instructorId && (instructorName || instructorTitle)) {
        if (!instructorName?.trim() || !instructorTitle?.trim()) {
          return res.status(400).json({
            message: "Instructor name and title are required",
          });
        }
      }

      const courseImageFile = req.files?.courseImage?.[0];
      const instructorImageFile = req.files?.instructorImage?.[0];

//***************************************** Upload course image *******************************
      if (courseImageFile) {
        uploadedCourseImage = await uploadToCloudinary(
          courseImageFile,
          "mycode-academy/courses"
        );
      }

//************************************** Upload instructor profile image **********************
      if (instructorImageFile) {
        uploadedInstructorImage = await uploadToCloudinary(
          instructorImageFile,
          "mycode-academy/instructors"
        );
      }

//****************************************** Prepare course data *******************************
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

//****************************  Connect an existing instructor or create a new one *************
      if (instructorId) {
        courseData.instructor = {
          connect: { id: instructorId },
        };

//********************  Update the existing instructor's photo if a new one was uploaded *******

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
      } 
      // else if (uploadedInstructorImage) {
      //   return res.status(400).json({
      //     message: "Provide instructor name and title for the uploaded photo",
      //   });
      // }

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

//******************* Remove uploaded files from Cloudinary if course creation fails **********

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


//************************************************** DELETE a course **************************
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check whether the course exists
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Delete the course from the database
    await prisma.course.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return res.status(500).json({
      message: "Failed to delete course",
    });
  }
});



 // ==========================================
 // PUT /api/courses/:id
 // Update an existing course
 // ==========================================
router.put(
  "/:id",
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "instructorImage", maxCount: 1 },
  ]),
  async (req, res) => {
    let uploadedCourseImage;
    let uploadedInstructorImage;

    try {
      const { id } = req.params;

      const {
        title,
        category,
        level,
        duration,
        price,
        description,
        status,
        releaseDate,
        icon,
        color,
        instructorName,
        instructorTitle,
      } = req.body;

      // 1. Check whether the course exists
      const existingCourse = await prisma.course.findUnique({
        where: { id },
        include: { instructor: true },
      });

      if (!existingCourse) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // 2. Validate required fields
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

      // 3. Validate price
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

      // 4. Validate status
      const allowedStatuses = ["Draft", "Published", "Upcoming"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid course status",
        });
      }

      // 5. Validate release date
      let parsedReleaseDate = null;

      if (releaseDate) {
        parsedReleaseDate = new Date(releaseDate);

        if (Number.isNaN(parsedReleaseDate.getTime())) {
          return res.status(400).json({
            message: "Invalid release date",
          });
        }
      }

      const courseImageFile = req.files?.courseImage?.[0];
      const instructorImageFile = req.files?.instructorImage?.[0];

      // 6. Upload replacement course image, if selected
      if (courseImageFile) {
        uploadedCourseImage = await uploadToCloudinary(
          courseImageFile,
          "mycode-academy/courses"
        );
      }

      // 7. Upload replacement instructor image, if selected
      if (instructorImageFile) {
        uploadedInstructorImage = await uploadToCloudinary(
          instructorImageFile,
          "mycode-academy/instructors"
        );
      }

      // 8. Update instructor details, if provided
      const hasInstructorDetails =
        Boolean(instructorName?.trim()) ||
        Boolean(instructorTitle?.trim()) ||
        Boolean(instructorImageFile);

      let instructorRelation;

      if (existingCourse.instructorId) {
        if (hasInstructorDetails) {
          const instructorData = {};

          if (instructorName?.trim()) {
            instructorData.name = instructorName.trim();
          }

          if (instructorTitle?.trim()) {
            instructorData.title = instructorTitle.trim();
          }

          if (uploadedInstructorImage) {
            instructorData.imageUrl =
              uploadedInstructorImage.secure_url;
          }

          await prisma.instructor.update({
            where: { id: existingCourse.instructorId },
            data: instructorData,
          });
        }
      } else if (hasInstructorDetails) {
        if (!instructorName?.trim() || !instructorTitle?.trim()) {
          return res.status(400).json({
            message: "Instructor name and title are required",
          });
        }

        instructorRelation = {
          create: {
            name: instructorName.trim(),
            title: instructorTitle.trim(),
            imageUrl: uploadedInstructorImage?.secure_url || null,
          },
        };
      }

      // 9. Prepare updated course fields
      const courseData = {
        title: title.trim(),
        category: category.trim(),
        level: level.trim(),
        duration: duration.trim(),
        price: numericPrice,
        description: description.trim(),
        status,
        releaseDate: parsedReleaseDate,
        icon: icon || null,
        color: color || null,
      };

      // Keep the existing image if no replacement was uploaded
      if (uploadedCourseImage) {
        courseData.imageUrl = uploadedCourseImage.secure_url;
      }

      if (instructorRelation) {
        courseData.instructor = instructorRelation;
      }

      // 10. Save the updated course
      const updatedCourse = await prisma.course.update({
        where: { id },
        data: courseData,
        include: { instructor: true },
      });

      return res.status(200).json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (error) {
      console.error("Update course error:", error);

      // Clean up newly uploaded images if the operation fails
      const uploadedFiles = [
        uploadedCourseImage,
        uploadedInstructorImage,
      ].filter(Boolean);

      await Promise.all(
        uploadedFiles.map((file) =>
          cloudinary.uploader.destroy(file.public_id).catch((cleanupError) => {
            console.error("Cloudinary cleanup error:", cleanupError);
          })
        )
      );

      return res.status(500).json({
        message: "Failed to update course",
      });
    }
  }
);

export default router;
