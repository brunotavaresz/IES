function WarningCard({ title, description, date }) {
    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                </div>
                <time className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(date).toLocaleDateString()}
                </time>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
                {description}
            </p>
        </div>
    )
}

export default WarningCard