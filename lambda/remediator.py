import boto3
import json

def handler(event, context):
    """
    Executes security remediation actions.
    Expected Input: { "action": "EnableCloudTrail", "resource_id": "optional-arn" }
    """
    print(f"Received remediation request: {json.dumps(event)}")
    
    action = event.get('action')
    # resource_id = event.get('resource_id') 
    
    status = "FAILED"
    message = "Unknown action"
    
    try:
        if action == "EnableCloudTrail":
            ct = boto3.client('cloudtrail')
            # For resilience, list all trails and ensure they are logging
            trails = ct.list_trails()
            remediated_trails = []
            
            for trail in trails.get('Trails', []):
                trail_arn = trail['TrailARN']
                print(f"Enabling logging for: {trail_arn}")
                ct.start_logging(Name=trail_arn)
                remediated_trails.append(trail_arn)
            
            if remediated_trails:
                status = "SUCCESS"
                message = f"Re-enabled logging for {len(remediated_trails)} CloudTrail(s)."
            else:
                status = "SKIPPED"
                message = "No CloudTrails found in this region."

        else:
            message = f"Action '{action}' is not supported yet."

    except Exception as e:
        print(f"Error: {e}")
        status = "ERROR"
        message = str(e)
            
    return {
        "status": status,
        "message": message
    }
