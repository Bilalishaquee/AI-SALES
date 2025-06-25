import Document from '../models/Document.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file path (ES modules equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all documents for the current user
export const getDocuments = async (req, res) => {
  try {
    // Check if user is properly authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: 'Authentication required', 
        code: 'AUTH_REQUIRED',
        details: 'You must be logged in to access documents'
      });
    }
    
    const documents = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ 
      message: 'Failed to fetch documents', 
      code: 'DOCUMENT_FETCH_ERROR',
      details: 'An error occurred while retrieving your documents',
      error: error.message 
    });
  }
};

// Get a single document by ID
export const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Failed to fetch document', error: error.message });
  }
};

// Upload a new document file
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, path: filePath, size } = req.file;
    const { name, tags } = req.body;
    
    // Determine document type from mimetype
    let type = 'text';
    if (mimetype.includes('pdf')) type = 'pdf';
    else if (mimetype.includes('image')) type = 'image';
    else if (mimetype.includes('word')) type = 'doc';
    
    // Create new document in database
    const document = await Document.create({
      name: name || originalname,
      type,
      filePath,
      user: req.user.id,
      fileSize: size,
      mimeType: mimetype,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      processed: false // Will be processed asynchronously
    });
    
    // Start processing document asynchronously (e.g., text extraction)
    // This would typically be handled by a queue or background job
    // For now, we'll just mark it as processed
    document.processed = true;
    await document.save();
    
    res.status(201).json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Failed to upload document', error: error.message });
  }
};

// Create a new URL document
export const createUrlDocument = async (req, res) => {
  try {
    const { name, url, tags } = req.body;
    
    if (!name || !url) {
      return res.status(400).json({ message: 'Name and URL are required' });
    }
    
    // Create new document in database
    const document = await Document.create({
      name,
      type: 'url',
      url,
      user: req.user.id,
      tags: tags || [],
      processed: true // URL documents are considered processed immediately
    });
    
    res.status(201).json(document);
  } catch (error) {
    console.error('Error creating URL document:', error);
    res.status(500).json({ message: 'Failed to create URL document', error: error.message });
  }
};

// Update a document
export const updateDocument = async (req, res) => {
  try {
    const { name, tags } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (tags) updates.tags = tags;
    
    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true }
    );
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.status(200).json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Failed to update document', error: error.message });
  }
};

// Delete a document
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // If it's a file document, delete the file from the filesystem
    if (document.filePath) {
      const fullPath = path.resolve(document.filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    await Document.deleteOne({ _id: req.params.id });
    
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Failed to delete document', error: error.message });
  }
};