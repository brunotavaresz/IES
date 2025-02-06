import WarningCard from "./WarningCard"

export default function SeeWarningModal({ onClose, warnings = [], }) {

    return (
        <div className="relative p-4 w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Beach Warnings
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                        aria-label="Close modal"
                    >
                        <span onClick={onClose} className="sr-only">Close modal</span>
                    </button>
                </div>

                {/* Warning Cards Container */}
                <div className="max-h-[60vh] overflow-y-auto p-4">
                    <div className="flex flex-col space-y-4">
                        {warnings.length > 0 ? (
                            warnings.map((warning, index) => (
                                <WarningCard
                                    key={index}
                                    title={warning.title}
                                    description={warning.description}
                                    date={warning.date}
                                />
                            ))
                        ) : (
                            // Placeholder warnings for development
                            <>
                                
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t dark:border-gray-600 p-4">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    > 
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

