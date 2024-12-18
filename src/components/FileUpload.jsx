import React from 'react';
import { Upload, FileJson, FileSpreadsheet, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const FileUpload = ({ 
  file, 
  onFileChange, 
  onFileRemove, 
  onConvert, 
  loading,
  validationError,
  validationStatus,
  previewData 
}) => {
  return (
    <div className="space-y-4">
      {!file && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".csv,.json"
            onChange={onFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drop your file here or click to upload
            </p>
            <p className="text-xs text-gray-500">
              Supports CSV and JSON files
            </p>
          </label>
        </div>
      )}
      
      {file && (
        <>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded">
            <div className="flex items-center">
              {file.name.endsWith('.csv') ? (
                <FileSpreadsheet className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <FileJson className="h-5 w-5 text-blue-500 mr-2" />
              )}
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              {validationStatus === 'valid' && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {validationStatus === 'invalid' && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onFileRemove}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {validationError && (
            <Alert variant="destructive" className="flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <AlertTitle className="font-semibold text-red-900">Error</AlertTitle>
                <AlertDescription className="text-red-800">
                  {validationError}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {validationStatus === 'valid' && (
            <Button
              onClick={onConvert}
              disabled={loading}
              className="w-full"
              variant="default"
            >
              {loading ? 'Converting...' : 'Convert'}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default FileUpload;