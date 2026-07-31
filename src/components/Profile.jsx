import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Linkedin, Github, Globe, Twitter, Star, Clock, Briefcase, GraduationCap, Code2, Award, FileText, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    const completion = user?.profile?.profileCompletion || 0;
    const stars = user?.profile?.stars || 1;
    const isEligible = completion >= 70 && stars >= 3;
    const socialLinks = user?.profile?.socialLinks || {};

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <Navbar />
            
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-6 p-8 shadow-sm'>
                {/* Top Profile Header */}
                <div className='flex flex-col md:flex-row md:items-start justify-between gap-6'>
                    <div className='flex items-center gap-6'>
                        <Avatar className="h-24 w-24 border-2 border-[#6A38C2]/20 shadow">
                            <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className='font-bold text-2xl text-gray-900'>{user?.fullname}</h1>
                                <Badge className="bg-[#6A38C2] text-white capitalize">{user?.role}</Badge>
                            </div>
                            <p className='text-gray-600 mt-1 max-w-lg'>{user?.profile?.bio || "No bio added yet."}</p>
                            
                            {/* Relative Update Timestamp */}
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Profile updated {getRelativeTime(user?.updatedAt)}</span>
                            </div>
                        </div>
                    </div>

                    <Button onClick={() => setOpen(true)} className="flex items-center gap-2" variant="outline">
                        <Pen className="w-4 h-4" /> Edit Profile
                    </Button>
                </div>

                {/* Profile Completeness & Star Rating Bar */}
                <div className="mt-8 p-4 rounded-xl border border-gray-100 bg-gray-50/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                        <div>
                            <span className="text-sm font-semibold text-gray-700">Profile Completeness Score</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-2xl font-extrabold text-[#6A38C2]">{completion}%</span>
                                {isEligible ? (
                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Eligible to Apply
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Ineligible (Need 70%+ & 3★)
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Star Rating Badge */}
                        <div className="flex flex-col items-start sm:items-end">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate Rank</span>
                            <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((starIndex) => (
                                    <Star
                                        key={starIndex}
                                        className={`w-5 h-5 ${
                                            starIndex <= stars
                                                ? 'text-amber-400 fill-amber-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                                <span className="ml-1 text-sm font-bold text-gray-700">({stars}/5 Stars)</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                                isEligible ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                            }`}
                            style={{ width: `${completion}%` }}
                        />
                    </div>
                    {!isEligible && (
                        <p className="text-xs text-amber-700 mt-2 font-medium">
                            💡 Recruiters prioritize complete profiles! Add mandatory LinkedIn, experience, skills, and projects to hit 70%+ and unlock job applications.
                        </p>
                    )}
                </div>

                {/* Contact & Social Links Header */}
                <div className='my-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-6'>
                    <div className="space-y-2">
                        <div className='flex items-center gap-3 text-gray-700 text-sm'>
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 text-gray-700 text-sm'>
                            <Contact className="w-4 h-4 text-gray-500" />
                            <span>{user?.phoneNumber}</span>
                        </div>
                    </div>

                    {/* Social Media Links Header */}
                    <div className="flex flex-wrap items-center gap-3">
                        {socialLinks?.linkedin ? (
                            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                <Badge className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 py-1 px-3 cursor-pointer">
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </Badge>
                            </a>
                        ) : (
                            <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 gap-1.5 py-1 px-3">
                                <Linkedin className="w-4 h-4 text-amber-600" /> LinkedIn (Mandatory Required)
                            </Badge>
                        )}

                        {socialLinks?.github && (
                            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                                <Badge variant="secondary" className="gap-1.5 py-1 px-3 cursor-pointer bg-gray-800 text-white hover:bg-gray-900">
                                    <Github className="w-4 h-4" /> GitHub
                                </Badge>
                            </a>
                        )}

                        {socialLinks?.portfolio && (
                            <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                                <Badge variant="outline" className="gap-1.5 py-1 px-3 cursor-pointer border-purple-300 text-purple-700 hover:bg-purple-50">
                                    <Globe className="w-4 h-4" /> Portfolio
                                </Badge>
                            </a>
                        )}

                        {socialLinks?.twitter && (
                            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                <Badge variant="outline" className="gap-1.5 py-1 px-3 cursor-pointer border-sky-300 text-sky-700 hover:bg-sky-50">
                                    <Twitter className="w-4 h-4" /> Twitter
                                </Badge>
                            </a>
                        )}
                    </div>
                </div>

                {/* Skills Section */}
                <div className='my-6 border-t border-gray-100 pt-6'>
                    <h2 className='font-bold text-[#1a1a1a] text-md mb-3 flex items-center gap-2'>
                        🛠️ Skills & Expertise
                    </h2>
                    <div className='flex items-center flex-wrap gap-2'>
                        {user?.profile?.skills && user.profile.skills.length > 0 ? (
                            user.profile.skills.map((item, index) => (
                                <Badge key={index} className="bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200 px-3 py-1 text-sm font-medium">
                                    {item}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-gray-500 italic">No skills added yet.</span>
                        )}
                    </div>
                </div>

                {/* Professional Experience Section */}
                <div className='my-6 border-t border-gray-100 pt-6'>
                    <h2 className='font-bold text-md mb-4 flex items-center gap-2 text-gray-900'>
                        <Briefcase className="w-5 h-5 text-[#6A38C2]" /> Professional Experience
                    </h2>
                    {user?.profile?.experience && user.profile.experience.length > 0 ? (
                        <div className="space-y-4">
                            {user.profile.experience.map((exp, index) => (
                                <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                                            <p className="text-sm font-medium text-[#6A38C2]">{exp.company} {exp.location && `• ${exp.location}`}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">
                                            {exp.startDate} - {exp.endDate || 'Present'}
                                        </span>
                                    </div>
                                    {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No experience details added.</p>
                    )}
                </div>

                {/* Education Section */}
                <div className='my-6 border-t border-gray-100 pt-6'>
                    <h2 className='font-bold text-md mb-4 flex items-center gap-2 text-gray-900'>
                        <GraduationCap className="w-5 h-5 text-[#6A38C2]" /> Education
                    </h2>
                    {user?.profile?.education && user.profile.education.length > 0 ? (
                        <div className="space-y-4">
                            {user.profile.education.map((edu, index) => (
                                <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</h3>
                                            <p className="text-sm text-gray-600">{edu.institution}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">
                                            {edu.startYear} - {edu.endYear || 'Present'}
                                        </span>
                                    </div>
                                    {edu.grade && <p className="text-xs text-gray-500 mt-1">Grade/CGPA: {edu.grade}</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No education details added.</p>
                    )}
                </div>

                {/* Projects Section */}
                <div className='my-6 border-t border-gray-100 pt-6'>
                    <h2 className='font-bold text-md mb-4 flex items-center gap-2 text-gray-900'>
                        <Code2 className="w-5 h-5 text-[#6A38C2]" /> Projects
                    </h2>
                    {user?.profile?.projects && user.profile.projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.profile.projects.map((proj, index) => (
                                <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{proj.title}</h3>
                                        <p className="text-xs text-gray-600 mt-1">{proj.description}</p>
                                        {proj.technologies && (
                                            <p className="text-xs text-purple-700 font-medium mt-2">Tech: {proj.technologies}</p>
                                        )}
                                    </div>
                                    {proj.link && (
                                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-medium hover:underline mt-3 inline-block">
                                            View Project ↗
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No projects added yet.</p>
                    )}
                </div>

                {/* Certifications Section */}
                <div className='my-6 border-t border-gray-100 pt-6'>
                    <h2 className='font-bold text-md mb-4 flex items-center gap-2 text-gray-900'>
                        <Award className="w-5 h-5 text-[#6A38C2]" /> Certifications & Achievements
                    </h2>
                    {user?.profile?.certifications && user.profile.certifications.length > 0 ? (
                        <div className="space-y-3">
                            {user.profile.certifications.map((cert, index) => (
                                <div key={index} className="flex items-center justify-between border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-900">{cert.title}</h3>
                                        <p className="text-xs text-gray-500">{cert.issuer} {cert.year && `• ${cert.year}`}</p>
                                    </div>
                                    {cert.link && (
                                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-medium">
                                            Verify ↗
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No certifications added yet.</p>
                    )}
                </div>

                {/* Resume Section */}
                <div className='my-6 border-t border-gray-100 pt-6'>
                    <Label className="text-md font-bold flex items-center gap-2 mb-2 text-gray-900">
                        <FileText className="w-5 h-5 text-[#6A38C2]" /> Attached Resume
                    </Label>
                    {user?.profile?.resume ? (
                        <a
                            target='_blank'
                            rel='noreferrer'
                            href={user.profile.resume}
                            className='inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium bg-blue-50 px-4 py-2 rounded-lg border border-blue-200'
                        >
                            <FileText className="w-4 h-4" />
                            {user?.profile?.resumeOriginalName || "Download Resume PDF"}
                        </a>
                    ) : (
                        <span className="text-sm text-gray-500 italic">No resume file uploaded yet.</span>
                    )}
                </div>
            </div>

            {/* Applied Jobs History */}
            <div className='max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
                <h1 className='font-bold text-lg my-3 text-gray-900'>Applied Jobs History</h1>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile