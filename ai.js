/**
 * AIRESPONSE.JS - Simple AI Response Generator
 * Step-by-step implementation
 */

// Simple AI response with bullet list format
async function getAIResponse(userInput) {
    console.log('AI: Getting response for:', userInput);
    
    try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'sonar',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a witty, direct AI assistant. Be SHORT, CLEVER, and FUNNY. Respond ONLY with bullet points in this EXACT format:\n- [emotional_tag] sentence [human_sound]\n- [emotional_tag] sentence [human_sound]\n\nEMOTIONAL TAGS (choose ONE per sentence):\n- [warmly], [cheerfully], [playfully], [casually]\n- [curiously], [thoughtfully], [interested]\n- [confident], [calm], [patiently], [clearly]\n- [carefully], [methodically], [expertly]\n- [helpfully], [informatively]\n\nHUMAN SOUNDS (add naturally):\n- [breathing], [sighs], [hmm], [ah], [oh]\n- [well], [you know], [actually], [basically]\n- [so], [right], [okay]\n\nRULES:\n1. MAXIMUM 2 sentences\n2. ONE emotional tag + ONE human sound per sentence\n3. Keep each sentence under 10 words\n4. Be WITTY and DIRECT\n5. NO explanations\n6. NO markdown\n7. NO citations [1][2][3]\n8. NO extra words\n9. Be FUNNY when appropriate\n10. Keep it SHORT and CLEVER'
                    },
                    {role: 'user', content: userInput}
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        let aiResponse = data.choices[0].message.content;
        
        // Remove thinking tags from reasoning models
        if (aiResponse.includes('<think>')) {
            const thinkStart = aiResponse.indexOf('<think>');
            const thinkEnd = aiResponse.indexOf('</think>');
            if (thinkStart !== -1 && thinkEnd !== -1) {
                aiResponse = aiResponse.substring(thinkEnd + 8).trim();
            }
        }
        
        console.log('AI: Raw response:', aiResponse);
        return aiResponse;
        
    } catch (error) {
        console.error('AI: Error:', error);
        return '- [warmly] Hello there! [cheerfully] How can I help?';
    }
}

// Test function with 3 questions
function testAI() {
    console.log('=== TESTING AI RESPONSE - 3 QUESTIONS ===');
    
    const questions = [
        'hey there',
        'explain how machine learning works in simple terms',
        'describe the detailed process of photosynthesis including light-dependent and light-independent reactions'
    ];
    
    return new Promise(async (resolve, reject) => {
        try {
            for (let i = 0; i < questions.length; i++) {
                console.log(`\n--- QUESTION ${i + 1}/3 ---`);
                console.log('Input:', questions[i]);
                const response = await getAIResponse(questions[i]);
                console.log('Response:', response);
                console.log('---');
            }
            console.log('=== TEST COMPLETE ===');
            console.log('Promise resolving now...');
            resolve('Test completed successfully');
        } catch (error) {
            console.error('Test failed:', error);
            console.log('Promise rejecting now...');
            reject(error);
        }
    });
}

// Export for browser
if (typeof window !== 'undefined') {
    window.AI = {
        getAIResponse,
        testAI
    };
}
