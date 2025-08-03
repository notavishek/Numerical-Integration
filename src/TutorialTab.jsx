import { tutorialContent } from "./Constants";

const TutorialTab = ({ tutorialSection, setTutorialSection }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-4">
          <h3 className="font-semibold mb-4 text-gray-800">Tutorial Sections</h3>
          <div className="space-y-2">
            {Object.entries(tutorialContent).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setTutorialSection(key)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  tutorialSection === key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/70 text-gray-700 hover:bg-white/90'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-3">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {tutorialContent[tutorialSection].title}
          </h2>
          <div className="prose prose-lg max-w-none">
            <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {tutorialContent[tutorialSection].content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TutorialTab;