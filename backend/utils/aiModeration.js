// AI Moderation utility - detects offensive content
// In production, integrate with services like OpenAI Moderation API or Perspective API

const offensiveKeywords = [
  'hate', 'kill', 'die', 'stupid', 'idiot', 'offensive',
  // Add more keywords as needed
];

export const moderateContent = async (text) => {
  try {
    // Simple keyword-based moderation
    const lowerText = text.toLowerCase();
    
    for (const keyword of offensiveKeywords) {
      if (lowerText.includes(keyword)) {
        return {
          isOffensive: true,
          flag: `Contains potentially offensive content: "${keyword}"`,
          confidence: 0.8
        };
      }
    }

    // Check for excessive caps (shouting)
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (capsRatio > 0.7 && text.length > 10) {
      return {
        isOffensive: true,
        flag: 'Excessive use of capital letters',
        confidence: 0.6
      };
    }

    // In production, call external AI moderation API here
    // Example: OpenAI Moderation API
    /*
    const response = await axios.post('https://api.openai.com/v1/moderations', {
      input: text
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    
    if (response.data.results[0].flagged) {
      return {
        isOffensive: true,
        flag: 'Flagged by AI moderation',
        confidence: 0.9
      };
    }
    */

    return {
      isOffensive: false,
      flag: '',
      confidence: 0.9
    };
  } catch (error) {
    console.error('Moderation error:', error);
    return {
      isOffensive: false,
      flag: '',
      confidence: 0
    };
  }
};
