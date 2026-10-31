import { Router } from 'express';
import { groqService } from '../services/groq.js';
import { config } from '../config.js';
import { TASK_1_DESCRIPTORS, TASK_2_DESCRIPTORS } from '../services/bandDescriptors.js';
const router = Router();
// List Groq models or active configuration
router.get('/', async (req, res) => {
    const apiKeyOverride = req.headers['x-groq-api-key'] || undefined;
    const result = await groqService.listAvailableModels(apiKeyOverride);
    res.json({
        activeConfig: {
            textModel: config.groq.textModel,
            visionModel: config.groq.visionModel,
            isApiKeyConfigured: Boolean(config.groq.apiKey)
        },
        groqLiveModels: result
    });
});
// Returns official descriptors for inspection/learning
router.get('/descriptors/:taskType', (req, res) => {
    const taskType = req.params.taskType;
    if (taskType === 'task1') {
        res.json(TASK_1_DESCRIPTORS);
    }
    else if (taskType === 'task2') {
        res.json(TASK_2_DESCRIPTORS);
    }
    else {
        res.status(404).json({ error: 'Descriptor type not found. Use task1 or task2.' });
    }
});
export default router;
