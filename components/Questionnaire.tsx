import React, { useState } from 'react';
import { QUESTIONS } from '../data/questionnaireData';
import { Answers, Recommendation } from '../types';
import { getPhoneRecommendation } from '../services/geminiService';

interface QuestionnaireProps {
  onReset: () => void;
}

const ProgressIndicator: React.FC<{ answered: number; total: number }> = ({ answered, total }) => {
  const progressPercent = total > 0 ? (answered / total) * 100 : 0;
  // SVG height is 200, padding is 6 top/bottom, so drawable area is 188
  const fillHeight = 188 * (progressPercent / 100);
  const roundedProgress = Math.round(progressPercent);

  return (
    <div className="hidden md:flex flex-col items-center justify-center p-4">
      <svg width="100" height="200" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="2" y="2" width="96" height="196" rx="18" stroke="#8b5a3c" strokeWidth="4"/>
        <rect x="30" y="10" width="40" height="4" rx="2" fill="#8b5a3c"/>
        <rect id="progress-fill" x="6" y={194 - fillHeight} width="88" height={fillHeight} fill="#a0522d" rx="14" className="transition-all duration-700 ease-in-out"/>
        <text
          x="50"
          y={194 - fillHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="22"
          fontWeight="bold"
          className="transition-opacity duration-300"
          style={{ opacity: progressPercent > 15 ? 1 : 0 }}
        >
          {roundedProgress}%
        </text>
      </svg>
    </div>
  );
};

const MobileProgressIndicator: React.FC<{ answered: number; total: number }> = ({ answered, total }) => {
  const percent = total > 0 ? (answered / total) * 100 : 0;
  return (
    <div className="block md:hidden w-full bg-brand-border rounded-full h-2 mb-6">
      <div className="bg-brand-primary h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
    </div>
  );
};


const Questionnaire: React.FC<QuestionnaireProps> = ({ onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const currentQuestion = QUESTIONS[currentIndex];

  const handleSelectOption = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      alert('Please select an option to continue.');
      return;
    }

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getPhoneRecommendation(answers);
        setRecommendation(result);
      } catch (e: any) {
        setError(e.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const resetQuestionnaire = () => {
    setCurrentIndex(0);
    setAnswers({});
    setRecommendation(null);
    setError(null);
    onReset();
  };

  const isLastQuestion = currentIndex === QUESTIONS.length - 1;
  const answeredCount = Object.values(answers).filter(Boolean).length;

  return (
    <div className="w-full max-w-4xl mx-auto questionnaire-container">
      <div className="bg-brand-card rounded-2xl shadow-2xl p-6 sm:p-8 relative">
        {!recommendation && (
            <button 
                type="button" 
                onClick={resetQuestionnaire}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                aria-label="Close"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
        )}

        {!recommendation ? (
          <>
            <MobileProgressIndicator answered={answeredCount} total={QUESTIONS.length} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 flex flex-col">
                <div id="question-container" className="min-h-[180px] flex-grow">
                  <label className="block text-brand-primary-dark mb-3 font-display font-bold text-xl">
                    {currentQuestion.label}{currentQuestion.required ? ' *' : ''}
                  </label>
                  {currentQuestion.type === 'select' && (
                    <select 
                      id={currentQuestion.id} 
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleSelectOption(currentQuestion.id, e.target.value)}
                      className="custom-select bg-white w-full p-4 border-2 border-brand-border rounded-lg text-base font-body focus:outline-none focus:border-brand-primary"
                    >
                      <option value="" disabled>Select an option</option>
                      {currentQuestion.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                  {currentQuestion.type === 'options' && (
                    <div className="flex flex-col gap-2">
                      {currentQuestion.options.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectOption(currentQuestion.id, opt.value)}
                          className={`p-3.5 px-4 rounded-lg border-2 text-left text-lg font-body transition-colors duration-200 ${answers[currentQuestion.id] === opt.value ? 'border-brand-primary bg-[#fff7f2]' : 'border-brand-border bg-white'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-6 pt-2">
                  <button 
                    type="button" 
                    onClick={handleBack}
                    className={`bg-brand-primary-dark font-body text-white py-2 px-5 rounded-full transition-opacity duration-300 ${currentIndex === 0 || isLoading ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                  >
                    ← Back
                  </button>
                  <div className="flex-1"></div>
                  <button 
                    type="button" 
                    onClick={handleNext}
                    disabled={isLoading}
                    className="bg-brand-primary text-white py-2.5 px-6 rounded-full font-display italic text-lg transition duration-300 hover:bg-brand-primary-dark disabled:bg-gray-400 disabled:cursor-wait"
                  >
                    {isLoading ? 'Thinking...' : (isLastQuestion ? 'Get Recommendation' : 'Next')}
                  </button>
                </div>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
              </div>
              <ProgressIndicator answered={answeredCount} total={QUESTIONS.length} />
            </div>
          </>
        ) : (
          <div id="recommendation-area" className="p-2 animate-fadeInResult">
            <h3 className="text-2xl text-center font-display font-semibold text-brand-primary-dark mb-6 italic">We've Found Your Match!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                  <h4 className="text-3xl font-display font-bold text-brand-text mb-3">{recommendation.phoneName}</h4>
                  <p className="text-brand-text/80 text-lg leading-relaxed font-body">{recommendation.reason}</p>
              </div>
              <div className="w-full max-w-[200px] mx-auto md:max-w-xs md:mx-0 md:justify-self-end">
                <div className="bg-brand-background rounded-xl overflow-hidden shadow-lg border-4 border-white ring-2 ring-brand-border">
                    <img src={recommendation.imageUrl} alt={recommendation.phoneName} className="w-full h-auto" />
                </div>
              </div>
            </div>
             <div className="flex justify-center items-center gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setRecommendation(null)}
                  className="bg-brand-primary-dark font-body text-white py-2 px-5 rounded-full transition duration-300 hover:opacity-90"
                >
                  ← Back to Edit
                </button>
                <button 
                  type="button" 
                  onClick={resetQuestionnaire}
                  className="bg-brand-primary text-white py-2.5 px-6 rounded-full font-display italic text-lg transition duration-300 hover:bg-brand-primary-dark"
                >
                  Start Over
                </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;