import { Link } from 'react-router-dom';

export default function BeachCard({ name, description, image, beachId }) {
    // Função para truncar texto
    const truncateText = (text, limit) => {
        if (text.length <= limit) return text;
        return text.slice(0, limit) + '...';
    };

    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
            {/* Use Link para navegação */}
            <Link to={`/beach-conditions/${beachId}`} className="block">
                <img
                    className="w-full h-48 object-cover rounded-lg"
                    src={image}
                    alt={name}
                />
            </Link>
            <div className="flex items-start pt-5">
                {/* Torna o nome da praia clicável */}
                <Link to={`/beach-conditions/${beachId}`} className="text-lg font-medium text-gray-900 dark:text-gray-300">
                    {truncateText(name, 20)}
                </Link>
                <Link to={`/beach-conditions/${beachId}`} className="ms-auto text-lg text-gray-700 hover:underline dark:text-blue-500">
                    stats
                </Link>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="fill-gray-500 pt-0.5">
                    <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                </svg>
            </div>
            <Link to={`/beach-conditions/${beachId}`} className="ms-auto text-lg text-gray-800 hover:underline dark:text-blue-500 line-clamp-2">
                {truncateText(description, 100)}
            </Link>
        </div>
    );
}
