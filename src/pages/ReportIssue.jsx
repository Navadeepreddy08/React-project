import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Droplets, Zap, Waves, Map, Loader2 } from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { COMPLAINT_CATEGORIES, URGENCY_LEVELS } from '../utils/dummyData';

const iconMap = {
  Droplets, Zap, Waves, Map, AlertCircle
};

const ReportIssue = () => {
  const navigate = useNavigate();
  const { addComplaint } = useComplaints();
  
  const [step, setStep] = useState(1);
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    imageBefore: null,
    location: null,
    description: '',
    urgency: 'medium'
  });

  const [generatedId, setGeneratedId] = useState(null);

  const fileInputRef = useRef(null);

  const handleCategorySelect = (id) => {
    setFormData({ ...formData, category: id });
    setStep(2);
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageBefore: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = () => {
    setIsLoadingLoc(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          setIsLoadingLoc(false);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get location. Please enable location services.");
          setIsLoadingLoc(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLoadingLoc(false);
    }
  };

  const handleSubmit = () => {
    const newId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newComplaint = {
      id: newId,
      ...formData,
      imageAfter: null,
      status: 'pending',
      supportCount: 1,
      createdAt: new Date().toISOString(),
      // Mock location if user didn't provide one to avoid breaking the map
      location: formData.location || { lat: 28.6139 + (Math.random() - 0.5) * 0.01, lng: 77.2090 + (Math.random() - 0.5) * 0.01 }
    };

    addComplaint(newComplaint);
    setGeneratedId(newId);
    setStep(5); // Success step
  };

  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="text-xl font-bold mb-4 text-slate-800">What is the issue?</h2>
      <div className="grid grid-cols-2 gap-4">
        {COMPLAINT_CATEGORIES.map(cat => {
          const Icon = iconMap[cat.icon] || AlertCircle;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-3 hover:border-emerald-500 hover:shadow-md transition-all active:scale-95"
            >
              <div className={`p-4 rounded-full ${cat.color}`}>
                <Icon size={32} />
              </div>
              <span className="font-semibold text-slate-700">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Add a Photo & Location</h2>
      
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <label className="block font-medium text-slate-700 mb-3">1. Take a Photo</label>
        {formData.imageBefore ? (
          <div className="relative rounded-xl overflow-hidden h-48 mb-4">
            <img src={formData.imageBefore} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={() => setFormData({...formData, imageBefore: null})}
              className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-red-500"
            >
              <AlertCircle size={20} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl h-40 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors mb-4"
          >
            <Camera size={40} className="mb-2 text-slate-400" />
            <span className="font-medium">Tap to open camera</span>
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment"
          className="hidden" 
          ref={fileInputRef}
          onChange={handleImageCapture}
        />
        
        <label className="block font-medium text-slate-700 mb-3 mt-6">2. Set Location</label>
        <button 
          onClick={getLocation}
          disabled={isLoadingLoc}
          className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors ${
            formData.location 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
              : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
          }`}
        >
          {isLoadingLoc ? (
            <Loader2 size={20} className="animate-spin" />
          ) : formData.location ? (
            <><CheckCircle size={20} /> Location Saved</>
          ) : (
            <><MapPin size={20} /> Get Current Location</>
          )}
        </button>
      </div>

      <button 
        onClick={() => setStep(3)}
        disabled={!formData.imageBefore && !formData.location}
        className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 active:scale-95 transition-transform"
      >
        Next Step <ChevronRight size={20} />
      </button>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Additional Details</h2>
      
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-5">
        <div>
          <label className="block font-medium text-slate-700 mb-3">How urgent is this?</label>
          <div className="grid grid-cols-3 gap-2">
            {URGENCY_LEVELS.map(level => (
              <button
                key={level.id}
                onClick={() => setFormData({...formData, urgency: level.id})}
                className={`py-2 px-1 rounded-lg text-sm font-medium border-2 transition-colors ${
                  formData.urgency === level.id 
                    ? level.color.replace('bg-', 'border-').split(' ')[0] + ' bg-' + level.color.split(' ')[0].split('-')[1] + '-50'
                    : 'border-slate-100 text-slate-500 bg-slate-50'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-3">Description (Optional)</label>
          <textarea 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Tell us more about the problem..."
            className="w-full border border-slate-200 rounded-xl p-3 h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none bg-slate-50"
          />
        </div>
      </div>

      <button 
        onClick={() => setStep(4)}
        className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        Review Complaint <ChevronRight size={20} />
      </button>
    </motion.div>
  );

  const renderStep4 = () => {
    const categoryInfo = COMPLAINT_CATEGORIES.find(c => c.id === formData.category) || COMPLAINT_CATEGORIES[4];
    const urgencyInfo = URGENCY_LEVELS.find(u => u.id === formData.urgency);
    const Icon = iconMap[categoryInfo.icon] || AlertCircle;

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800">Review & Submit</h2>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {formData.imageBefore && (
            <img src={formData.imageBefore} alt="Issue" className="w-full h-48 object-cover" />
          )}
          
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className={`p-3 rounded-full ${categoryInfo.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Category</p>
                <p className="font-bold text-slate-800">{categoryInfo.label}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Urgency</p>
                <span className={`px-2 py-1 text-xs font-bold rounded-md ${urgencyInfo.color}`}>
                  {urgencyInfo.label}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Location</p>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-1">
                  <MapPin size={16} className="text-emerald-500"/> 
                  {formData.location ? 'Saved' : 'Not set'}
                </span>
              </div>
            </div>

            {formData.description && (
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Description</p>
                <p className="text-slate-800 text-sm">{formData.description}</p>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 active:scale-95 transition-transform text-lg"
        >
          Submit Complaint
        </button>
      </motion.div>
    );
  };

  const renderStep5 = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
        <CheckCircle size={48} />
      </div>
      
      <div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Issue Reported!</h2>
        <p className="text-slate-500 px-4">Your complaint has been successfully registered with the village council.</p>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-xl w-full max-w-xs shadow-sm">
        <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1">Tracking ID</p>
        <p className="text-2xl font-mono font-bold text-slate-800 tracking-widest">{generatedId}</p>
      </div>

      <div className="w-full space-y-3 pt-6">
        <button 
          onClick={() => navigate('/track')}
          className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl"
        >
          Track Status
        </button>
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-emerald-50 text-emerald-700 font-bold py-4 rounded-xl"
        >
          Back to Home
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 pb-10">
      {step < 5 && (
        <div className="flex items-center mb-6">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
            className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
          <div className="flex-1 flex justify-center gap-2 px-4">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${
                  i <= step ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </AnimatePresence>
    </div>
  );
};

export default ReportIssue;
