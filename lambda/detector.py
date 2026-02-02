import json
import logging
import boto3
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize Bedrock Runtime
bedrock = boto3.client(service_name='bedrock-runtime', region_name='us-east-1')

# Model ID for Claude 3.5 Sonnet
MODEL_ID = "anthropic.claude-3-5-sonnet-20240620-v1:0"

def handler(event, context):
    """
    Analyzes the incoming EventBridge event using Amazon Bedrock (Claude 3.5 Sonnet).
    """
    logger.info("Event received: %s", json.dumps(event, indent=2))
    
    try:
        # Prepare the prompt for Bedrock
        prompt = f"""
        You are a Cloud Security Expert. Analyze the following AWS CloudTrail event for security risks.
        
        Event JSON:
        {json.dumps(event)}
        
        Task:
        1. Identify the action performed.
        2. Assess the risk level (LOW, MEDIUM, HIGH, CRITICAL).
        3. Explain your reasoning.
        
        IMPORTANT: Return ONLY a valid JSON object. Do not include any text outside the JSON.
        Format:
        {{
            "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
            "reasoning": "string",
            "action_summary": "string"
        }}
        """
        
        # Payload for Claude 3 (Messages API)
        payload = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": [
                {
                    "role": "user",
                    "content": [{"type": "text", "text": prompt}]
                }
            ]
        }
        
        # Invoke Bedrock
        response = bedrock.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(payload)
        )
        
        # Parse output
        result_body = json.loads(response['body'].read())
        ai_response_text = result_body['content'][0]['text']
        
        # Try to parse the AI's JSON response
        try:
            ai_data = json.loads(ai_response_text)
        except json.JSONDecodeError:
            # Fallback if AI fails to return valid JSON
            logger.warning("AI did not return valid JSON. Raw: %s", ai_response_text)
            ai_data = {
                "risk_level": "UNKNOWN",
                "reasoning": ai_response_text,
                "action_summary": "Analysis failed to parse"
            }
        
        logger.info("AI Analysis: %s", json.dumps(ai_data))
        
        # Return simple dict for Step Functions
        return {
            "risk_level": ai_data.get("risk_level", "UNKNOWN"),
            "full_analysis": ai_data,
            "original_event": event
        }
        
    except Exception as e:
        logger.error("Error invoking Bedrock: %s", str(e))
        raise e # Let Lambda fail so Step Functions knows
