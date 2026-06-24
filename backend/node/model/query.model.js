import mongoose from 'mongoose';

const querySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FinWiseIntelligentUser',
            required: true,
            index: true
        },

        // Original user question
        queryText: {
            type: String,
            required: true,
            trim: true
        },

        // Query route selected by RAG
        // "table" | "text"
        route: {
            type: String,
            default: null
        },

        // Full retrieval evidence from FastAPI
        retrievedContexts: [
            {
                rank: Number,

                // text | table
                type: { type: String },

                score: Number,

                section: String,

                page: Number,

                chunk: {
    type: String,
    default: null
},

context: {
    type: String,
    default: null
},

content: {
    type: String,
    default: null
},

                sourceRef: String
            }
        ],

        // Gemini generated answer
        llmAnswer: {
            type: String,
            default: null
        },

        // Sources used by Gemini
        sources: [
            {
                section: String,

                page: Number,

                type: { type: String }
            }
        ],

        isPinned: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "FinWiseIntelligentQuery",
    querySchema
);
