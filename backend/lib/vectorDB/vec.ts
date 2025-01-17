import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from 'fs/promises';
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: "embedding-001",
});
class VectorStoreManager {
    private vectorStore: FaissStore | null = null;
    /**
     * Creates a new FAISS vector store from documents
     * @param documents Array of documents to store
     */
    async createVectorStore(documents: Document[]): Promise<void> {
        try {
            this.vectorStore = await FaissStore.fromDocuments(
                documents,
                embeddings
            );
            console.log("Vector store created successfully");
        } catch (error) {
            console.error("Error creating vector store:", error);
            throw error;
        }
    }
    /**
     * Saves the vector store to disk
     * @param directory Directory to save the vector store
     */
    async saveVectorStore(directory: string): Promise<void> {
        if (!this.vectorStore) {
            throw new Error("Vector store not initialized");
        }
        try {
            await this.vectorStore.save(directory);
            console.log("Vector store saved successfully");
        } catch (error) {
            console.error("Error saving vector store:", error);
            throw error;
        }
    }
    /**
     * Loads a vector store from disk
     * @param directory Directory containing the vector store
     */
    async loadVectorStore(directory: string): Promise<void> {
        try {
            this.vectorStore = await FaissStore.load(
                directory,
                embeddings
            );
            console.log("Vector store loaded successfully");
        } catch (error) {
            console.error("Error loading vector store:", error);
            throw error;
        }
    }
    /**
     * Performs semantic search on the vector store
     * @param query Search query
     * @param k Number of results to return
     * @returns Array of documents with their similarity scores
     */
    async semanticSearch(query: string, k: number = 5): Promise<Array<[Document, number]>> {
        if (!this.vectorStore) {
            throw new Error("Vector store not initialized");
        }
        try {
            const results = await this.vectorStore.similaritySearchWithScore(query, k);
            return results;
        } catch (error) {
            console.error("Error performing semantic search:", error);
            throw error;
        }
    }
    /**
     * Adds new documents to the existing vector store
     * @param documents Array of new documents to add
     */
    async addDocuments(documents: Document[]): Promise<void> {
        if (!this.vectorStore) {
            throw new Error("Vector store not initialized");
        }
        try {
            await this.vectorStore.addDocuments(documents);
            console.log("Documents added successfully");
        } catch (error) {
            console.error("Error adding documents:", error);
            throw error;
        }
    }
}
class ChunkedVectorStoreManager extends VectorStoreManager {
    private textSplitter: RecursiveCharacterTextSplitter;
    constructor(
        chunkSize: number = 1000,
        chunkOverlap: number = 200
    ) {
        super();
        this.textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize,
            chunkOverlap,
        });
    }
    /**
     * Creates a vector store from a text file by reading and chunking it
     * @param filePath Path to the text file
     * @param metadata Optional metadata to attach to each chunk
     * @returns Promise<void>
     */
    async createVectorStoreFromFile(
        filePath: string,
        metadata: Record<string, any> = {}
    ): Promise<void> {
        try {
            const text = await fs.readFile(filePath, 'utf-8');
            const chunks = await this.textSplitter.splitText(text);
            const documents = chunks.map((chunk, index) => {
                return new Document({
                    pageContent: chunk,
                    metadata: {
                        ...metadata,
                        source: filePath,
                        chunk: index + 1,
                        totalChunks: chunks.length
                    }
                });
            });
            await this.createVectorStore(documents);
            console.log(`Successfully processed ${filePath}:`);
            console.log(`- Created ${chunks.length} chunks`);
            console.log(`- Average chunk size: ${Math.round(text.length / chunks.length)} characters`);
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
            throw error;
        }
    }
}
async function createVectorStore() {
    const manager = new ChunkedVectorStoreManager(
        1000,
        200
    );
    await manager.createVectorStoreFromFile(
        'data.txt',
        { category: 'vectpr_store', language: 'english' }
    );
    await manager.saveVectorStore('./vector_store');
}
export async function getContext(query: string): Promise<string> {
    const manager = new VectorStoreManager();

    await manager.loadVectorStore("vector_store");

    const searchResults = await manager.semanticSearch(
        query,
        3
    );
    let results = "";
    searchResults.forEach(([doc, score], index) => {
        results += `Result ${index + 1}:\n`;
        results += `Score: ${score}\n`;
        results += `Content: ${doc.pageContent}\n`;
        results += `========================================================\n`;
    });
    return results;
}
// getContext("what is housing cost ratio?").then(console.log);