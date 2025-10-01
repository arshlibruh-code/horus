/**
 * TEST-MODULES.JS - Test Response and Audio Modules
 * Simple testing script to validate module functionality
 */

// ============================================================================
// TEST CONFIGURATION
// ============================================================================


// Voice settings and orb functions are now handled by audio.js and orb.js modules

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

/**
 * Test AI response module
 */
async function testAIResponseModule() {
    console.log('\n=== TESTING AI RESPONSE MODULE ===');
    
    try {
        // Test basic AI response
        console.log('\n--- Testing Basic AI Response ---');
        const userInput = 'hello there';
        console.log('User Input:', userInput);
        
        const response = await AI.getAIResponse(userInput);
        console.log('AI Response:', response);
        
        // Test complex AI response
        console.log('\n--- Testing Complex AI Response ---');
        const complexInput = 'explain how machine learning works';
        console.log('User Input:', complexInput);
        
        const complexResponse = await AI.getAIResponse(complexInput);
        console.log('AI Response:', complexResponse);
        
        // Test AI response format validation
        console.log('\n--- Testing Response Format ---');
        const lines = response.split('\n').filter(line => line.trim().startsWith('-'));
        console.log('Bullet points found:', lines.length);
        console.log('Format validation:', lines.every(line => line.includes('[') && line.includes(']')));
        
        console.log('\n✅ AI RESPONSE MODULE TESTS COMPLETED');
        
    } catch (error) {
        console.error('❌ AI RESPONSE MODULE TEST FAILED:', error);
    }
}

/**
 * Test audio module
 */
async function testAudioModule() {
    console.log('\n=== TESTING AUDIO MODULE ===');
    
    try {
        // Test single audio generation
        console.log('\n--- Testing Single Audio Generation ---');
        const testText = 'Hello there!';
        const voiceId = AudioModule.voices.liam;
        const agent = 'liam';
        
        console.log('Generating audio for:', testText);
        const audioBuffer = await AudioModule.generateSpeech(testText, voiceId, agent);
        console.log('Audio buffer generated, size:', audioBuffer.byteLength, 'bytes');
        
        // Test multiple audio generation
        console.log('\n--- Testing Multiple Audio Generation ---');
        const sentences = ['Hello there!', 'How are you doing?'];
        console.log('Generating audio for sentences:', sentences);
        
        const audioBuffers = await AudioModule.generateMultipleAudio(sentences, voiceId, agent);
        console.log('Generated', audioBuffers.length, 'audio buffers');
        
        console.log('\n✅ AUDIO MODULE TESTS COMPLETED');
        
    } catch (error) {
        console.error('❌ AUDIO MODULE TEST FAILED:', error);
    }
}

/**
 * Test complete workflow with new modules
 */
async function testCompleteWorkflow() {
    console.log('\n=== TESTING COMPLETE WORKFLOW (NEW MODULES) ===');
    
    try {
        const userInput = 'hey there';
        console.log('User Input:', userInput);
        
        // Step 1: Get AI response using airesponse.js
        console.log('\n--- Step 1: Getting AI Response ---');
        const aiResponse = await AI.getAIResponse(userInput);
        console.log('AI Response:', aiResponse);
        
        // Step 2: Process for audio (split bullet points)
        console.log('\n--- Step 2: Processing for Audio ---');
        const sentences = aiResponse
            .split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.trim().substring(2))
            .filter(s => s.length > 0);
        console.log('Sentences for audio:', sentences);
        
        // Step 3: Generate audio using audio.js
        console.log('\n--- Step 3: Generating Audio ---');
        const voiceId = AudioModule.voices.liam;
        const agent = 'liam';
        
        await AudioModule.streamingAudioPlayback(sentences, voiceId, agent);
        console.log('Audio generation and playback completed');
        
        console.log('\n✅ COMPLETE WORKFLOW TEST COMPLETED');
        
    } catch (error) {
        console.error('❌ COMPLETE WORKFLOW TEST FAILED:', error);
    }
}

// ============================================================================
// RUN TESTS
// ============================================================================

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('🚀 STARTING MODULE TESTS (UPDATED)');
    console.log('==================================');
    
    try {
        await testAIResponseModule();
        await testAudioModule();
        await testCompleteWorkflow();
        
        console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY');
        
    } catch (error) {
        console.error('\n💥 TESTS FAILED:', error);
    }
}

// Auto-run tests if this script is executed directly
if (typeof window !== 'undefined') {
    // Browser environment
    console.log('Running tests in browser...');
    runAllTests();
} else {
    // Node.js environment
    console.log('Running tests in Node.js...');
    runAllTests();
}
