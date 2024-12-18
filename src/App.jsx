import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import ConversionHistory from './components/ConversionHistory';
import DataPreview from './components/DataPreview';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Download } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [convertedData, setConvertedData] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';
  
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/conversions/history`);
      const data = await response.json();
      setConversionHistory(data.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const validateFile = async (file) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const content = e.target.result;
      
      try {
        if (file.name.endsWith('.json')) {
          // Validar JSON
          const data = JSON.parse(content);
          if (!Array.isArray(data)) {
            throw new Error('JSON must be an array of objects');
          }
          if (!data.length) {
            throw new Error('JSON array is empty');
          }
          setPreviewData(data);
          setValidationStatus('valid');
          setValidationError(null);
        } else {
          // Validar CSV
          const lines = content.split('\n');
          if (lines.length < 2) {
            throw new Error('CSV must have headers and at least one row');
          }
          const headers = lines[0].split(',');
          const previewData = lines.slice(1, 11).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index]?.trim() || '';
              return obj;
            }, {});
          });
          setPreviewData(previewData);
          setValidationStatus('valid');
          setValidationError(null);
        }
      } catch (error) {
        setValidationStatus('invalid');
        setValidationError(error.message);
        setPreviewData(null);
      }
    };

    reader.readAsText(file);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      validateFile(selectedFile);
      setConvertedData(null);
      setDownloadUrl(null);
      setServerError(null); // Limpiar errores previos
      setSuccessMessage(null);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setValidationStatus(null);
    setValidationError(null);
    setPreviewData(null);
    setConvertedData(null);
    setDownloadUrl(null);
    setServerError(null);
    setSuccessMessage(null);
  };

  const handleConvert = async () => {
    if (!file || validationStatus !== 'valid') return;

    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    setServerError(null);
    setSuccessMessage(null);
    
    try {
      const endpoint = file.name.endsWith('.csv') 
        ? `${API_BASE_URL}/api/v1/convert/csv-to-json`
        : `${API_BASE_URL}/api/v1/convert/json-to-csv`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Conversion failed');
      }

      if (file.name.endsWith('.csv')) {
        // CSV a JSON
        const result = await response.json();
        setConvertedData(result.data);
        const jsonContent = JSON.stringify(result.data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        setDownloadUrl(URL.createObjectURL(blob));
      } else {
        // JSON a CSV
        const csvContent = await response.text();
        setConvertedData(csvContent.split('\n').slice(1).map(line => {
          const values = line.split(',');
          return csvContent.split('\n')[0].split(',').reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim() || '';
            return obj;
          }, {});
        }));
        const blob = new Blob([csvContent], { type: 'text/csv' });
        setDownloadUrl(URL.createObjectURL(blob));
      }
      
      setSuccessMessage('Conversion completed successfully!');
      // Limpia el mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000);
      
      fetchHistory();
    } catch (error) {
      console.error('Error:', error);
      setServerError(error.message || 'Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `converted.${file.name.endsWith('.csv') ? 'json' : 'csv'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>File Converter</CardTitle>
          <CardDescription>Convert between CSV and JSON formats easily</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload 
            file={file}
            onFileChange={handleFileChange}
            onFileRemove={handleFileRemove}
            onConvert={handleConvert}
            loading={loading}
            validationError={validationError}
            validationStatus={validationStatus}
          />

          {previewData && (
            <DataPreview 
              data={previewData} 
              title="Input Preview" 
            />
          )}

          {convertedData && (
            <>
              <DataPreview 
                data={convertedData} 
                title="Conversion Result" 
              />
              <div className="mt-4 flex justify-center">
                <Button onClick={handleDownload} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download Converted File</span>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Conversion History</CardTitle>
          <CardDescription>Recent file conversions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <ConversionHistory history={conversionHistory} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;