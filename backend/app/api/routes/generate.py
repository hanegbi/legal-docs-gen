from fastapi import APIRouter, HTTPException
from app.models.schemas import GenerateRequest, GenerateResponse, ConfigResponse
from app.services.generator import generate_legal_documents
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/generate", response_model=GenerateResponse)
async def generate_documents(request: GenerateRequest):
    try:
        logger.info(f"Generating documents for {request.product_vars.product_name}")
        
        result = generate_legal_documents(
            product_vars=request.product_vars.model_dump(),
            docs=request.docs,
            tone=request.tone,
            jurisdictions=request.jurisdictions
        )
        
        return GenerateResponse(**result)
    
    except Exception as e:
        logger.error(f"Error generating documents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/config", response_model=ConfigResponse)
async def get_config():
    return ConfigResponse()

