import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Query from '../model/query.model.js';
import User from '../model/user.model.js';

console.log(Query.schema.obj.retrievedContexts);

export async function getContextualQueries(req, res) {
    const userId = req.user.userId;
    console.log(`User ID from auth middleware: ${userId}`);
    const { query } = req.body;
    console.log(`Received query: ${query}`);

    if (!query || !query.trim()) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const pythonResponse = await fetch(
            `${process.env.FASTAPI_URL}/search`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            }
        );

        if (!pythonResponse.ok) {
            throw new Error(`FastAPI Search Failed: ${pythonResponse.status}`);
        }

        const retrievalData = await pythonResponse.json();

        console.log("\n=== FASTAPI RETRIEVAL RESPONSE ===");
        console.dir(retrievalData, { depth: null });

        const retrievedContexts = retrievalData.results.map((item, index) => ({
            rank: index + 1,
            type: item.type,
            score: item.score,
            section: item.section,
            page: item.page || null,
            chunk: item.chunk || null,
            context: item.context || null,
            content: item.content || null,
            sourceRef: `${item.section}`
        }));

        const newQueryRecord = new Query({
            userId: userId,
            queryText: query,
            route: retrievalData.route,
            retrievedContexts,
            llmAnswer: null,
            isPinned: false
        });

        await newQueryRecord.save();

        return res.status(201).json({
            success: true,
            queryId: newQueryRecord._id,
            query: query,
            route: retrievalData.route,
            retrievedContexts
        });
    } catch (error) {
        console.error("Error fetching contextual queries:", error);
        return res.status(500).json({ error: "Internal server error processing retrieval" });
    }
}

export async function summarizeQuery(req, res) {
    const { queryId } = req.body;

    if (!queryId) {
        return res.status(400).json({ error: "Query ID is required" });
    }

    try {
        const existingQuery = await Query.findById(queryId);

        if (!existingQuery) {
            return res.status(404).json({ error: "Query record not found" });
        }

        const pythonResponse = await fetch(
            `${process.env.FASTAPI_URL}/summarize`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: existingQuery.queryText })
            }
        );

        if (!pythonResponse.ok) {
            const isRateLimit = pythonResponse.status === 429 || pythonResponse.status === 503;
            return res.status(pythonResponse.status).json({
                error: isRateLimit
                    ? "AI models are currently at capacity. Please try again in a minute."
                    : "Failed to generate AI insight."
            });
        }

        const aiData = await pythonResponse.json();

        console.log("\n=== FASTAPI SUMMARY ===");
        console.dir(aiData, { depth: null });

        existingQuery.llmAnswer = aiData.answer;
        existingQuery.sources = aiData.sources || [];
        await existingQuery.save();

        return res.status(200).json({
            success: true,
            queryId: existingQuery._id,
            answer: aiData.answer,
            sources: aiData.sources || []
        });
    } catch (error) {
        console.error("Error summarizing query:", error);
        return res.status(500).json({ error: "Internal server error executing synthesis" });
    }
}

export async function historyManagement(req, res) {
    const userId = req.user.userId;
    try {
        const history = await Query.find({ userId: userId }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching query history:', error);
        res.status(500).json({ error: 'Internal server error fetching workspace rows' });
    }
}

export async function pinQuery(req, res) {
    try {
        const item = await Query.findById(req.params.id);
        if (!item || item.userId.toString() !== req.user.userId) {
            return res.status(404).json({ error: 'Query item not found or unauthorized' });
        }
        console.log('Pinning query item:', item);
        item.isPinned = !item.isPinned;
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        console.error('Error pinning query:', error);
        res.status(500).json({ error: 'Internal server error managing pinning states' });
    }
}

export async function deleteQuery(req, res) {
    const { id } = req.params;
    console.log(`Attempting to delete query with ID: ${id}`);
    try {
        const result = await Query.deleteOne({ _id: req.params.id, userId: req.user.userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Query item not found or unauthorized' });
        }
        res.status(200).json({ message: 'Query deleted successfully from analytics log' });
    } catch (error) {
        console.error('Error deleting query:', error);
        res.status(500).json({ error: 'Internal server error deleting record log' });
    }
}

export async function getQueryById(req, res) {
    try {
        const query = await Query.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });
        console.log(`Fetched query by ID: ${JSON.stringify(query)}`);
        if (!query) {
            return res.status(404).json({ error: "Query not found" });
        }
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch query" });
    }
}