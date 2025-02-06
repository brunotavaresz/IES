import React, { useState, useEffect } from 'react';
import 'flowbite'; // Importando Flowbite
import { toast, ToastContainer, Bounce } from 'react-toastify'; // Importando Toastify
import 'react-toastify/dist/ReactToastify.css'; // Estilos do Toastify
import { useNavigate } from 'react-router-dom'; // Importando hook de navegação
import { jwtDecode } from 'jwt-decode';

const AdminReports = () => {

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token || !(jwtDecode(token).role === "ADMIN")) {
            navigate('/home');
        }
    }, []);

    const [reports, setReports] = useState([]);
    const [showAllReports, setShowAllReports] = useState(false);
    const [visibleReports, setVisibleReports] = useState([]);

    // Estado para controlar o Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // Estado para o Modal de Confirmação de Deleção
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);

    const showReportDetails = (report) => {
        setSelectedReport(report);  // Define o relatório selecionado
        setShowModal(true);         // Abre o modal
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedReport(null);
    };

    const openConfirmationModal = (report) => {
        setReportToDelete(report);
        setIsConfirmationModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
        setReportToDelete(null);
    };

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error("Token de autenticação não encontrado");
            }
    
            const response = await fetch('http://localhost:8080/apiV1/admin/getReports', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error("Erro ao buscar relatórios");
            }
    
            const data = await response.json();
            console.log(data); // Adicione este log para verificar a resposta
            setReports(data.data); 
            setVisibleReports(data.data.slice(0, 4)); 
        } catch (error) {
            console.error("Erro ao buscar relatórios:", error);
        }
    };
    

    const dismissReport = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
        
            const response = await fetch('http://localhost:8080/apiV1/admin/removeReport', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reportId: id })
            });
        
            if (!response.ok) {
                throw new Error("Erro ao excluir o relatório");
            }

            toast.success("Report successfully deleted!"); // Mostra a confirmação de sucesso

            fetchReports(); // Atualiza a lista de relatórios
        } catch (error) {
            console.error("Erro ao excluir relatório:", error);
            toast.error("Failed to delete report."); // Mostra uma mensagem de erro
        }
    };

    const confirmDeleteReport = async () => {
        if (reportToDelete) {
            await dismissReport(reportToDelete.reportId);
            closeConfirmationModal();
        }
    };

    const toggleShowReports = () => {
        if (showAllReports) {
            setVisibleReports(reports.slice(0, 4));
        } else {
            setVisibleReports(reports);
        }
        setShowAllReports(!showAllReports);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const formatDate = (date) => {
        const options = {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
        };
        return new Date(date).toLocaleDateString('en-US', options); 
    };

    return (
        <div className="flex justify-center items-center py-12 bg-gray-100 min-h-screen">
            <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-8">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700" style={{ color: "#003366" }}>Report Overview</h2>
                <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                {visibleReports.map((report) => (
                    <div key={report.id} className="max-w-full mb-4 bg-white rounded-lg shadow-lg border p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold text-gray-700">
                                {report.title} 
                                <span className="text-sm text-gray-400 ml-2">({report.beachName})</span>
                            </span>
                            <div className="flex space-x-3">
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-200"
                                    onClick={() => showReportDetails(report)}
                                >
                                    Show details
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-200"
                                    onClick={() => openConfirmationModal(report)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>

                <div className="text-center mt-6">
                    <button
                        onClick={toggleShowReports}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition duration-200"
                    >
                        {showAllReports ? 'Show Less' : 'See Full Report List'}
                    </button>
                </div>
            </div>

            {showModal && selectedReport && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Report Details</h3>
                        <p><strong>Title:</strong> {selectedReport.title}</p>
                        <p><strong>Description:</strong> {selectedReport.description}</p>
                        <p><strong>Date:</strong> {formatDate(selectedReport.date)}</p> 
                        <p><strong>Beach Name:</strong> {selectedReport.beachName}</p>

                        <div className="mt-4 text-right">
                            <button
                                onClick={closeModal}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isConfirmationModalOpen && reportToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Confirm Deletion</h3>
                        <p>Are you sure you want to delete the report titled {reportToDelete.title} from {reportToDelete.beachName}?</p>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={closeConfirmationModal}
                                className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteReport}
                                className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} transition={Bounce}/>
        </div>
    );
};

export default AdminReports;
