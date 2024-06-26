import mongoose from "mongoose";

const subHeadingSchema = mongoose.Schema(
  {
    subHeading: {
      type: String,
      required: true,
    },
    altHeading: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const headingSchema = mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    subHeading: [subHeadingSchema],
  },
  { timestamps: true }
);

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    includes: {
      type: String,
      required: true,
    },
    modules: {
      type: String,
      required: true,
    },
    rightAudience: {
      type: String,
      required: true,
    },
    // content: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Content",
    //   required: true,
    // },
    content: {
      heading: [headingSchema],
      // type: String,
      // required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
