import { BanknoteArrowUp } from 'lucide-react';

export default function Invoice({ id }: { id: string }) {

  const downloadInvoice = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/orders/orderInvoice/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <h2>Download the invoice PDF:</h2>

      <button
        onClick={downloadInvoice}
        className="cursor-pointer flex items-center gap-2 bg-blue-100 px-2 py-0.5 rounded-3xl text-blue-800"
      >
        <BanknoteArrowUp />
        Invoice
      </button>
    </div>
  );
}
