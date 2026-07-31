import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('basic');

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        bio: "",
        skills: "",
        linkedin: "",
        github: "",
        portfolio: "",
        twitter: "",
        file: null
    });

    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [projects, setProjects] = useState([]);
    const [certifications, setCertifications] = useState([]);

    useEffect(() => {
        if (user) {
            setInput({
                fullname: user.fullname || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                bio: user?.profile?.bio || "",
                skills: user?.profile?.skills?.join(", ") || "",
                linkedin: user?.profile?.socialLinks?.linkedin || "",
                github: user?.profile?.socialLinks?.github || "",
                portfolio: user?.profile?.socialLinks?.portfolio || "",
                twitter: user?.profile?.socialLinks?.twitter || "",
                file: null
            });
            setExperience(user?.profile?.experience || []);
            setEducation(user?.profile?.education || []);
            setProjects(user?.profile?.projects || []);
            setCertifications(user?.profile?.certifications || []);
        }
    }, [user, open]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    // Experience handlers
    const addExperience = () => {
        setExperience([...experience, { title: "", company: "", location: "", startDate: "", endDate: "", description: "" }]);
    };
    const removeExperience = (index) => {
        setExperience(experience.filter((_, i) => i !== index));
    };
    const handleExperienceChange = (index, field, value) => {
        const updated = [...experience];
        updated[index][field] = value;
        setExperience(updated);
    };

    // Education handlers
    const addEducation = () => {
        setEducation([...education, { degree: "", institution: "", fieldOfStudy: "", startYear: "", endYear: "", grade: "" }]);
    };
    const removeEducation = (index) => {
        setEducation(education.filter((_, i) => i !== index));
    };
    const handleEducationChange = (index, field, value) => {
        const updated = [...education];
        updated[index][field] = value;
        setEducation(updated);
    };

    // Projects handlers
    const addProject = () => {
        setProjects([...projects, { title: "", description: "", link: "", technologies: "" }]);
    };
    const removeProject = (index) => {
        setProjects(projects.filter((_, i) => i !== index));
    };
    const handleProjectChange = (index, field, value) => {
        const updated = [...projects];
        updated[index][field] = value;
        setProjects(updated);
    };

    // Certifications handlers
    const addCertification = () => {
        setCertifications([...certifications, { title: "", issuer: "", year: "", link: "" }]);
    };
    const removeCertification = (index) => {
        setCertifications(certifications.filter((_, i) => i !== index));
    };
    const handleCertificationChange = (index, field, value) => {
        const updated = [...certifications];
        updated[index][field] = value;
        setCertifications(updated);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!input.linkedin || input.linkedin.trim() === "") {
            toast.error("LinkedIn link is mandatory to achieve 70%+ profile completion!");
        }

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);

        formData.append("socialLinks", JSON.stringify({
            linkedin: input.linkedin,
            github: input.github,
            portfolio: input.portfolio,
            twitter: input.twitter
        }));

        formData.append("experience", JSON.stringify(experience));
        formData.append("education", JSON.stringify(education));
        formData.append("projects", JSON.stringify(projects));
        formData.append("certifications", JSON.stringify(certifications));

        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">Update Professional Profile</DialogTitle>
                </DialogHeader>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 gap-2 mb-4 overflow-x-auto pb-1">
                    <Button
                        type="button"
                        variant={activeTab === 'basic' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('basic')}
                        className="text-xs sm:text-sm"
                    >
                        Basic & Resume
                    </Button>
                    <Button
                        type="button"
                        variant={activeTab === 'social' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('social')}
                        className="text-xs sm:text-sm"
                    >
                        Social Links (LinkedIn*)
                    </Button>
                    <Button
                        type="button"
                        variant={activeTab === 'experience' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('experience')}
                        className="text-xs sm:text-sm"
                    >
                        Experience ({experience.length})
                    </Button>
                    <Button
                        type="button"
                        variant={activeTab === 'education' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('education')}
                        className="text-xs sm:text-sm"
                    >
                        Education ({education.length})
                    </Button>
                    <Button
                        type="button"
                        variant={activeTab === 'projects' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('projects')}
                        className="text-xs sm:text-sm"
                    >
                        Projects & Certs
                    </Button>
                </div>

                <form onSubmit={submitHandler} className="space-y-4">
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right text-xs font-semibold">Name</Label>
                                <Input id="name" name="fullname" type="text" value={input.fullname} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right text-xs font-semibold">Email</Label>
                                <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="number" className="text-right text-xs font-semibold">Phone</Label>
                                <Input id="number" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="bio" className="text-right text-xs font-semibold">Bio</Label>
                                <Input id="bio" name="bio" value={input.bio} onChange={changeEventHandler} placeholder="e.g. Passionate Full Stack Developer" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="skills" className="text-right text-xs font-semibold">Skills</Label>
                                <Input id="skills" name="skills" value={input.skills} onChange={changeEventHandler} placeholder="React, Node.js, Python, SQL" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="file" className="text-right text-xs font-semibold">Resume PDF</Label>
                                <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx" onChange={fileChangeHandler} className="col-span-3" />
                            </div>
                        </div>
                    )}

                    {/* Social Links Tab */}
                    {activeTab === 'social' && (
                        <div className="space-y-3">
                            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                                📌 <strong>LinkedIn profile is mandatory</strong> to reach the 70% profile completeness requirement for job applications.
                            </p>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="linkedin" className="text-right text-xs font-bold text-blue-700">LinkedIn *</Label>
                                <Input id="linkedin" name="linkedin" value={input.linkedin} onChange={changeEventHandler} placeholder="https://linkedin.com/in/yourprofile" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="github" className="text-right text-xs font-semibold">GitHub</Label>
                                <Input id="github" name="github" value={input.github} onChange={changeEventHandler} placeholder="https://github.com/yourusername" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="portfolio" className="text-right text-xs font-semibold">Portfolio</Label>
                                <Input id="portfolio" name="portfolio" value={input.portfolio} onChange={changeEventHandler} placeholder="https://yourportfolio.com" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="twitter" className="text-right text-xs font-semibold">Twitter/X</Label>
                                <Input id="twitter" name="twitter" value={input.twitter} onChange={changeEventHandler} placeholder="https://x.com/yourhandle" className="col-span-3" />
                            </div>
                        </div>
                    )}

                    {/* Experience Tab */}
                    {activeTab === 'experience' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-700">Professional Work Experience</span>
                                <Button type="button" size="sm" onClick={addExperience} variant="outline" className="gap-1 text-xs">
                                    <Plus className="w-3.5 h-3.5" /> Add Experience
                                </Button>
                            </div>
                            {experience.length === 0 ? (
                                <p className="text-xs text-gray-500 italic text-center py-4">No experience entries added. Click above to add.</p>
                            ) : (
                                experience.map((exp, idx) => (
                                    <div key={idx} className="p-3 border rounded-xl bg-gray-50/70 space-y-2 relative">
                                        <button type="button" onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Job Title (e.g. Frontend Intern)" value={exp.title} onChange={(e) => handleExperienceChange(idx, 'title', e.target.value)} />
                                            <Input placeholder="Company Name" value={exp.company} onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Input placeholder="Location" value={exp.location} onChange={(e) => handleExperienceChange(idx, 'location', e.target.value)} />
                                            <Input placeholder="Start Date (e.g. Jan 2023)" value={exp.startDate} onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)} />
                                            <Input placeholder="End Date (e.g. Dec 2023 or Present)" value={exp.endDate} onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)} />
                                        </div>
                                        <Input placeholder="Brief Description of achievements" value={exp.description} onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)} />
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Education Tab */}
                    {activeTab === 'education' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-700">Education Details</span>
                                <Button type="button" size="sm" onClick={addEducation} variant="outline" className="gap-1 text-xs">
                                    <Plus className="w-3.5 h-3.5" /> Add Education
                                </Button>
                            </div>
                            {education.length === 0 ? (
                                <p className="text-xs text-gray-500 italic text-center py-4">No education entries added. Click above to add.</p>
                            ) : (
                                education.map((edu, idx) => (
                                    <div key={idx} className="p-3 border rounded-xl bg-gray-50/70 space-y-2 relative">
                                        <button type="button" onClick={() => removeEducation(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Degree (e.g. B.Tech Computer Science)" value={edu.degree} onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)} />
                                            <Input placeholder="Institution / University" value={edu.institution} onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Input placeholder="Field of Study" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(idx, 'fieldOfStudy', e.target.value)} />
                                            <Input placeholder="Start Year" value={edu.startYear} onChange={(e) => handleEducationChange(idx, 'startYear', e.target.value)} />
                                            <Input placeholder="End Year" value={edu.endYear} onChange={(e) => handleEducationChange(idx, 'endYear', e.target.value)} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Projects & Certifications Tab */}
                    {activeTab === 'projects' && (
                        <div className="space-y-6">
                            {/* Projects */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-700">Key Projects</span>
                                    <Button type="button" size="sm" onClick={addProject} variant="outline" className="gap-1 text-xs">
                                        <Plus className="w-3.5 h-3.5" /> Add Project
                                    </Button>
                                </div>
                                {projects.map((proj, idx) => (
                                    <div key={idx} className="p-3 border rounded-xl bg-gray-50/70 space-y-2 relative">
                                        <button type="button" onClick={() => removeProject(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Project Title" value={proj.title} onChange={(e) => handleProjectChange(idx, 'title', e.target.value)} />
                                            <Input placeholder="Project URL Link" value={proj.link} onChange={(e) => handleProjectChange(idx, 'link', e.target.value)} />
                                        </div>
                                        <Input placeholder="Technologies Used (e.g. React, MongoDB)" value={proj.technologies} onChange={(e) => handleProjectChange(idx, 'technologies', e.target.value)} />
                                        <Input placeholder="Project Summary" value={proj.description} onChange={(e) => handleProjectChange(idx, 'description', e.target.value)} />
                                    </div>
                                ))}
                            </div>

                            {/* Certifications */}
                            <div className="space-y-3 border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-700">Certifications & Achievements</span>
                                    <Button type="button" size="sm" onClick={addCertification} variant="outline" className="gap-1 text-xs">
                                        <Plus className="w-3.5 h-3.5" /> Add Certification
                                    </Button>
                                </div>
                                {certifications.map((cert, idx) => (
                                    <div key={idx} className="p-3 border rounded-xl bg-gray-50/70 space-y-2 relative">
                                        <button type="button" onClick={() => removeCertification(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Certification Title" value={cert.title} onChange={(e) => handleCertificationChange(idx, 'title', e.target.value)} />
                                            <Input placeholder="Issuing Organization" value={cert.issuer} onChange={(e) => handleCertificationChange(idx, 'issuer', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Year Obtained" value={cert.year} onChange={(e) => handleCertificationChange(idx, 'year', e.target.value)} />
                                            <Input placeholder="Verification Link" value={cert.link} onChange={(e) => handleCertificationChange(idx, 'link', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="pt-4 border-t">
                        {loading ? (
                            <Button className="w-full" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Profile...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">
                                Save & Update Profile
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;