import React, { useEffect, useState } from "react";
import { useGetCourseByIdQuery } from "../../redux/api/coursesApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useParams } from "react-router";
import moment from "moment";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { GrLanguage } from "react-icons/gr";
import { MdDateRange } from "react-icons/md";
import { FaCircle, FaFirefox } from "react-icons/fa";
import { useGetLatestCoursesQuery } from "../../redux/api/coursesApiSlice";
import CourseCard from "./CourseCard";
import { IoIosArrowDown } from "react-icons/io";
import VideoPopup from "../../components/VideoPopup";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bought, setBought] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoText, setVideoText] = useState("");
  const { data: course, isLoading, isError } = useGetCourseByIdQuery(id);
  const {
    data: latestCourses,
    isLoading: latestCoursesLoading,
    isError: latestCoursesError,
    error,
  } = useGetLatestCoursesQuery();

  useEffect(() => {
    if (localStorage.getItem(`bought-${id}`)) {
      setBought(true);
      setShowButton(false);
    }
  }, []);

  const handleVideoClick = (videoUrl, videoText) => {
    setVideoUrl(videoUrl);
    setVideoText(videoText);
    setShowVideo(true);
  };

  const boughtHandler = () => {
    setBought(true);
    setShowButton(false);
    localStorage.setItem(`bought-${id}`, true);
    toast.success("You succcessfully bought the course");
  };

  return (
    <div className="text-white ">
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="error">Error Occurred</Message>
      ) : (
        <div className="flex justify-between">
          <div>
            <div className="border-b-2">
              <div className="mt-[5rem] ml-[8rem] w-6/12">
                <h1 className="text-5xl font-bold py-6">{course.name}</h1>
                <h2 className="text-xl font-bold mb-4">{course.title}</h2>
                <h3 className="mb-4">Created By {course.teacherName}</h3>
                <div className="flex gap-[10rem] mb-[2rem]">
                  <h3 className="flex flex-col gap-1">
                    <span className="flex items-center gap-[0.3rem]">
                      <MdDateRange />
                      Created At:{" "}
                      {moment(course.createdAt).format("MMM D, YYYY")}
                    </span>
                    <span className="flex items-center gap-[0.3rem]">
                      <GrLanguage />
                      English
                    </span>
                  </h3>
                  <h3 className="pb-5 flex flex-col gap-1">
                    <span className="flex items-center gap-[0.3rem]">
                      <MdDateRange />
                      Last Updated:{" "}
                      {moment(course.updatedAt).format("MMM D, YYYY")}
                    </span>
                    <span className="flex items-center gap-[0.3rem]">
                      <FaFirefox />
                      {course.tags}
                    </span>
                  </h3>
                </div>
              </div>
            </div>
            {/* <div className="border-2 p-5 mt-[5rem] ml-[8rem] w-6/12 bg-gradient-to-b from-indigo-800 via-pink-800 to-purple-800"> */}
            <div className="border-2 p-5 mt-[5rem] ml-[8rem] w-6/12">
              <h2 className="text-3xl font-bold mb-5">What you'll learn ?</h2>
              <h2 className="grid grid-cols-2 gap-5">
                {course.modules.split(".").map((module, index) => (
                  <div key={index} className="flex gap-[0.3rem]">
                    <h2>&#9989;</h2>
                    <h2>{module}.</h2>
                  </div>
                ))}
              </h2>
            </div>
            <div className="p-5 mt-[5rem] ml-[8rem] w-6/12 border-2">
              <h2 className="text-3xl font-bold mb-5">Course content</h2>
              <div>
                <div className="p-5">
                  {course.content.heading.map((item, index) => {
                    const accordionOpened = activeIndex === index;
                    return (
                      <div
                        key={index}
                        className={`flex ${
                          index == 0 ? "border-2" : "border-2 border-t-0"
                        } border-2 p-5`}
                      >
                        <div className="flex flex-col">
                          <div className="flex">
                            <IoIosArrowDown
                              className={`text-xl cursor-pointer mr-1 ml-1 duration-150 ease-in-out ${
                                accordionOpened ? "rotate-180" : ""
                              }`}
                            />
                            <div
                              onClick={() =>
                                setActiveIndex(
                                  activeIndex === index ? null : index
                                )
                              }
                              className="cursor-pointer"
                            >
                              <div>{item.heading}</div>
                            </div>
                          </div>
                          <div>
                            {accordionOpened && (
                              <div className="mt-5">
                                {item.subHeading.map((it, ind) => (
                                  <div
                                    key={ind}
                                    className="cursor-pointer mt-1"
                                  >
                                    <button
                                      onClick={() =>
                                        handleVideoClick(
                                          it.subHeading,
                                          it.altHeading
                                        )
                                      }
                                    >
                                      {it.altHeading}
                                    </button>
                                    {showVideo && (
                                      <VideoPopup
                                        setShowVideo={setShowVideo}
                                        linkText={videoUrl}
                                        altHeading={videoText}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="border-2 p-5 mt-[5rem] ml-[8rem] w-6/12">
              <h2 className="text-3xl font-bold mb-5">Requirements</h2>
              <h2 className="grid gap-2">
                {course.requirements.split(".").map((requirement, index) => (
                  <div key={index} className="flex gap-[0.3rem]">
                    <h2 className=" text-[0.5rem] mt-[0.5rem] mr-[0.2rem]">
                      <FaCircle />
                    </h2>
                    <h2>{requirement}.</h2>
                  </div>
                ))}
              </h2>
            </div>
            <div className="border-2 p-5 mt-[5rem] ml-[8rem] w-6/12">
              <h2 className="text-3xl font-bold mb-5">Description</h2>
              <h2 className="grid gap-2">
                {course.description.split(".").map((desc, index) => (
                  <div key={index} className="flex gap-[0.3rem]">
                    <h2 className=" text-[0.5rem] mt-[0.5rem] mr-[0.2rem]">
                      <FaCircle />
                    </h2>
                    <h2>{desc}.</h2>
                  </div>
                ))}
              </h2>
            </div>
            <div className="border-2 p-5 mt-[5rem] ml-[8rem] w-6/12">
              <h2 className="text-3xl font-bold mb-5">
                Who this course is for?
              </h2>
              <h2 className="grid gap-2">
                {course.rightAudience.split(".").map((ra, index) => (
                  <div key={index} className="flex gap-[0.3rem]">
                    <h2 className=" text-[0.5rem] mt-[0.5rem] mr-[0.2rem]">
                      <FaCircle />
                    </h2>
                    <h2>{ra}.</h2>
                  </div>
                ))}
              </h2>
            </div>
            <div className="m-10">
              <h1 className="mb-5 text-3xl font-bold">Recommendations</h1>
              <div className="grid grid-cols-4 gap-10">
                {latestCoursesLoading ? (
                  <Loader />
                ) : latestCoursesError ? (
                  <Message variant="error">{error?.data}</Message>
                ) : (
                  latestCourses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))
                )}
              </div>
            </div>
          </div>
          <Modal
            image={course.image}
            price={course.price}
            includes={course.includes}
            boughtHandler={boughtHandler}
            showButton={showButton}
          />
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
