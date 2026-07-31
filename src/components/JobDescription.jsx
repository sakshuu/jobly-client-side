import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id,
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const completion = user?.profile?.profileCompletion || 0;
  const stars = user?.profile?.stars || 1;
  const isEligible = completion >= 70 && stars >= 3;

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    if (!isEligible) {
        toast.error(`Your profile is only ${completion}% complete (${stars} Stars). Please complete at least 70% of your profile (with mandatory LinkedIn) and earn 3+ stars to apply!`);
        return;
    }

    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true },
      );

      if (res.data.success) {
        setIsApplied(true); // Update local state
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to apply for job.");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id,
            ),
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      {/* Eligibility Callout Banner */}
      {!isApplied && (
        <div className={`p-4 rounded-xl mb-6 border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
            <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 mt-0.5 ${isEligible ? 'text-emerald-600' : 'text-amber-600'}`} />
                <div>
                    <h3 className="font-bold text-sm">
                        {isEligible ? '✅ You are Eligible to Apply for this Job!' : '⚠️ Profile Incomplete - Job Application Locked'}
                    </h3>
                    <p className="text-xs mt-1">
                        Your profile is <strong>{completion}% complete</strong> with <strong>{stars}/5 Stars</strong>. 
                        {isEligible 
                          ? ' Recruiters love your complete profile rank!' 
                          : ' Candidates must complete at least 70% of their profile (including mandatory LinkedIn) and reach 3+ Stars to apply.'}
                    </p>
                </div>
            </div>
            {!isEligible && (
                <Link to="/profile">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs whitespace-nowrap">
                        Complete Profile Now (70%+)
                    </Button>
                </Link>
            )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>
          <div className="flex items-center gap-2 mt-4">
            <Badge className={"text-blue-700 font-bold"} variant="ghost">
              {singleJob?.position || singleJob?.postion} Positions
            </Badge>
            <Badge className={"text-[#F83002] font-bold"} variant="ghost">
              {singleJob?.jobType}
            </Badge>
            <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>

        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied || (!isEligible && !isApplied)}
          className={`rounded-lg ${
            isApplied 
              ? "bg-gray-600 cursor-not-allowed" 
              : !isEligible 
                ? "bg-gray-400 cursor-not-allowed opacity-80" 
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already Applied" : !isEligible ? "Complete Profile to Apply (70%+)" : "Apply Now"}
        </Button>
      </div>

      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
        Job Description
      </h1>
      <div className="my-4 space-y-2">
        <h1 className="font-bold my-1">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experienceLevel || singleJob?.experience} yrs
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary} LPA
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.applications?.length}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.createdAt?.split("T")[0]}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default JobDescription;
